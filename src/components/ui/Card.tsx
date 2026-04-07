import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';

interface CardProps extends ViewProps {
  padding?: number;
  variant?: 'elevated' | 'flat' | 'outline';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  padding = DESIGN_SYSTEM.SPACING.XL,
  variant = 'elevated',
  ...props 
}) => {
  return (
    <View 
      style={[
        styles.card, 
        { padding },
        variant === 'elevated' && DESIGN_SYSTEM.SHADOWS.SMALL,
        variant === 'outline' && styles.outline,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: DESIGN_SYSTEM.COLORS.SURFACE,
    borderRadius: DESIGN_SYSTEM.RADIUS.XL,
    overflow: 'hidden',
  },
  outline: {
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.COLORS.BORDER,
  }
});
