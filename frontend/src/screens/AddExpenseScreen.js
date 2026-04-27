import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { ExpenseContext } from '../context/ExpenseContext';
import { categories, getCategoryColor } from '../constants/categories';
import { theme } from '../constants/theme';

const AddExpenseScreen = ({ navigation }) => {
  const { addExpense, loading } = useContext(ExpenseContext);
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
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

  const handleSave = async () => {
    if (!validate()) return;

    const expenseData = {
      amount: parseFloat(amount),
      category,
      date: date.toISOString(),
      note: note.trim()
    };

    const res = await addExpense(expenseData);
    if (res.success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Expense added successfully! 🎉'
      });
      navigation.goBack();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: res.error || 'Failed to add expense'
      });
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Amount Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.amountInput, errors.amount && styles.inputError]}
            placeholder="₹ 0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
        </View>

        {/* Category Picker (Horizontal Scroll) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryChip,
                  category === cat.name && { backgroundColor: getCategoryColor(cat.name) }
                ]}
                onPress={() => setCategory(cat.name)}
              >
                <Text style={[
                  styles.categoryChipText,
                  category === cat.name && { color: '#FFF' }
                ]}>
                  {cat.name}
                </Text>
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
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>

        {/* Note Input */}
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Note (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.note && styles.inputError]}
            placeholder="What was this for?"
            multiline
            numberOfLines={4}
            maxLength={200}
            value={note}
            onChangeText={setNote}
          />
          <Text style={styles.charCount}>{note.length}/200</Text>
          {errors.note && <Text style={styles.errorText}>{errors.note}</Text>}
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={[styles.saveButton, Boolean(loading) && { opacity: 0.7 }]} 
          onPress={handleSave}
          disabled={Boolean(loading)}
        >
          <Text style={styles.saveButtonText}>{Boolean(loading) ? 'Saving...' : 'Save Expense'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.xs,
  },
  input: {
    ...theme.components.input,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: 'bold',
    height: 60,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    ...theme.typography.caption,
    textAlign: 'right',
    marginTop: 4,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipText: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  saveButton: {
    ...theme.components.button,
    marginTop: 'auto',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default AddExpenseScreen;
