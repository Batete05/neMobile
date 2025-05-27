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
import { DollarSign, Tag, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useBudgetStore } from '@/store/budgetStore';
import { useToastStore } from '@/store/toastStore';
import { validateAmount, validateRequired } from '@/utils/validation';

const PERIOD_OPTIONS = ['daily', 'weekly', 'monthly'] as const;

export default function CreateBudgetScreen() {
  const router = useRouter();
  const { addBudget } = useBudgetStore();
  const showToast = useToastStore((state) => state.showToast);
  
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  
  const [categoryError, setCategoryError] = useState('');
  const [limitError, setLimitError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    if (!validateRequired(category)) {
      setCategoryError('Category is required');
      isValid = false;
    } else {
      setCategoryError('');
    }
    
    if (!validateAmount(limit)) {
      setLimitError('Please enter a valid amount');
      isValid = false;
    } else {
      setLimitError('');
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      try {
        addBudget({
          category,
          limit: parseFloat(limit),
          period,
        });
        
        showToast('Budget created successfully', 'success');
        router.back();
      } catch (error) {
        showToast('Failed to create budget', 'error');
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
            <Text style={styles.title}>Create Budget</Text>
            <Text style={styles.subtitle}>
              Set spending limits for different categories
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              label="Category"
              placeholder="e.g., Food, Transport, Entertainment"
              value={category}
              onChangeText={setCategory}
              leftIcon={<Tag size={20} color={Colors.subtext} />}
              error={categoryError}
            />
            
            <Input
              label="Budget Limit"
              placeholder="0.00"
              value={limit}
              onChangeText={setLimit}
              keyboardType="decimal-pad"
              leftIcon={<DollarSign size={20} color={Colors.subtext} />}
              error={limitError}
            />
            
            <Text style={styles.label}>Budget Period</Text>
            <View style={styles.periodOptions}>
              {PERIOD_OPTIONS.map((option) => (
                <TouchableWithoutFeedback 
                  key={option}
                  onPress={() => setPeriod(option)}
                >
                  <View style={[
                    styles.periodOption,
                    period === option && styles.periodOptionSelected
                  ]}>
                    <Text style={[
                      styles.periodOptionText,
                      period === option && styles.periodOptionTextSelected
                    ]}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              ))}
            </View>
            
            <View style={styles.actions}>
              <Button
                title="Cancel"
                onPress={() => router.back()}
                variant="outline"
                style={styles.cancelButton}
              />
              
              <Button
                title="Create Budget"
                onPress={handleSubmit}
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
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  periodOptions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  periodOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  periodOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodOptionText: {
    color: Colors.text,
    fontWeight: '500',
  },
  periodOptionTextSelected: {
    color: Colors.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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