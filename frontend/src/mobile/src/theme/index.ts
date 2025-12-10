import { createTheme } from '@rneui/themed';

export const theme = createTheme({
  lightColors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#f9fafb',
    white: '#ffffff',
    black: '#000000',
    grey0: '#f9fafb',
    grey1: '#f1f5f9',
    grey2: '#e2e8f0',
    grey3: '#cbd5e1',
    grey4: '#94a3b8',
    grey5: '#64748b',
    greyOutline: '#e2e8f0',
    searchBg: '#f1f5f9',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
  },
  mode: 'light',
  components: {
    Button: {
      raised: true,
      titleStyle: {
        fontWeight: '600',
      },
      buttonStyle: {
        paddingVertical: 12,
        borderRadius: 8,
      },
    },
    Input: {
      containerStyle: {
        paddingHorizontal: 0,
      },
      inputContainerStyle: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 8,
        paddingHorizontal: 12,
      },
      inputStyle: {
        fontSize: 16,
      },
    },
    Card: {
      containerStyle: {
        borderRadius: 12,
        borderWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        margin: 8,
      },
    },
    Badge: {
      badgeStyle: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
      },
      textStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
    },
  },
});

export const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  border: '#e2e8f0',
};

// Currency utility function
export const getCurrencySymbol = (currency: string): string => {
  const symbols: { [key: string]: string } = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'CNY': '¥',
  };
  return symbols[currency] || currency;
};

export const formatCurrency = (amount: number, currency: string): string => {
  return `${getCurrencySymbol(currency)}${amount.toLocaleString()}`;
};
