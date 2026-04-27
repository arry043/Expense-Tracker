import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCategoryColor } from '../constants/categories';

const CategoryBadge = ({ category }) => {
  const color = getCategoryColor(category);

  return (
    <View style={[styles.badge, { backgroundColor: `${color}33` }]}> 
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color: color }]}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  }
});

export default CategoryBadge;
