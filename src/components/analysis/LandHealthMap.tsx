import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { DESIGN_SYSTEM } from '../../styles/designSystem';

// Safe Import for ML results
let healthZoneData = null;
let boundaryData = null;
try {
  healthZoneData = require('../../ml_model/Health_Zone_Map.json');
  boundaryData = require('../../ml_model/Boundary.json');
} catch (e) {
  console.warn("GIS data files missing or invalid:", e);
}

interface LandHealthMapProps {
  apiKey: string;
}

const LandHealthMap: React.FC<LandHealthMapProps> = ({ apiKey }) => {
  // Fallback if data is missing
  if (!healthZoneData || !boundaryData) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }]}>
        <Text style={{ color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY }}>GIS Map Data Unavailable</Text>
      </View>
    );
  }

  // Coordinates from ML script: 10.4295, 77.3042
  const center = [10.4295, 77.3042];
  const zoom = 17;

  // MapTiler Satellite Hybrid Tile URL
  const tileUrl = `https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=${apiKey}`;

  // Use srcDoc to inject Leaflet directly for Web (Sandboxed GIS viewer)
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin:0; padding:0; height:100%; width:100%; background: #000; }
          #map { height: 100vh; width: 100vw; }
          .leaflet-container { background: #000; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { 
            zoomControl: false,
            attributionControl: false 
          }).setView([${center[0]}, ${center[1]}], ${zoom});
          
          L.tileLayer('${tileUrl}', {
            maxZoom: 20
          }).addTo(map);

          const boundary = ${JSON.stringify(boundaryData)};
          const zones = ${JSON.stringify(healthZoneData)};

          // Add boundary
          L.geoJSON(boundary, {
            style: { color: 'white', weight: 2, fillOpacity: 0.1 }
          }).addTo(map);

          // Add zones with ML colors
          L.geoJSON(zones, {
            style: function(feature) {
              return {
                fillColor: feature.properties.color,
                weight: 1,
                opacity: 0.5,
                color: feature.properties.color,
                fillOpacity: 0.4
              };
            }
          }).addTo(map);

          L.control.zoom({ position: 'bottomright' }).addTo(map);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <iframe
          title="Land Health Map"
          srcDoc={mapHtml}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
          }}
        />
      ) : (
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
           <Text style={{ color: 'white' }}>Mobile Geo-View Active</Text>
        </View>
      )}

      {/* Legend shows on top of the map */}
      <View style={styles.legend} pointerEvents="none">
        <Text style={styles.legendTitle}>Health Zones</Text>
        {[
          { color: '#006400', label: 'Healthy' },
          { color: '#FFFF00', label: 'Sparse' },
          { color: '#FF0000', label: 'Bare Soil' },
          { color: '#808080', label: 'Non-Plant' },
        ].map((item, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 400,
    width: '100%',
    borderRadius: DESIGN_SYSTEM.RADIUS.L,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: DESIGN_SYSTEM.COLORS.BORDER,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: DESIGN_SYSTEM.RADIUS.S,
    ...DESIGN_SYSTEM.SHADOWS.SMALL,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    color: DESIGN_SYSTEM.COLORS.TEXT_PRIMARY,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 8,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
    color: DESIGN_SYSTEM.COLORS.TEXT_SECONDARY,
  },
});

export default LandHealthMap;
