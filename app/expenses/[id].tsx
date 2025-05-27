import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Calendar, Clock, DollarSign, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useExpenseStore } from '@/store/expenseStore';
import { useToastStore } from '@/store/toastStore';
import { formatDateTime, formatCurrency } from '@/utils/formatters';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { expenses, deleteExpense, isLoading } = useExpenseStore();
  const showToast = useToastStore((state) => state.showToast);
  
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Expense not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.notFoundButton}
        />
      </View>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteExpense(id);
      showToast('Expense deleted successfully', 'success');
      router.replace('/expense');
    } catch (error) {
      showToast('Failed to delete expense', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{expense.name}</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => setIsDeleteDialogVisible(true)}
            >
              <Trash2 size={24} color={Colors.error} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {formatCurrency(parseFloat(expense.amount))}
            </Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Calendar size={20} color={Colors.subtext} />
              <Text style={styles.detailText}>
                {formatDateTime(expense.createdAt)}
              </Text>
            </View>
            
            {expense.category && (
              <View style={styles.detailItem}>
                <DollarSign size={20} color={Colors.subtext} />
                <Text style={styles.detailText}>
                  Category: {expense.category}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{expense.description}</Text>
          </View>
        </View>
        
        <Button
          title="Back to Expenses"
          onPress={() => router.push('/expense')}
          variant="outline"
          style={styles.backButton}
        />
      </ScrollView>
      
      <ConfirmationDialog
        visible={isDeleteDialogVisible}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogVisible(false)}
        isLoading={isLoading}
        confirmVariant="danger"
      />
    </View>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  amountContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 8,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  notFoundButton: {
    minWidth: 150,
  },
});