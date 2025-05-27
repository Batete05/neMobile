import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { formatCurrency } from '@/utils/formatters';

interface BudgetProgressBarProps {
  spent: number;
  limit: number;
  label: string;
}

export default function BudgetProgressBar({ spent, limit, label }: BudgetProgressBarProps) {
  const percentage = Math.min((spent / limit) * 100, 100);
  
  const getProgressColor = () => {
    if (percentage >= 100) return Colors.error;
    if (percentage >= 75) return Colors.warning;
    return Colors.success;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${percentage}%`,
              backgroundColor: getProgressColor(),
            }
          ]} 
        />
      </View>
      
      <Text style={[styles.percentage, { color: getProgressColor() }]}>
        {percentage.toFixed(0)}%
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  values: {
    fontSize: 14,
    color: Colors.subtext,
  },
  progressContainer: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  percentage: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});