import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { THEME } from './theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  isLoading, 
  disabled, 
  variant = 'primary' 
}) => {
  const getBackgroundColor = () => {
    if (disabled) return THEME.COLORS.DISABLED_BG;
    switch (variant) {
      case 'accent': return THEME.COLORS.ACCENT;
      case 'secondary': return THEME.COLORS.TEXT_LIGHT;
      default: return THEME.COLORS.PRIMARY;
    }
  };

  const getTextColor = () => {
    if (disabled) return THEME.COLORS.DISABLED_TEXT;
    return variant === 'secondary' ? THEME.COLORS.PRIMARY : THEME.COLORS.TEXT_LIGHT;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && styles.buttonSecondary
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'secondary' ? THEME.COLORS.PRIMARY : THEME.COLORS.TEXT_LIGHT} />
      ) : (
        <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: THEME.RADIUS.M,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    shadowColor: THEME.COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonSecondary: {
    borderWidth: 1.5,
    borderColor: THEME.COLORS.PRIMARY,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
