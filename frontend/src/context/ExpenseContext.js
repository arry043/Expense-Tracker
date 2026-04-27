import React, { createContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const ExpenseContext = createContext();

const isSuccess = (value) => value === true || value === 'true';

const normalizeExpense = (expense) => ({
  ...expense,
  amount: Number(expense.amount) || 0,
});

const normalizeExpenses = (items) => (Array.isArray(items) ? items.map(normalizeExpense) : []);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all expenses map to offline cache
  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/expenses');
      if (isSuccess(response.data.success)) {
        const nextExpenses = normalizeExpenses(response.data.data.expenses);
        setExpenses(nextExpenses);
        // Cache data for offline viewing
        await AsyncStorage.setItem('cached_expenses', JSON.stringify(nextExpenses));
      }
    } catch (err) {
      console.log('Error fetching expenses, trying cache...', err.message);
      // Try to load cached items if network fails
      const cached = await AsyncStorage.getItem('cached_expenses');
      if (cached) {
        setExpenses(normalizeExpenses(JSON.parse(cached)));
      } else {
        setError('Failed to fetch expenses');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await api.get('/expenses/summary');
      if (isSuccess(response.data.success)) {
        setSummary(Array.isArray(response.data.data.summary) ? response.data.data.summary : []);
        setGrandTotal(Number(response.data.data.grandTotal) || 0);
      }
    } catch (err) {
      console.log('Error fetching summary', err.message);
    }
  }, []);

  const addExpense = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/expenses', data);
      if (isSuccess(response.data.success)) {
        // Optimistically prepend to state
        setExpenses([normalizeExpense(response.data.data.expense), ...expenses]);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id, data) => {
    setLoading(true);
    try {
      const response = await api.put(`/expenses/${id}`, data);
      if (isSuccess(response.data.success)) {
        // Update local state selectively
        const updatedList = expenses.map(e => e._id === id ? normalizeExpense(response.data.data.expense) : e);
        setExpenses(updatedList);
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update expense');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/expenses/${id}`);
      if (isSuccess(response.data.success)) {
        // Remote from local state
        setExpenses(expenses.filter(e => e._id !== id));
        return { success: true };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      summary,
      grandTotal,
      loading,
      error,
      fetchExpenses,
      fetchSummary,
      addExpense,
      updateExpense,
      deleteExpense
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
