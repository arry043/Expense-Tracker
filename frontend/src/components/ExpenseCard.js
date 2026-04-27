import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CategoryBadge from './CategoryBadge';
import { theme } from '../constants/theme';

const formatCurrency = (amount) => {
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const ExpenseCard = ({ expense, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress && onPress(expense)}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <CategoryBadge category={expense.category} />
        <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
      </View>
      
      {expense.note && (
        <Text style={styles.note} numberOfLines={2}>
          {expense.note}
        </Text>
      )}

      <Text style={styles.date}>{formatDate(expense.date)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...theme.components.card,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  note: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  date: {
    ...theme.typography.caption,
    textAlign: 'right',
  }
});

export default ExpenseCard;
