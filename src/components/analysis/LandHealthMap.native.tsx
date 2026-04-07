import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import MapView, { UrlTile, Geojson, PROVIDER_DEFAULT } from 'react-native-maps';
import { DESIGN_SYSTEM } from '../../styles/designSystem';

// Import the ML results (GeoJSON renamed to .json for Metro compatibility)
const healthZoneData = require('../../ml_model/Health_Zone_Map.json');
const boundaryData = require('../../ml_model/Boundary.json');

interface LandHealthMapProps {
  apiKey: string;
}

const LandHealthMap: React.FC<LandHealthMapProps> = ({ apiKey }) => {
  // Centroid from our analysis: 10.4295, 77.3042
  const initialRegion = {
    latitude: 10.4295,
    longitude: 77.3042,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  // MapTiler Satellite Hybrid Tile URL
  const tileUrl = `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${apiKey}`;

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={initialRegion}
        mapType={Platform.OS === 'android' ? 'none' : 'standard'} 
      >
        <UrlTile
          urlTemplate={tileUrl}
          zIndex={1}
          maximumZ={19}
          flipY={false}
        />
        
        <Geojson
          geojson={boundaryData}
          strokeColor="rgba(255, 255, 255, 0.5)"
          fillColor="transparent"
          strokeWidth={1}
        />
        
        {/* Render individual zones manually for better control */}
        {healthZoneData.features.map((feature: any, index: number) => (
           <Geojson
             key={index}
             geojson={{
               type: 'FeatureCollection',
               features: [feature]
             }}
             fillColor={feature.properties.color + '80'} 
             strokeColor={feature.properties.color}
             strokeWidth={0.5}
           />
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Health Zones</Text>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#006400' }]} />
          <Text style={styles.legendText}>Healthy</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#FFFF00' }]} />
          <Text style={styles.legendText}>Sparse</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#FF0000' }]} />
          <Text style={styles.legendText}>Bare Soil</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: '#808080' }]} />
          <Text style={styles.legendText}>Non-Plant</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    overflow: 'hidden',
    backgroundColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  legend: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: DESIGN_SYSTEM.RADIUS.S,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  legendTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  colorBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
});

export default LandHealthMap;
