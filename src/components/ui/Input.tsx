import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TextInputProps, 
  StyleSheet, 
  Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DESIGN_SYSTEM } from '../../styles/designSystem';

interface InputProps extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  icon, 
  error, 
  style, 
  onFocus, 
  onBlur, 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = new Animated.Value(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onBlur?.(e);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [DESIGN_SYSTEM.COLORS.BORDER, DESIGN_SYSTEM.COLORS.PRIMARY],
  });

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View style={[
        styles.inputWrapper, 
        { borderColor },
        isFocused && styles.focusedShadow,
        error && styles.errorBorder,
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={isFocused ? DESIGN_SYSTEM.COLORS.PRIMARY : DESIGN_SYSTEM.COLORS.TEXT_SECONDARY} 
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={DESIGN_SYSTEM.COLORS.TEXT_SECONDARY}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: DESIGN_SYSTEM.SPACING.M,
  },
  label: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.LABEL,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: DESIGN_SYSTEM.COLORS.SURFACE,
    borderRadius: DESIGN_SYSTEM.RADIUS.M,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  focusedShadow: {
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
    shadowColor: DESIGN_SYSTEM.COLORS.PRIMARY,
    shadowOpacity: 0.1,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  icon: {
    marginRight: 12,
  },
  errorBorder: {
    borderColor: DESIGN_SYSTEM.COLORS.ERROR,
  },
  errorText: {
    color: DESIGN_SYSTEM.COLORS.ERROR,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  }
});
