import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Animated, 
  Platform,
  View 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DESIGN_SYSTEM } from '../../styles/designSystem';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  isLoading, 
  disabled, 
  style 
}) => {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderContent = () => (
    <>
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : DESIGN_SYSTEM.COLORS.PRIMARY} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'primary' && styles.textPrimary,
          variant === 'secondary' && styles.textSecondary,
          variant === 'outline' && styles.textOutline,
          variant === 'ghost' && styles.textGhost,
          disabled && styles.textDisabled
        ]}>
          {title}
        </Text>
      )}
    </>
  );

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || isLoading}
        activeOpacity={1}
      >
        {variant === 'primary' && !disabled ? (
          <LinearGradient
            colors={[DESIGN_SYSTEM.COLORS.PRIMARY, DESIGN_SYSTEM.COLORS.SECONDARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.button, styles.primary]}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          <View style={[
            styles.button,
            variant === 'primary' && disabled && styles.disabled,
            variant === 'secondary' && styles.secondary,
            variant === 'outline' && styles.outline,
            variant === 'ghost' && styles.ghost,
          ]}>
            {renderContent()}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  secondary: {
    backgroundColor: '#EEF2FF', // Very light indigo
  },
  outline: {
    borderWidth: 1.5,
    borderColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textPrimary: {
    color: DESIGN_SYSTEM.COLORS.WHITE,
  },
  textSecondary: {
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  textOutline: {
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  textGhost: {
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  textDisabled: {
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  }
});
