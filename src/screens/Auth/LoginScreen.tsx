import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform, 
  KeyboardAvoidingView, 
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebaseConfig';
import { 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier 
} from 'firebase/auth';

const LoginScreen = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handlePhoneLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return;
    }

    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Web Recaptcha setup
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible'
        });
        
        const confirmationResult = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, recaptchaVerifier);
        navigation.navigate('OTP', { confirmationResult, phoneNumber });
      } else {
        // Native logic would go here (usually requires Firebase Phone Auth setup)
        // For now, we simulate or use the same if configured
        Alert.alert('Phone Login', 'Native phone login requires configuration.');
      }
    } catch (error: any) {
      console.error('Phone Login Error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await login(result.user);
    } catch (error: any) {
      console.error('Google Login Error:', error);
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={48} color={DESIGN_SYSTEM.COLORS.PRIMARY} />
            </View>
            <Text style={styles.title}>Landroid</Text>
            <Text style={styles.subtitle}>Secure Land Intelligence & Analytics</Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <Input 
              label="Phone Number"
              placeholder="Enter 10-digit number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              icon="call-outline"
              maxLength={10}
            />

            <Button 
              title="Send OTP" 
              onPress={handlePhoneLogin} 
              isLoading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.line} />
            </View>

            <Button 
              title="Google Account" 
              onPress={handleGoogleLogin} 
              variant="outline"
              style={styles.googleButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>By continuing, you agree to our</Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms of Service & Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          {/* Recaptcha container for Web */}
          {Platform.OS === 'web' && <div id="recaptcha-container"></div>}
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
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
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
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  dividerText: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.LABEL,
    paddingHorizontal: 16,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  googleButton: {
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.BODY,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  linkText: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.BODY,
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
    fontWeight: '600',
    marginTop: 4,
  }
});

export default LoginScreen;
