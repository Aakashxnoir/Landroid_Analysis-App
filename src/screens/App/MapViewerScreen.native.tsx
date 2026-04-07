import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import { LandService } from '../../services/api/landService';
import { useParcelStore } from '../../store/parcelStore';
import { LoadingOverlay } from '../../components/common/LoadingOverlay';

// MapLibre configuration
MapLibreGL.setAccessToken(null); // Not required for MapTiler style URLs if included in URL

const MapViewerScreen = ({ navigation }: any) => {
  const { parcels, setParcels, setSelectedParcelId } = useParcelStore();
  const [activeLayer, setActiveLayer] = useState<'Satellite' | 'NDVI' | 'Elevation'>('Satellite');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const data = await LandService.getParcels();
      setParcels(data);
    } catch (e) {
      // For demo, if API fails, we could use a fallback or show error
      console.error('Fetch parcels failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const onParcelPress = (id: string) => {
    setSelectedParcelId(id);
    navigation.navigate('Analysis');
  };

  return (
    <View style={styles.container}>
      <MapLibreGL.MapView 
        style={styles.map} 
        // @ts-ignore
        styleURL="https://api.maptiler.com/maps/hybrid/style.json?key=AIzaSyDsgusFlDHtp3ejLdjpBhlUsOQb2tTfuC0"
      >
        <MapLibreGL.Camera
          zoomLevel={15}
          centerCoordinate={[77.3042, 10.4295]} // Default center
        />

        {/* Feature: GeoJSON Boundary Overlay */}
        {parcels.map((parcel) => (
          <MapLibreGL.ShapeSource
            key={parcel.id}
            id={`source-${parcel.id}`}
            shape={parcel.boundary as any}
            onPress={() => onParcelPress(parcel.id)}
          >
            <MapLibreGL.FillLayer
              id={`fill-${parcel.id}`}
              style={{
                fillColor: parcel.status === 'Healthy' ? '#4CAF50' : '#FFC107',
                fillOpacity: 0.3,
              }}
            />
            <MapLibreGL.LineLayer
              id={`line-${parcel.id}`}
              style={{
                lineColor: '#FFFFFF',
                lineWidth: 2,
              }}
            />
          </MapLibreGL.ShapeSource>
        ))}

        {/* Feature: NDVI Raster Layer (Simplified placeholder) */}
        {activeLayer === 'NDVI' && (
          <MapLibreGL.RasterSource
            id="ndvi-raster"
            tileUrlTemplates={['https://api.yourbackend.com/tiles/ndvi/{z}/{x}/{y}.png']}
          >
            <MapLibreGL.RasterLayer id="ndvi-layer" />
          </MapLibreGL.RasterSource>
        )}
      </MapLibreGL.MapView>

      {/* Layer Toggle UI */}
      <View style={styles.layerControl}>
        <TouchableOpacity 
          style={[styles.layerButton, activeLayer === 'Satellite' && styles.layerButtonActive]}
          onPress={() => setActiveLayer('Satellite')}
        >
          <Ionicons name="earth" size={20} color={activeLayer === 'Satellite' ? 'white' : '#666'} />
          <Text style={[styles.layerText, activeLayer === 'Satellite' && styles.layerTextActive]}>Satellite</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.layerButton, activeLayer === 'NDVI' && styles.layerButtonActive]}
          onPress={() => setActiveLayer('NDVI')}
        >
          <Ionicons name="leaf" size={20} color={activeLayer === 'NDVI' ? 'white' : '#666'} />
          <Text style={[styles.layerText, activeLayer === 'NDVI' && styles.layerTextActive]}>NDVI</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.layerButton, activeLayer === 'Elevation' && styles.layerButtonActive]}
          onPress={() => setActiveLayer('Elevation')}
        >
          <Ionicons name="trending-up" size={20} color={activeLayer === 'Elevation' ? 'white' : '#666'} />
          <Text style={[styles.layerText, activeLayer === 'Elevation' && styles.layerTextActive]}>Elevation</Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  layerControl: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    ...DESIGN_SYSTEM.SHADOWS.MEDIUM,
  },
  layerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
  },
  layerButtonActive: {
    backgroundColor: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  layerText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  layerTextActive: {
    color: 'white',
  },
});

export default MapViewerScreen;
