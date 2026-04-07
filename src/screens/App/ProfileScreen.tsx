import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';

const ProfileScreen = () => {
  const { user, profile, logout } = useAuth();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out?');
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: logout },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <Ionicons name="person-circle" size={80} color={DESIGN_SYSTEM.COLORS.PRIMARY} />
          <Text style={styles.name}>{profile?.name || 'User'}</Text>
          <Text style={styles.email}>{user?.phoneNumber || user?.email || 'Authenticated User'}</Text>
        </View>

        <Card style={styles.optionsCard}>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="person-outline" size={24} color={DESIGN_SYSTEM.COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={DESIGN_SYSTEM.COLORS.BORDER} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.option}>
            <Ionicons name="notifications-outline" size={24} color={DESIGN_SYSTEM.COLORS.TEXT_PRIMARY} />
            <Text style={styles.optionText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={DESIGN_SYSTEM.COLORS.BORDER} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={DESIGN_SYSTEM.COLORS.ERROR} />
            <Text style={[styles.optionText, { color: DESIGN_SYSTEM.COLORS.ERROR }]}>Logout</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
  },
  header: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.H1,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  name: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.H2,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    marginTop: 12,
  },
  email: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.BODY,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  optionsCard: {
    padding: 0,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    ...DESIGN_SYSTEM.TYPOGRAPHY.SUBTITLE,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BORDER,
    marginHorizontal: 16,
  }
});

export default ProfileScreen;
