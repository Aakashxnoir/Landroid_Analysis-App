import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen = () => {
  const { completeOnboarding } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Land Consultant' | 'Landowner' | null>(null);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    if (!name || !role || !location) {
      Alert.alert('Missing Info', 'Please fill in all fields to continue.');
      return;
    }

    setIsLoading(true);
    try {
      await completeOnboarding(name, role, location);
      // navigation is handled by AuthContext state change (onboardingRequired -> false)
    } catch (e: any) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderOnboardingContent = () => (
    <ScrollView 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Aboard</Text>
        <Text style={styles.subtitle}>Complete your profile to get started with Landroid</Text>
      </View>

      <Card style={styles.formCard}>
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          value={name}
          onChangeText={setName}
          icon="person-outline"
        />

        <Text style={styles.roleLabel}>Select Your Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[
              styles.roleCard, 
              role === 'Land Consultant' && styles.roleCardActive
            ]}
            onPress={() => setRole('Land Consultant')}
          >
            <View style={[styles.iconCircle, role === 'Land Consultant' && styles.iconCircleActive]}>
              <Ionicons 
                name="briefcase" 
                size={24} 
                color={role === 'Land Consultant' ? DESIGN_SYSTEM.COLORS.PRIMARY : DESIGN_SYSTEM.COLORS.TEXT_SECONDARY} 
              />
            </View>
            <Text style={[
              styles.roleCardText, 
              role === 'Land Consultant' && styles.roleCardTextActive
            ]}>Land Consultant</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.roleCard, 
              role === 'Landowner' && styles.roleCardActive
            ]}
            onPress={() => setRole('Landowner')}
          >
            <View style={[styles.iconCircle, role === 'Landowner' && styles.iconCircleActive]}>
              <Ionicons 
                name="home" 
                size={24} 
                color={role === 'Landowner' ? DESIGN_SYSTEM.COLORS.ACCENT : DESIGN_SYSTEM.COLORS.TEXT_SECONDARY} 
              />
            </View>
            <Text style={[
              styles.roleCardText, 
              role === 'Landowner' && styles.roleCardTextActive
            ]}>Landowner</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Location"
          placeholder="City, Country"
          value={location}
          onChangeText={setLocation}
          icon="location-outline"
        />

        <Button 
          title="Finish Setup" 
          onPress={handleComplete} 
          isLoading={isLoading}
          disabled={!name || !role || !location}
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        renderOnboardingContent()
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {renderOnboardingContent()}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.H1,
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
    marginBottom: 12,
  },
  subtitle: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.SUBTITLE,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  formCard: {
    ...DESIGN_SYSTEM.SHADOWS.MEDIUM,
  },
  roleLabel: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.LABEL,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginBottom: 16,
    marginLeft: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: DESIGN_SYSTEM.SPACING.XL,
  },
  roleCard: {
    flex: 0.48,
    backgroundColor: 'white',
    borderRadius: DESIGN_SYSTEM.RADIUS.XL,
    borderWidth: 2,
    borderColor: DESIGN_SYSTEM.COLORS.BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    height: 140,
  },
  roleCardActive: {
    borderColor: DESIGN_SYSTEM.COLORS.PRIMARY,
    backgroundColor: '#EEF2FF',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircleActive: {
    backgroundColor: 'white',
  },
  roleCardText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  roleCardTextActive: {
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default OnboardingScreen;
