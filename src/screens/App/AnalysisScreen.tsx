import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';
import { Ionicons } from '@expo/vector-icons';
import LandHealthMap from '../../components/analysis/LandHealthMap';

const { width } = Dimensions.get('window');

// Safe Import the ML results
let healthReport: any = null;
try {
  healthReport = require('../../ml_model/Final_Land_Health_Report.json');
} catch (e) {
  console.warn("Final_Land_Health_Report.json missing or invalid:", e);
}

// Default values if report is missing
const DEFAULT_REPORT = {
  land_health_score: 50,
  confidence_score: 0,
  components: {
    vegetation_health: 50,
    rainfall_consistency: 50,
    soil_quality: 50,
    temperature_stability: 50
  },
  raw_attributes: {
    soil_organic_carbon: null,
    soil_ph: null,
    avg_monthly_temp: 25.0
  }
};

const report = healthReport || DEFAULT_REPORT;

const AnalysisScreen = () => {
  const MAPTILER_KEY = 'o5Lzt8kbaUWdatHVPMLt';

  const MetricCard = ({ 
    title, 
    value, 
    icon, 
    unit = '%', 
    color = DESIGN_SYSTEM.COLORS.PRIMARY 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    unit?: string; 
    color?: string; 
  }) => (
    <View style={styles.metricCard}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricValue}>{value}{unit}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.title}>Land Intelligence</Text>
            <View style={styles.geeBadge}>
              <Ionicons name="globe-outline" size={12} color="white" />
              <Text style={styles.geeBadgeText}>Google Earth Engine</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>Satellite-Verified Parcel Analysis</Text>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <LandHealthMap apiKey={MAPTILER_KEY} />
        </View>

        {/* Overall Score Section */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{Math.round(report.land_health_score)}</Text>
            <Text style={styles.scoreLabel}>Health Score</Text>
          </View>
          <View style={styles.scoreInfo}>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>
                {report.land_health_score > 60 ? 'Optimal Condition' : 'Requires Attention'}
              </Text>
              <View style={[
                styles.confidenceIndicator, 
                { backgroundColor: report.confidence_score > 80 ? '#10B981' : (report.confidence_score > 60 ? '#F59E0B' : '#EF4444') }
              ]}>
                <Text style={styles.confidenceIndicatorText}>
                  {report.confidence_score > 80 ? 'High Confidence' : (report.confidence_score > 60 ? 'Moderate' : 'Low Confidence')}
                </Text>
              </View>
            </View>
            <Text style={styles.confidenceText}>
              Algorithm Confidence: {report.confidence_score}%
            </Text>
            <Text style={styles.geeSourceText}>Source: GEE Multi-Spectral Fusion</Text>
          </View>
        </View>

        {/* Details Grid */}
        <View style={styles.gridContainer}>
          <MetricCard 
            title="Vegetation" 
            value={Math.round(report.components.vegetation_health)} 
            icon="leaf" 
            color="#2E7D32" 
          />
          <MetricCard 
            title="Rainfall" 
            value={Math.round(report.components.rainfall_consistency)} 
            icon="rainy" 
            color="#1976D2" 
          />
          <MetricCard 
            title="Soil Quality" 
            value={Math.round(report.components.soil_quality)} 
            icon="earth" 
            color="#795548" 
          />
          <MetricCard 
            title="Climate" 
            value={Math.round(report.components.temperature_stability)} 
            icon="thermometer" 
            color="#F57C00" 
          />
        </View>

        {/* Raw Attributes */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Environmental Context</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Average Temp</Text>
            <Text style={styles.detailValue}>{report.raw_attributes.avg_monthly_temp}°C</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Soil Carbon</Text>
            <Text style={styles.detailValue}>
               {report.raw_attributes.soil_organic_carbon || 'N/A'} g/kg
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Soil pH</Text>
            <Text style={styles.detailValue}>
              {report.raw_attributes.soil_ph || 'N/A'}
            </Text>
          </View>
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  subtitle: {
    fontSize: 16,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    ...DESIGN_SYSTEM.SHADOWS.MEDIUM,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    marginBottom: 20,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: DESIGN_SYSTEM.COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.PRIMARY,
  },
  scoreLabel: {
    fontSize: 10,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  scoreInfo: {
    marginLeft: 20,
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  confidenceIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confidenceIndicatorText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  confidenceText: {
    fontSize: 13,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  geeSourceText: {
    fontSize: 10,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
    marginTop: 2,
    fontStyle: 'italic',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: DESIGN_SYSTEM.RADIUS.M,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  metricTitle: {
    fontSize: 12,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  geeBadge: {
    backgroundColor: DESIGN_SYSTEM.COLORS.PRIMARY,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  geeBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  detailLabel: {
    fontSize: 14,
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
});

export default AnalysisScreen;
