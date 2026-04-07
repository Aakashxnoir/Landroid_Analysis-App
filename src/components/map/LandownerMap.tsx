import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Parcel } from '../../services/parcelService';
import { Ionicons } from '@expo/vector-icons';

interface LandownerMapProps {
  parcel: Parcel | null;
}

const LandownerMap: React.FC<LandownerMapProps> = ({ parcel }) => {
  const [MapboxGL, setMapboxGL] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        const gl = require('@maplibre/maplibre-react-native').default;
        // Optionally set access token if MapLibre requires it depending on setup.
        // MapboxGL.setAccessToken(null); 
        setMapboxGL(gl);
      } catch (err) {
        console.warn('MapLibre not supported on this device/emulator without native link');
      }
    }
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webFallbackContainer}>
        <Ionicons name="map-outline" size={48} color={DESIGN_SYSTEM.COLORS.BORDER} />
        <Text style={styles.webFallbackText}>Interactive Map is designed for Mobile App viewing.</Text>
        {parcel && (
          <View style={styles.parcelInfo}>
            <Text style={styles.parcelName}>{parcel.landowner_name}'s Land</Text>
            <Text style={styles.parcelCoords}>
              Coordinates: {parcel.centroid?.[1]?.toFixed(4)}, {parcel.centroid?.[0]?.toFixed(4)}
            </Text>
          </View>
        )}
      </View>
    );
  }

  if (!MapboxGL) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={DESIGN_SYSTEM.COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Initializing Map Engine...</Text>
      </View>
    );
  }

  if (!parcel || !parcel.geojson) {
    return (
      <View style={styles.webFallbackContainer}>
        <Ionicons name="map-outline" size={48} color={DESIGN_SYSTEM.COLORS.BORDER} />
        <Text style={styles.webFallbackText}>No land parcel assigned yet.</Text>
      </View>
    );
  }

  // Auto-Zoom Bounds matching requirement
  const bbox = parcel.bbox; // [minX, minY, maxX, maxY]
  // Turf bounding box: [minX, minY, maxX, maxY]
  // minX = sw LNG, minY = sw LAT
  // maxX = ne LNG, maxY = ne LAT
  const bounds = {
    ne: [bbox[2], bbox[3]],
    sw: [bbox[0], bbox[1]],
    paddingTop: 50,
    paddingRight: 50,
    paddingBottom: 50,
    paddingLeft: 50
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView 
        style={styles.map} 
        styleURL={MapboxGL.StyleURL.Satellite}
        logoEnabled={false}
      >
        <MapboxGL.Camera
          bounds={bounds}
          animationDuration={1500}
        />
        <MapboxGL.ShapeSource id="parcelBoundary" shape={parcel.geojson}>
          <MapboxGL.FillLayer 
            id="parcelFill" 
            style={{ 
              fillColor: 'rgba(16, 185, 129, 0.3)', // Emerald Accent Transparent
              fillOutlineColor: '#10B981' // Solid Emerald
            }} 
          />
          <MapboxGL.LineLayer
            id="parcelLine"
            style={{
              lineColor: '#10B981',
              lineWidth: 2
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    overflow: 'hidden',
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
    marginBottom: 24,
  },
  map: {
    flex: 1,
  },
  webFallbackContainer: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  webFallbackText: {
    marginTop: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  parcelInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  parcelName: {
    fontWeight: '700',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  parcelCoords: {
    fontSize: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  loadingContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
  },
  loadingText: {
    marginTop: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  }
});

export default LandownerMap;
