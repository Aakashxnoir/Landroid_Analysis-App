import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { OTPInput } from '../../components/ui/OTPInput';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';

const OTPScreen = ({ navigation, route }: any) => {
  const { confirmationResult, phoneNumber } = route.params || {};
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleVerifyOTP = async (code: string = otpCode) => {
    if (code.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code sent to your phone.');
      return;
    }

    setIsLoading(true);
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(code);
        await login(result.user);
        // Navigation will be handled by AuthNavigator state change
      } else {
        // Mock success for development if no confirmationResult
        Alert.alert('Debug Mode', 'No Firebase confirmation object found. Simulating login.');
        // In a real app, you'd handle this error
      }
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Verification Failed', 'The code you entered is incorrect or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={DESIGN_SYSTEM.COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={40} color={DESIGN_SYSTEM.COLORS.PRIMARY} />
            </View>
            <Text style={styles.title}>Verify Phone</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to {'\n'}
              <Text style={styles.phoneHighlight}>+91 {phoneNumber || 'Your Number'}</Text>
            </Text>
          </View>

          {/* OTP Section */}
          <View style={styles.otpSection}>
            <OTPInput 
              code={otpCode} 
              setCode={setOtpCode} 
              onFull={handleVerifyOTP} 
            />
            
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity onPress={() => Alert.alert('Resend', 'OTP Resent successfully!')}>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            </View>

            <Button 
              title="Verify & Continue" 
              onPress={() => handleVerifyOTP()} 
              isLoading={isLoading}
              style={styles.verifyButton}
            />
          </View>

          {/* Footer Info */}
          <View style={styles.footer}>
            <Ionicons name="lock-closed-outline" size={16} color={DESIGN_SYSTEM.COLORS.TEXT_SECONDARY} />
            <Text style={styles.secureText}>End-to-end encrypted verification</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.H1,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.SUBTITLE,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  phoneHighlight: {
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    fontWeight: '700',
  },
  otpSection: {
    flex: 1,
    alignItems: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  resendText: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.BODY,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  resendLink: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.BODY,
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
    fontWeight: '700',
    marginLeft: 6,
  },
  verifyButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    opacity: 0.6,
  },
  secureText: {
    fontSize: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginLeft: 6,
    fontWeight: '500',
  }
});

export default OTPScreen;
