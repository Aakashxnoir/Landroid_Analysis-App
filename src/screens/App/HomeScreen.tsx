import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import AddParcelModal from '../../components/modals/AddParcelModal';
import ParcelService, { Parcel } from '../../services/parcelService';
import LandownerMap from '../../components/map/LandownerMap';

const HomeScreen = () => {
  const { user, profile, logout } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [parcels, setParcels] = useState<Parcel[]>([]);

  const fetchParcels = async () => {
    // Implement Filtered Fetch securely via Role & phone number
    if (profile?.role === 'Landowner') {
      if (user?.phoneNumber) {
        const result = await ParcelService.getParcelsByPhone(user.phoneNumber);
        if (result.data) setParcels(result.data);
      } else {
        // Fallback or empty if landowner hasn't bound a proper phone
        setParcels([]);
      }
    } else {
      // Consultant fetches all (or team-based later)
      const result = await ParcelService.getParcels();
      if (result.data) setParcels(result.data);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

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
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>👋 Good Morning,</Text>
            <Text style={styles.name}>{profile?.name || 'User'}</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={14} color={DESIGN_SYSTEM.COLORS.ACCENT} />
            <Text style={styles.badgeText}>{profile?.role?.toUpperCase() || 'GUEST'}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <Card style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="location" size={24} color={DESIGN_SYSTEM.COLORS.PRIMARY} />
            </View>
            <Text style={styles.cardLabel}>Location</Text>
            <Text style={styles.cardValue}>{profile?.location || 'Not set'}</Text>
          </Card>

          <Card style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="stats-chart" size={24} color={DESIGN_SYSTEM.COLORS.ACCENT} />
            </View>
            <Text style={styles.cardLabel}>Activity</Text>
            <Text style={styles.cardValue}>Active</Text>
          </Card>
        </View>

        {profile?.role === 'Landowner' ? (
          <LandownerMap parcel={parcels.length > 0 ? parcels[0] : null} />
        ) : (
          <Card style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.mainCardTitle}>Your Listings</Text>
              <TouchableOpacity onPress={fetchParcels}>
                <Text style={styles.seeAllText}>Refresh</Text>
              </TouchableOpacity>
            </View>
            {parcels.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="map-outline" size={48} color={DESIGN_SYSTEM.COLORS.BORDER} />
                <Text style={styles.emptyStateText}>No land listings yet</Text>
              </View>
            ) : (
              <View style={{ paddingBottom: 8 }}>
                {parcels.map((item, index) => (
                  <View key={item.id || index} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, marginBottom: 8 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                      <Ionicons name="map" size={20} color={DESIGN_SYSTEM.COLORS.ACCENT} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY }}>{item.landowner_name || 'Unknown'}</Text>
                      <Text style={{ fontSize: 12, color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY, marginTop: 2 }}>{item.centroid?.[1]?.toFixed(4) || 'N/A'}, {item.centroid?.[0]?.toFixed(4) || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Card>
        )}

        {profile?.role !== 'Landowner' && (
          <View style={styles.actionRow}>
            <Button 
              title="➕ Add Land" 
              onPress={() => setModalVisible(true)} 
              style={styles.actionButton}
            />
            <Button 
              title="🔍 Browse" 
              variant="secondary"
              onPress={() => {}} 
              style={styles.actionButton}
            />
          </View>
        )}

        <TouchableOpacity 
          style={styles.logoutLink}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={DESIGN_SYSTEM.COLORS.ERROR} />
          <Text style={styles.logoutText}>Logout Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <AddParcelModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {
          fetchParcels();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.SUBTITLE,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  name: {
    ...DESIGN_SYSTEM.TYPOGRAPHY.H1,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  profileAvatar: {
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: DESIGN_SYSTEM.COLORS.ACCENT,
    borderWidth: 2,
    borderColor: 'white',
  },
  badgeRow: {
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: DESIGN_SYSTEM.RADIUS.ROUND,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  badgeText: {
    color: DESIGN_SYSTEM.COLORS.ACCENT,
    fontWeight: '700' as const,
    fontSize: 10,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridCard: {
    width: '48%',
    padding: 16,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    fontWeight: '500' as const,
  },
  cardValue: {
    fontSize: 16,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    fontWeight: '700' as const,
  },
  mainCard: {
    padding: 20,
    marginBottom: 24,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainCardTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  seeAllText: {
    fontSize: 14,
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    marginTop: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    width: '48%',
    height: 52,
  },
  logoutLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: DESIGN_SYSTEM.COLORS.ERROR,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});

export default HomeScreen;
