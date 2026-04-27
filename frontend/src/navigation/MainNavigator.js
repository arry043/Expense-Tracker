import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import DashboardScreen from '../screens/DashboardScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import EditExpenseScreen from '../screens/EditExpenseScreen';
import { theme } from '../constants/theme';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        headerTitleStyle: {
          ...theme.typography.subheading,
        },
        headerTintColor: theme.colors.primary,
        cardStyle: { backgroundColor: theme.colors.background }
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={({ navigation }) => ({
          title: 'Overview',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="AddExpense" 
        component={AddExpenseScreen} 
        options={{ title: 'New Expense' }}
      />
      <Stack.Screen 
        name="EditExpense" 
        component={EditExpenseScreen} 
        options={{ title: 'Edit Expense' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  addButton: {
    marginRight: theme.spacing.lg,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

export default MainNavigator;
