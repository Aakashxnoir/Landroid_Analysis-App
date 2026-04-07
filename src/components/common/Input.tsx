import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TextInputProps, 
  StyleSheet 
} from 'react-native';
import { THEME } from './theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={THEME.COLORS.DISABLED_TEXT}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: THEME.SPACING.M,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.COLORS.TEXT_DARK,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: THEME.COLORS.TEXT_LIGHT,
    borderRadius: THEME.RADIUS.M,
    paddingHorizontal: 16,
    fontSize: 16,
    color: THEME.COLORS.TEXT_DARK,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
  },
  inputError: {
    borderColor: THEME.COLORS.ERROR,
  },
  errorText: {
    color: THEME.COLORS.ERROR,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
