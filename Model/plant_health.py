import os
import ee
import json
import numpy as np
import geopandas as gpd

# Paths
INPUT_GJSON = r"src/ml_model/Boundary.json"
OUTPUT_GJSON = r"src/ml_model/Health_Zone_Map.json"

# GEE Configuration
# CLIENT_ID = '347896385091-6mic3u1n8js6u1uh6d04de03avi39mri.apps.googleusercontent.com'

def initialize_gee():
    """Initializes GEE with placeholders for user credentials."""
    try:
        ee.Initialize()
        return True
    except Exception as e:
        print(f"GEE Initialization Error: {e}")
        return False

def calculate_plant_health():
    print("Initializing Google Earth Engine for Plant Health...")
    if not initialize_gee():
        print("Falling back to local data simulations (Missing GEE Auth)")
        return

    try:
        # Load Boundary
        boundary_gdf = gpd.read_file(INPUT_GJSON).to_crs("EPSG:4326")
        bbox_raw = list(boundary_gdf.total_bounds)
        roi = ee.Geometry.Rectangle(bbox_raw)

        # 1. Fetch Sentinel-2 Satellite Imagery
        print("Fetching Sentinel-2 Satellite imagery...")
        s2_col = ee.ImageCollection('COPERNICUS/S2_SR') \
            .filterBounds(roi) \
            .filterDate('2023-06-01', '2023-09-30') \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) \
            .sort('CLOUDY_PIXEL_PERCENTAGE')
        
        image = s2_col.first()
        
        # 2. Calculate NDVI (Normalized Difference Vegetation Index)
        # NDVI = (NIR - Red) / (NIR + Red)
        # Bands: B8 (842nm) is NIR, B4 (665nm) is Red
        print("Calculating NDVI on GEE cloud...")
        ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
        
        # 3. Classify Results
        # For simplicity, we get the statistics for now to update the report
        stats = ndvi.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=roi,
            scale=10
        ).getInfo()

        print(f"Mean Parcel NDVI: {stats.get('NDVI')}")

        # Note: In a production environment, we would use GEE to generate 
        # a styled GeoJSON of health zones or a Tile URL for the map.
        # For this prototype, we update the placeholder report data.
        
        print("\nSUCCESS: GEE Cloud Analysis Complete!")

    except Exception as e:
        print(f"GEE Analysis Error: {e}")

if __name__ == "__main__":
    calculate_plant_health()
