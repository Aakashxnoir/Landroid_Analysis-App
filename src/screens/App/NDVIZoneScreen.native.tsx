import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { useParcelStore } from '../../store/parcelStore';
import { LandService } from '../../services/api/landService';
import { Card } from '../../components/ui/Card';

const { width } = Dimensions.get('window');

const NDVIZoneScreen = () => {
  const { selectedParcelId } = useParcelStore();
  const [zones, setZones] = useState<any>(null);

  useEffect(() => {
    if (selectedParcelId) {
      fetchZones();
    }
  }, [selectedParcelId]);

  const fetchZones = async () => {
    try {
      const data = await LandService.getNDVIZones(selectedParcelId!);
      setZones(data);
    } catch (e) {
      console.error('Fetch NDVI zones failed:', e);
    }
  };

  const LEGEND = [
    { label: 'Bare Soil', color: '#FF0000', range: '<0.2', percent: 15 },
    { label: 'Sparse Plant', color: '#FFFF00', range: '0.2-0.4', percent: 25 },
    { label: 'Healthy Plant', color: '#32CD32', range: '0.4-0.6', percent: 45 },
    { label: 'Dense Plant', color: '#006400', range: '>0.6', percent: 15 },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>NDVI Zone Classification</Text>
        <Text style={styles.subtitle}>Health distribution based on multispectral analysis</Text>
      </View>

      <Card style={styles.mapCard}>
        <MapLibreGL.MapView 
          style={styles.map} 
          // @ts-ignore
          styleURL="https://api.maptiler.com/maps/hybrid/style.json?key=AIzaSyDsgusFlDHtp3ejLdjpBhlUsOQb2tTfuC0"
        >
          <MapLibreGL.Camera centerCoordinate={[77.3042, 10.4295]} zoomLevel={17} />
          {zones && (
            <MapLibreGL.ShapeSource id="ndvi-zones" shape={zones as any}>
              <MapLibreGL.FillLayer
                id="ndvi-fill"
                style={{
                  fillColor: ['get', 'color'],
                  fillOpacity: 0.6,
                }}
              />
            </MapLibreGL.ShapeSource>
          )}
        </MapLibreGL.MapView>
      </Card>

      <View style={styles.legendContainer}>
        <Text style={styles.sectionTitle}>Zone Statistics</Text>
        <View style={styles.legendGrid}>
          {LEGEND.map((item, idx) => (
            <View key={idx} style={styles.legendEntry}>
              <View style={[styles.indicator, { backgroundColor: item.color }]} />
              <View style={styles.legendInfo}>
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendRange}>{item.range}</Text>
              </View>
              <Text style={styles.legendPercent}>{item.percent}%</Text>
            </View>
          ))}
        </View>
      </View>

      <Card style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>AI Insight</Text>
        <Text style={styles.summaryText}>
          Your parcel is predominantly Healthy (45%). However, the Sparse areas (25%) suggest a potential irrigation pattern issue in the northwest quadrant.
        </Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN_SYSTEM.COLORS.BACKGROUND,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  subtitle: {
    fontSize: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  mapCard: {
    margin: 16,
    height: 350,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 16,
  },
  map: {
    flex: 1,
  },
  legendContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    marginBottom: 16,
  },
  legendGrid: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  legendEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
  },
  legendInfo: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  legendRange: {
    fontSize: 10,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  legendPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  summaryCard: {
    margin: 20,
    backgroundColor: '#EEF2FF',
    borderWidth: 0,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4B5563',
  },
});

export default NDVIZoneScreen;
