export const categories = [
  { name: 'Food', color: '#FF6B6B', icon: 'fast-food-outline' },
  { name: 'Travel', color: '#4ECDC4', icon: 'airplane-outline' },
  { name: 'Shopping', color: '#45B7D1', icon: 'cart-outline' },
  { name: 'Entertainment', color: '#96CEB4', icon: 'film-outline' },
  { name: 'Health', color: '#FFEAA7', icon: 'medkit-outline' },
  { name: 'Rent', color: '#DDA0DD', icon: 'home-outline' },
  { name: 'Utilities', color: '#98D8C8', icon: 'flash-outline' },
  { name: 'Education', color: '#F7DC6F', icon: 'book-outline' },
  { name: 'Other', color: '#AED6F1', icon: 'grid-outline' },
];

export const getCategoryColor = (categoryName) => {
  const category = categories.find(c => c.name === categoryName);
  return category ? category.color : '#AED6F1';
};
