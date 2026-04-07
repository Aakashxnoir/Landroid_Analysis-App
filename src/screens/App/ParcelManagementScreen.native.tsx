import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { LandService } from '../../services/api/landService';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import MapLibreGL from '@maplibre/maplibre-react-native';

const ParcelManagementScreen = () => {
  const [parcelName, setParcelName] = useState('');
  const [landownerId, setLandownerId] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [boundaryCoords, setBoundaryCoords] = useState<number[][]>([]);

  const handleCreateParcel = async () => {
    if (!parcelName || !landownerId || boundaryCoords.length < 3) {
      Alert.alert('Incomplete Data', 'Please provide a name, owner, and at least 3 boundary points.');
      return;
    }

    setIsLoading(true);
    try {
      await LandService.createParcel({
        name: parcelName,
        ownerId: landownerId,
        size: parseFloat(areaSize),
        boundary: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [boundaryCoords],
          },
        },
      });
      Alert.alert('Success', 'Parcel created and assigned to landowner.');
    } catch (e) {
      console.error('Create parcel failed:', e);
      Alert.alert('Error', 'Failed to create parcel. Check backend connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  const onMapPress = (feature: any) => {
    const coords = feature.geometry.coordinates;
    setBoundaryCoords([...boundaryCoords, coords]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parcel Management</Text>
        <Text style={styles.subtitle}>Create boundaries and assign landowners</Text>
      </View>

      <Card style={styles.formCard}>
        <Text style={styles.sectionTitle}>1. Basic Details</Text>
        <Input
          label="Parcel Name"
          placeholder="e.g. Green Valley Farm"
          value={parcelName}
          onChangeText={setParcelName}
          icon="business-outline"
        />
        <Input
          label="Landowner ID / Email"
          placeholder="e.g. user@example.com"
          value={landownerId}
          onChangeText={setLandownerId}
          icon="person-outline"
        />
        <Input
          label="Area Size (Acres)"
          placeholder="e.g. 12.4"
          value={areaSize}
          onChangeText={setAreaSize}
          keyboardType="numeric"
          icon="expand-outline"
        />
      </Card>

      <Card style={styles.mapCard}>
        <Text style={styles.sectionTitle}>2. Draw Boundary</Text>
        <Text style={styles.inputHint}>Tap on map to place boundary vertices</Text>
        <View style={styles.mapWrapper}>
          <MapLibreGL.MapView 
            style={styles.map} 
            onPress={onMapPress}
            // @ts-ignore
            styleURL="https://api.maptiler.com/maps/hybrid/style.json?key=AIzaSyDsgusFlDHtp3ejLdjpBhlUsOQb2tTfuC0"
          >
            <MapLibreGL.Camera centerCoordinate={[77.3042, 10.4295]} zoomLevel={16} />
            {boundaryCoords.length > 0 && (
              <MapLibreGL.ShapeSource
                id="draw-source"
                shape={{
                  type: 'Feature',
                  geometry: {
                    type: 'Polygon',
                    coordinates: [boundaryCoords.length > 2 ? [...boundaryCoords, boundaryCoords[0]] : boundaryCoords],
                  },
                } as any}
              >
                <MapLibreGL.FillLayer id="draw-fill" style={{ fillColor: DESIGN_SYSTEM.COLORS.PRIMARY, fillOpacity: 0.4 }} />
                <MapLibreGL.LineLayer id="draw-line" style={{ lineColor: 'white', lineWidth: 2 }} />
                <MapLibreGL.CircleLayer id="draw-points" style={{ circleColor: 'white', circleRadius: 5 }} />
              </MapLibreGL.ShapeSource>
            )}
          </MapLibreGL.MapView>
          <TouchableOpacity style={styles.resetButton} onPress={() => setBoundaryCoords([])}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </Card>

      <Button
        title="Confirm & Upload Parcel"
        onPress={handleCreateParcel}
        isLoading={isLoading}
        style={styles.submitButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  subtitle: {
    fontSize: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  formCard: {
    margin: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  mapCard: {
    margin: 16,
    padding: 20,
    height: 480,
  },
  inputHint: {
    fontSize: 11,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginBottom: 10,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  map: {
    flex: 1,
  },
  resetButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  submitButton: {
    margin: 16,
    marginBottom: 40,
    height: 56,
  },
});

export default ParcelManagementScreen;
