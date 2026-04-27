import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../constants/theme';
import { getCategoryColor } from '../constants/categories';

const PieChartWidget = ({ summaryData }) => {
  if (!summaryData || summaryData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Add expenses to see your spending breakdown</Text>
      </View>
    );
  }

  const chartData = summaryData.map((item) => ({
    name: item.category,
    population: Number(item.total) || 0,
    color: getCategoryColor(item.category),
    legendFontColor: theme.colors.textSecondary,
    legendFontSize: 12
  }));

  const screenWidth = Dimensions.get('window').width - 32;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending by Category</Text>
      <PieChart
        data={chartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft={15}
        center={[10, 0]}
        absolute={true}
        hasLegend={true}
        avoidFalseZero={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...theme.components.card,
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    ...theme.components.card,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  }
});

export default PieChartWidget;
