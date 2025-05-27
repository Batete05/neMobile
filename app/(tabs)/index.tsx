import BudgetProgressBar from '@/components/BudgetProgressBar';
import Button from '@/components/Button';
import ExpenseCard from '@/components/ExpenseCard';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { useBudgetStore } from '@/store/budgetStore';
import { useExpenseStore } from '@/store/expenseStore';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertTriangle, DollarSign } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { expenses, fetchExpenses, isLoading: expensesLoading } = useExpenseStore();
  const { budgets } = useBudgetStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const recentExpenses = [...expenses].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 3);

  const exceedingBudgets = budgets.filter(budget => budget.spent > budget.limit);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
          <Button
            title="Logout"
            onPress={logout}
            variant="outline"
            size="small"
          />
        </View>
        
        <View style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <DollarSign size={32} color={Colors.primary} />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryValue}>{formatCurrency(totalSpent)}</Text>
              <Text style={styles.summarySubtext}>
                {expenses.length} expense{expenses.length !== 1 ? 's' : ''} this month
              </Text>
            </View>
          </View>
        </View>
        
        {exceedingBudgets.length > 0 && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color={Colors.error} />
              <Text style={styles.alertTitle}>Budget Alert</Text>
            </View>
            <Text style={styles.alertText}>
              You have {exceedingBudgets.length} budget{exceedingBudgets.length > 1 ? 's' : ''} that exceeded the limit
            </Text>
            <Button
              title="View Budgets"
              onPress={() => router.push('/budget')}
              variant="outline"
              size="small"
              style={styles.alertButton}
            />
          </View>
        )}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget Overview</Text>
            <Button
              title="Manage"
              onPress={() => router.push('/budget')}
              variant="outline"
              size="small"
            />
          </View>
          
          {budgets.length > 0 ? (
            budgets.slice(0, 3).map((budget) => (
              <BudgetProgressBar
                key={budget.id}
                label={budget.category}
                spent={budget.spent}
                limit={budget.limit}
              />
            ))
          ) : (
            <View style={styles.emptyBudgets}>
              <Text style={styles.emptyText}>No budgets set yet</Text>
              <Button
                title="Create Budget"
                onPress={() => router.push('/budgets/create')}
                variant="primary"
                size="small"
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <Button
              title="View All"
              onPress={() => router.push('/expense')}
              variant="outline"
              size="small"
            />
          </View>
          
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <View style={styles.emptyExpenses}>
              <Text style={styles.emptyText}>No expenses recorded yet</Text>
              <Button
                title="Add Expense"
                onPress={() => router.push('/add-expense')}
                variant="primary"
                size="small"
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTextContainer: {
    marginLeft: 20,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: Colors.subtext,
    fontWeight: '500',
  },
  alertCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  alertButton: {
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  emptyBudgets: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyExpenses: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 16,
  },
  emptyButton: {
    minWidth: 150,
  },
});