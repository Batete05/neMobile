import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Expense } from '@/types';
import Colors from '@/constants/Colors';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { ArrowRight } from 'lucide-react-native';

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/expenses/${expense.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{expense.name}</Text>
          <Text style={styles.date}>{formatDate(expense.createdAt)}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {expense.description}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.amount}>
            {formatCurrency(parseFloat(expense.amount))}
          </Text>
          <ArrowRight size={16} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  date: {
    fontSize: 12,
    color: Colors.subtext,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
});