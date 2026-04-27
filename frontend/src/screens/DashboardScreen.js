import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { AuthContext } from '../context/AuthContext';
import { ExpenseContext } from '../context/ExpenseContext';
import SummaryCard from '../components/SummaryCard';
import PieChartWidget from '../components/PieChartWidget';
import ExpenseCard from '../components/ExpenseCard';
import { theme } from '../constants/theme';

const DashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { 
    expenses, 
    summary, 
    grandTotal, 
    loading, 
    fetchExpenses, 
    fetchSummary 
  } = useContext(ExpenseContext);

  const [refreshing, setRefreshing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(state.isConnected === false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch data on screen focus
  useFocusEffect(
    React.useCallback(() => {
      fetchExpenses();
      fetchSummary();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    await fetchSummary();
    setRefreshing(false);
  };

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout }
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.greetingRow}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}! 👋</Text>
        <TouchableOpacity onPress={confirmLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline — showing cached data</Text>
        </View>
      )}
      
      <SummaryCard totalAmount={grandTotal} isLoading={Boolean(loading) && !refreshing} />
      
      {!Boolean(loading) && expenses.length > 0 && (
        <PieChartWidget summaryData={summary} />
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Expenses</Text>
        <TouchableOpacity onPress={() => {/* Navigate to full list if implemented */}}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (Boolean(loading) && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expenses yet. Tap + to add one!</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses.slice(0, 5)} // Show only recent 5
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ExpenseCard 
            expense={item} 
            onPress={(expense) => navigation.navigate('EditExpense', { expense })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={Boolean(refreshing)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    padding: theme.spacing.lg,
  },
  headerContainer: {
    marginBottom: theme.spacing.sm,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  greeting: {
    ...theme.typography.heading,
  },
  logoutButton: {
    padding: theme.spacing.xs,
  },
  logoutText: {
    ...theme.typography.body,
    color: theme.colors.error,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.subheading,
  },
  seeAllText: {
    ...theme.typography.body,
    color: theme.colors.primary,
  },
  centerContainer: {
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.components.card,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  offlineBanner: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderColor: '#FFEEBA',
    borderWidth: 1,
  },
  offlineText: {
    color: '#856404',
    fontWeight: '600',
    fontSize: 12,
  }
});

export default DashboardScreen;
