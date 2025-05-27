import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Plus, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import BudgetProgressBar from '@/components/BudgetProgressBar';
import EmptyState from '@/components/EmptyState';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { useBudgetStore } from '@/store/budgetStore';
import { useToastStore } from '@/store/toastStore';
import { Budget } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export default function BudgetsScreen() {
  const router = useRouter();
  const { budgets, deleteBudget } = useBudgetStore();
  const showToast = useToastStore((state) => state.showToast);
  
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteBudget = async () => {
    if (!selectedBudget) return;
    
    setIsDeleting(true);
    try {
      deleteBudget(selectedBudget.id);
      showToast('Budget deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete budget', 'error');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogVisible(false);
      setSelectedBudget(null);
    }
  };

  const confirmDelete = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsDeleteDialogVisible(true);
  };

  const renderBudgetItem = ({ item }: { item: Budget }) => (
    <View style={styles.budgetItem}>
      <View style={styles.budgetHeader}>
        <View>
          <Text style={styles.budgetCategory}>{item.category}</Text>
          <Text style={styles.budgetPeriod}>{item.period}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => confirmDelete(item)}
        >
          <Trash2 size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
      
      <BudgetProgressBar
        label={`${formatCurrency(item.spent)} of ${formatCurrency(item.limit)}`}
        spent={item.spent}
        limit={item.limit}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Your Budgets</Text>
        <Button
          title="Add Budget"
          onPress={() => router.push('/budgets/create')}
          leftIcon={<Plus size={16} color={Colors.white} />}
        />
      </View>
      
      <FlatList
        data={budgets}
        renderItem={renderBudgetItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No budgets yet"
            description="Create budgets to track your spending limits"
            actionLabel="Create Budget"
            onAction={() => router.push('/budgets/create')}
          />
        }
      />
      
      <ConfirmationDialog
        visible={isDeleteDialogVisible}
        title="Delete Budget"
        message={`Are you sure you want to delete the budget for ${selectedBudget?.category}?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteBudget}
        onCancel={() => setIsDeleteDialogVisible(false)}
        isLoading={isDeleting}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  budgetItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  budgetPeriod: {
    fontSize: 14,
    color: Colors.subtext,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: 8,
  },
});