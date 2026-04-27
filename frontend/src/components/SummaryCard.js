import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

const SummaryCard = ({ totalAmount, isLoading }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Expenses</Text>
      {isLoading ? (
        <Text style={styles.amount}>₹ ...</Text>
      ) : (
        <Text style={styles.amount}>
          ₹{totalAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginVertical: theme.spacing.md,
  },
  title: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  }
});

export default SummaryCard;
