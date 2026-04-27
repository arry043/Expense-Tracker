import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { ExpenseContext } from '../context/ExpenseContext';
import { categories, getCategoryColor } from '../constants/categories';
import { theme } from '../constants/theme';

const EditExpenseScreen = ({ route, navigation }) => {
  const { expense } = route.params;
  const { updateExpense, deleteExpense, loading } = useContext(ExpenseContext);
  
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(new Date(expense.date));
  const [note, setNote] = useState(expense.note || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!amount) newErrors.amount = "Amount is required";
    else if (isNaN(amount) || parseFloat(amount) <= 0) newErrors.amount = "Must be a valid positive amount";
    
    if (!category) newErrors.category = "Category is required";
    if (note.length > 200) newErrors.note = "Note must be less than 200 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    const expenseData = {
      amount: parseFloat(amount),
      category,
      date: date.toISOString(),
      note: note.trim()
    };

    const res = await updateExpense(expense._id, expenseData);
    if (res.success) {
      Toast.show({ type: 'success', text1: 'Success', text2: 'Expense updated successfully! 🎉' });
      navigation.goBack();
    } else {
      Toast.show({ type: 'error', text1: 'Error', text2: res.error || 'Failed to update expense' });
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            const res = await deleteExpense(expense._id);
            if (res.success) {
              Toast.show({ type: 'success', text1: 'Deleted', text2: 'Expense deleted successfully' });
              navigation.goBack();
            } else {
              Toast.show({ type: 'error', text1: 'Error', text2: res.error || 'Failed to delete' });
            }
          }
        }
      ]
    );
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Same fields as AddExpenseScreen for brevity - Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.amountInput, errors.amount && styles.inputError]}
            placeholder="₹ 0.00" keyboardType="numeric" value={amount} onChangeText={setAmount}
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.name} style={[styles.categoryChip, category === cat.name && { backgroundColor: getCategoryColor(cat.name) }]} onPress={() => setCategory(cat.name)}>
                <Text style={[styles.categoryChipText, category === cat.name && { color: '#FFF' }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
        </View>

        {/* Date Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          {Platform.OS === 'android' && (
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
          {(showDatePicker || Platform.OS === 'ios') && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} maximumDate={new Date()} />
          )}
        </View>

        {/* Note Input */}
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.note && styles.inputError]}
            multiline numberOfLines={4} maxLength={200} value={note} onChangeText={setNote}
          />
          <Text style={styles.charCount}>{note.length}/200</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.button, styles.deleteBtn, Boolean(loading) && { opacity: 0.7 }]} onPress={confirmDelete} disabled={Boolean(loading)}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.updateBtn, Boolean(loading) && { opacity: 0.7 }]} onPress={handleUpdate} disabled={Boolean(loading)}>
            <Text style={styles.updateBtnText}>{Boolean(loading) ? 'Saving...' : 'Update'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  /* Styles copy paste simplified from AddExpense for space; in production, use a shared form layout */
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContainer: { padding: theme.spacing.lg, flexGrow: 1 },
  inputGroup: { marginBottom: theme.spacing.lg },
  label: { ...theme.typography.subheading, marginBottom: theme.spacing.xs },
  input: { ...theme.components.input },
  amountInput: { fontSize: 24, fontWeight: 'bold', height: 60 },
  textArea: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: theme.colors.error },
  errorText: { color: theme.colors.error, fontSize: 12, marginTop: 4 },
  charCount: { ...theme.typography.caption, textAlign: 'right', marginTop: 4 },
  categoryScroll: { flexDirection: 'row' },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#FFF', marginRight: 8, borderWidth: 1, borderColor: theme.colors.border },
  categoryChipText: { ...theme.typography.body, fontWeight: '600' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto' },
  button: { ...theme.components.button, flex: 1 },
  deleteBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.error, marginRight: 8 },
  deleteBtnText: { color: theme.colors.error, fontSize: 18, fontWeight: 'bold' },
  updateBtn: { backgroundColor: theme.colors.primary, marginLeft: 8 },
  updateBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default EditExpenseScreen;
