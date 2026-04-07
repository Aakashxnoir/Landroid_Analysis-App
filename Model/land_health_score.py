import ee
import json
import numpy as np
import pandas as pd
import geopandas as gpd

# Paths
INPUT_GJSON = r"src/ml_model/Boundary.json"
INPUT_HEALTH_GJSON = r"src/ml_model/Health_Zone_Map.json"
OUTPUT_REPORT = r"src/ml_model/Final_Land_Health_Report.json"

# GEE Configuration (Credentials should be added here)
# CLIENT_ID = '347896385091-6mic3u1n8js6u1uh6d04de03avi39mri.apps.googleusercontent.com'
# SERVICE_ACCOUNT = 'YOUR_SERVICE_ACCOUNT_EMAIL'
# KEY_FILE = 'path/to/your/key.json'

def initialize_gee():
    """Initializes GEE with placeholders for user credentials."""
    try:
        # Placeholder for service account authentication
        # credentials = ee.ServiceAccountCredentials(SERVICE_ACCOUNT, KEY_FILE)
        # ee.Initialize(credentials)
        
        # Temporary: Attempt local auth if session exists
        ee.Initialize()
        return True
    except Exception as e:
        print(f"GEE Initialization Error (Credentials needed): {e}")
        return False

def calculate_scores():
    # 1. Load Local Data
    try:
        gdf = gpd.read_file(INPUT_GJSON).to_crs("EPSG:4326")
        centroid = gdf.centroid.iloc[0]
        bbox_raw = list(gdf.total_bounds) # [minX, minY, maxX, maxY]
        roi = ee.Geometry.Rectangle(bbox_raw)
    except Exception as e:
        print(f"Error loading boundary: {e}")
        return

    is_gee_ready = initialize_gee()

    # Load previously calculated health zones
    try:
        health_gdf = gpd.read_file(INPUT_HEALTH_GJSON)
        # Calculate mean VARI weight (simulated by zone distribution)
        zone_counts = health_gdf['zone_id'].value_counts(normalize=True)
        veg_score = (zone_counts.get(3, 0) * 100 + zone_counts.get(2, 0) * 60 + zone_counts.get(1, 0) * 20)
    except:
        veg_score = 50.0 # Fallback
    
    # 2. GEE Fetching Logic
    soil_score = 50.0
    rain_score = 50.0
    temp_score = 50.0
    raw_attributes = {
        "soil_organic_carbon": None,
        "soil_ph": None,
        "avg_monthly_temp": 25.0
    }

    if is_gee_ready:
        try:
            # Fetch Precipitation (CHIRPS)
            rain_col = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD') \
                .filterBounds(roi) \
                .filterDate('2023-01-01', '2023-12-31') \
                .select('precipitation')
            mean_rain = rain_col.mean().reduceRegion(reducer=ee.Reducer.mean(), geometry=roi, scale=5000).getInfo()
            
            # Fetch Temperature (MODIS)
            temp_col = ee.ImageCollection('MODIS/061/MOD11A1') \
                .filterBounds(roi) \
                .filterDate('2023-01-01', '2023-12-31') \
                .select('LST_Day_1km')
            mean_temp = temp_col.mean().multiply(0.02).subtract(273.15).reduceRegion(reducer=ee.Reducer.mean(), geometry=roi, scale=1000).getInfo()

            # Fetch Soil Carbon (OpenLandMap)
            soil_carbon_img = ee.Image('OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02').select('b0')
            soil_c = soil_carbon_img.reduceRegion(reducer=ee.Reducer.mean(), geometry=roi, scale=250).getInfo()

            # Map GEE results to scores
            if mean_rain and 'precipitation' in mean_rain:
                rain_score = min(100, (mean_rain['precipitation'] / 5) * 100) # Simplified heuristic
            if mean_temp and 'LST_Day_1km' in mean_temp:
                avg_t = mean_temp['LST_Day_1km']
                temp_score = 100 - abs(avg_t - 25) * 4 # Peak at 25C
                raw_attributes["avg_monthly_temp"] = round(avg_t, 2)
            if soil_c and 'b0' in soil_c:
                raw_attributes["soil_organic_carbon"] = round(soil_c['b0'], 2)
                soil_score = min(100, (soil_c['b0'] / 30) * 100)

        except Exception as e:
            print(f"Error fetching GEE data: {e}")

    # 3. Final Composite Calculation
    final_score = (
        (veg_score * 0.40) +
        (rain_score * 0.30) +
        (soil_score * 0.20) +
        (temp_score * 0.10)
    )
    
    # 4. Confidence Score Logic
    # 95% if all GEE sensors return data, 60% if fallback to local zone models
    sensors_ok = all([mean_rain, mean_temp, soil_c]) if is_gee_ready else False
    confidence = 95.0 if sensors_ok else 60.0

    result = {
        "land_health_score": round(final_score, 2),
        "confidence_score": round(confidence, 2),
        "components": {
            "vegetation_health": round(veg_score, 2),
            "rainfall_consistency": round(rain_score, 2),
            "soil_quality": round(soil_score, 2),
            "temperature_stability": round(temp_score, 2)
        },
        "raw_attributes": raw_attributes
    }
    
    print(json.dumps(result, indent=4))
    
    # Save to file
    with open(OUTPUT_REPORT, "w") as f:
        json.dump(result, f, indent=4)

if __name__ == "__main__":
    calculate_scores()
