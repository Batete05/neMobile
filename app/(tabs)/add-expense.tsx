import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { DollarSign, FileText, Tag } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useExpenseStore } from '@/store/expenseStore';
import { useBudgetStore } from '@/store/budgetStore';
import { useToastStore } from '@/store/toastStore';
import { validateAmount, validateRequired } from '@/utils/validation';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addExpense, isLoading } = useExpenseStore();
  const { updateSpent, isBudgetExceeded } = useBudgetStore();
  const showToast = useToastStore((state) => state.showToast);
  
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!validateRequired(name)) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!validateAmount(amount)) {
      setAmountError('Please enter a valid amount');
      isValid = false;
    } else {
      setAmountError('');
    }
    
    if (!validateRequired(description)) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await addExpense({
          name,
          amount,
          description,
          category: category || 'Uncategorized',
        });
        
        // Update budget spent amount if category is provided
        if (category) {
          updateSpent(category, parseFloat(amount));
          
          // Check if budget is exceeded after adding expense
          if (isBudgetExceeded(category)) {
            showToast(`Budget exceeded for ${category}!`, 'warning');
          }
        }
        
        showToast('Expense added successfully', 'success');
        
        // Reset form
        setName('');
        setAmount('');
        setDescription('');
        setCategory('');
        
        // Navigate to expenses list
        router.push('/expense');
      } catch (error) {
        showToast('Failed to add expense', 'error');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="dark" />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Add New Expense</Text>
            <Text style={styles.subtitle}>
              Track your spending by adding a new expense
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Expense Name"
              placeholder="What did you spend on?"
              value={name}
              onChangeText={setName}
              leftIcon={<FileText size={20} color={Colors.subtext} />}
              error={nameError}
            />
            
            <Input
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              leftIcon={<DollarSign size={20} color={Colors.subtext} />}
              error={amountError}
            />
            
            <Input
              label="Description"
              placeholder="Add details about this expense"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={styles.textArea}
              error={descriptionError}
            />
            
            <Input
              label="Category (Optional)"
              placeholder="e.g., Food, Transport, Entertainment"
              value={category}
              onChangeText={setCategory}
              leftIcon={<Tag size={20} color={Colors.subtext} />}
            />
            
            <View style={styles.actions}>
              <Button
                title="Cancel"
                onPress={() => router.back()}
                variant="outline"
                style={styles.cancelButton}
              />
              
              <Button
                title="Save Expense"
                onPress={handleSubmit}
                isLoading={isLoading}
                style={styles.saveButton}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});