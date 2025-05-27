import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Search, FileText } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ExpenseCard from '@/components/ExpenseCard';
import EmptyState from '@/components/EmptyState';
import { useExpenseStore } from '@/store/expenseStore';
import { Expense } from '@/types';

export default function ExpensesScreen() {
  const router = useRouter();
  const { expenses, fetchExpenses, isLoading } = useExpenseStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  const filteredExpenses = expenses.filter(expense => 
    expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedExpenses = [...filteredExpenses].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const renderItem = ({ item }: { item: Expense }) => (
    <ExpenseCard expense={item} />
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search expenses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={Colors.subtext} />}
          containerStyle={styles.searchInput}
        />
      </View>
      
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={sortedExpenses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <EmptyState
              title="No expenses found"
              description={
                searchQuery 
                  ? "Try adjusting your search query" 
                  : "Start tracking your expenses by adding your first one"
              }
              actionLabel={searchQuery ? "Clear Search" : "Add Expense"}
              onAction={searchQuery ? () => setSearchQuery('') : () => router.push('/add-expense')}
              icon={<FileText size={48} color={Colors.subtext} />}
            />
          }
        />
      )}
      
      <View style={styles.addButtonContainer}>
        <Button
          title="Add New Expense"
          onPress={() => router.push('/add-expense')}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    marginBottom: 0,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});