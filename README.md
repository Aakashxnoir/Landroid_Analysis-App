# 🚜 Landroid: Satellite-Verified Land Intelligence

Landroid is a high-performance **React Native (Expo)** application designed for Land Consultants and Landowners. It leverages **Google Earth Engine (GEE)** to provide real-time, satellite-verified land health metrics, automated parcel mapping, and confidence-scored environmental analytics.

## 🌟 Key Features

### 📡 Satellite Intelligence (GEE)
- **NDVI Vegetation Health**: Real-time multispectral analysis using **Sentinel-2** imagery to identify healthy crops, sparse areas, and bare soil.
- **Climate Stability**: Historical temperature trends via **MODIS** sensors.
- **Hydrological Insight**: Precipitation consistency tracking through **CHIRPS** data.
- **Soil Composition**: Organic carbon and pH estimations integrated from **OpenLandMap**.

### 🗺️ GIS & Mapping
- **Interactive Health Maps**: Leaflet-based GIS overlays integrated directly into the mobile/web view.
- **Automated Parceling**: GeoJSON-based boundary tracking with auto-centered satellite hybrid views.
- **Confidence Scoring**: A proprietary algorithm that scores data reliability (up to 95%) based on sensor fusion.

### 🔐 Security & Access
- **Role-Based Workflows**: Tailored dashboards for **Land Consultants** (management) and **Landowners** (viewers).
- **Secure Authentication**: Firebase-powered Phone OTP and Google OAuth integration.
- **Data Isolation**: Multi-tenant database architecture ensuring landowners only see their verified parcels.

---

## 🏗️ Technical Architecture

### 📱 Frontend (React Native + Expo)
- **Components**: Atomic design with a premium, high-contrast UI system.
- **State Management**: React Hooks + Firebase Auth.
- **Navigation**: Expo Router (Stack/Tabs).

### 🧠 Backend & ML (Python + GEE)
- **Engine**: `earthengine-api` for cloud-scale geospatial processing.
- **Data Processing**: `geopandas`, `numpy`, and `pandas` for local GeoJSON manipulation.
- **Synchronization**: Automated JSON report generation for seamless frontend consumption.

---

## 🛠️ Setup & Installation

### 1. Prerequisite Accounts
- **Google Cloud Console**: Enable Earth Engine API and create an OAuth Client ID.
- **Firebase**: Enable Authentication (Phone/Google) and Hosting.
- **Supabase**: Configure PostgreSQL for listing data.

### 2. Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Aakashxnoir/Landroid_Analysis-App.git

# Install dependencies
npm install

# Start development server
npx expo start
```

### 3. Python ML Setup
```bash
# Navigate to the Model directory
cd Model

# Install Python requirements
pip install earthengine-api pandas geopandas numpy

# Initialize GEE (One-time)
python -c "import ee; ee.Authenticate()"

# Generate Land Health Reports
python land_health_score.py
```

---

## 📁 Project Structure

```text
├── Model/               # Python GEE scripts & large GIS assets
├── src/
│   ├── components/      # UI components (Map views, Modals)
│   ├── ml_model/        # JSON reports synced from Python scripts
│   ├── navigation/      # Expo routing logic
│   ├── screens/         # App screens (Analysis, Home, Login)
│   ├── services/        # Supabase & Firebase integrations
│   └── styles/          # Premium Design System tokens
├── package.json         # Javascript dependencies
└── README.md            # You are here
```

---

## 🚀 Roadmap
- [ ] **Live GEE Tiles**: Stream satellite imagery layers directly to the mobile app instead of static GeoJSON.
- [ ] **Predictive Yield**: AI-driven crop yield forecasting based on historical NDVI.
- [ ] **Drone Integration**: Higher-resolution orthomosaic uploads for sub-centimeter health mapping.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.