export const theme = {
  colors: {
    primary: '#6C63FF', // purple/indigo
    accent: '#FF6584', // coral/pink for delete actions
    success: '#43D9AD',
    background: '#F4F6FB', // light grey
    cardBackground: '#FFFFFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444'
  },
  typography: {
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1A1A2E',
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
      color: '#1A1A2E',
    },
    body: {
      fontSize: 14,
      fontWeight: 'normal',
      color: '#1A1A2E',
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      color: '#6B7280',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  components: {
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    input: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: 12,
      height: 50,
      fontSize: 14,
      color: '#1A1A2E',
    },
    button: {
      backgroundColor: '#6C63FF',
      borderRadius: 12,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    }
  }
};
