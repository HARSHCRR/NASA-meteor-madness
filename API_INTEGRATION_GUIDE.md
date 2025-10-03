# NASA & USGS API Integration Guide

This document outlines all the NASA and USGS APIs integrated into the Risk-Based AstroNFT Simulator, based on the official NASA Data & Resources provided.

## 🌌 NASA APIs

### 1. NASA Near-Earth Object (NEO) Web Service API
**Endpoint**: `https://api.nasa.gov/neo/rest/v1/feed`
**Purpose**: Primary asteroid data source for real-time NEO tracking
**Integration**: `/api/asteroids`

**Features**:
- Orbital parameters (semi-major axis, eccentricity, inclination)
- Size estimates and close-approach data
- Potentially hazardous asteroid identification
- Real-time orbital paths and impact scenarios

**Usage**:
```javascript
// Fetch asteroids for date range
GET /api/asteroids?start_date=2024-01-01&end_date=2024-01-07

// Include comets in results
GET /api/asteroids?include_comets=true
```

### 2. NASA Small-Body Database Query Tool
**Endpoint**: `https://ssd-api.jpl.nasa.gov/sbdb.api`
**Purpose**: Detailed orbital elements for specific asteroids
**Integration**: `/api/orbital`

**Features**:
- Keplerian parameters for NEOs and PHAs
- Detailed orbital mechanics data
- Physical properties and spectral types
- High-precision trajectory calculations

**Usage**:
```javascript
// Get detailed orbital data for specific asteroid
GET /api/orbital?id=2000433

// Include comet orbital elements
GET /api/orbital?include_comets=true
```

### 3. NASA Near-Earth Comets Orbital Elements API
**Endpoint**: `https://data.nasa.gov/resource/gh4g-9sfh.json`
**Purpose**: Keplerian orbital elements for 170 near-Earth comets
**Integration**: `/api/orbital` (comets parameter)

**Features**:
- JSON format orbital data
- Comet-specific orbital parameters
- Practice data for orbital propagators
- Enhanced trajectory simulation capabilities

### 4. NASA Approximate Positions of the Planets
**Reference**: Keplerian orbital parameters for planetary bodies
**Purpose**: Reference for orbital mechanics calculations
**Integration**: Enhanced orbital propagation algorithms

**Features**:
- Planetary orbital parameters
- Keplerian element formulas
- Position calculation methods
- Orbital mechanics foundation

## 🌍 USGS APIs

### 1. USGS NEIC Earthquake Catalog
**Endpoint**: `https://earthquake.usgs.gov/fdsnws/event/1/query`
**Purpose**: Global earthquake data for seismic impact modeling
**Integration**: `/api/usgs?type=earthquake`

**Features**:
- Comprehensive global earthquake catalog
- Location, magnitude, and depth data
- Seismic effect correlation with impact energy
- Ground shaking visualization data

**Usage**:
```javascript
// Fetch earthquake data for impact modeling
GET /api/usgs?type=earthquake&lat=40.7128&lng=-74.0060&radius=1000

// Get historical earthquake data for seismic calibration
GET /api/usgs?type=earthquake&limit=1000&minmagnitude=4.0
```

### 2. USGS National Map Elevation Data
**Endpoint**: `https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WCSServer`
**Purpose**: High-resolution DEM data for terrain modeling
**Integration**: `/api/usgs?type=elevation`

**Features**:
- High-resolution digital elevation models
- GeoTIFF format elevation data
- Tsunami inundation modeling
- Crater formation terrain analysis
- GIS-compatible data formats

**Usage**:
```javascript
// Get elevation data for impact location
GET /api/usgs?type=elevation&lat=40.7128&lng=-74.0060

// Use for tsunami and crater modeling
```

### 3. USGS National Map Training Resources
**Reference**: Training videos and documentation
**Purpose**: Educational resources for data utilization
**Integration**: Documentation and user guides

## 🔬 Enhanced Scientific Integration

### Orbital Mechanics Enhancement
- **NASA Keplerian Parameters**: Precise orbital element calculations
- **Elliptical Orbit Simulation**: NASA tutorial-based propagation
- **Small-Body Database Integration**: Real asteroid orbital data
- **Planetary Position Reference**: Solar system context

### Impact Modeling Enhancement
- **USGS Earthquake Correlation**: Seismic magnitude calibration
- **Elevation-Based Terrain**: Realistic crater formation
- **Tsunami Modeling**: Ocean proximity analysis
- **Environmental Effects**: Geological impact assessment

### Data Quality & Accuracy
- **Real-Time Updates**: Live NASA NEO data
- **Scientific Validation**: USGS geological data
- **Error Handling**: Fallback to mock data when APIs unavailable
- **Data Caching**: Optimized API usage and performance

## 🚀 API Endpoints Summary

| Endpoint | Purpose | Data Source | Features |
|----------|---------|-------------|----------|
| `/api/asteroids` | Asteroid data | NASA NEO API | Real-time NEO tracking |
| `/api/orbital` | Orbital mechanics | NASA Small-Body DB | Keplerian parameters |
| `/api/usgs` | Geological data | USGS APIs | Earthquake & elevation |
| `/api/simulate` | Basic simulation | Calculated | Impact modeling |
| `/api/enhanced-simulate` | Advanced simulation | NASA + USGS | Scientific accuracy |
| `/api/defend` | Defense strategies | Calculated | Mitigation simulation |

## 🔑 API Keys & Configuration

### Required API Keys
```bash
# NASA API Key (free)
NASA_API_KEY=your_nasa_api_key_here

# USGS APIs (public, no key required)
# Earthquake and elevation data freely available
```

### Getting NASA API Key
1. Visit [api.nasa.gov](https://api.nasa.gov)
2. Fill out the simple form
3. Receive your free API key instantly
4. Add to `.env.local` file

### Rate Limits
- **NASA NEO API**: 1000 requests per hour (with key)
- **NASA Small-Body DB**: No formal limit
- **USGS APIs**: No rate limits
- **Demo Key**: 30 requests per hour (limited)

## 📊 Data Flow Architecture

```
User Request → Frontend → API Gateway → NASA/USGS APIs
     ↓              ↓           ↓            ↓
Asteroid Selection → UI → Enhanced API → Real Data
     ↓              ↓           ↓            ↓
Simulation → Results → Scientific → Impact Model
     ↓              ↓           ↓            ↓
NFT Minting → Metadata → Risk Factor → Blockchain
```

## 🛠️ Implementation Details

### Error Handling
- Graceful fallback to mock data when APIs unavailable
- Retry logic for transient failures
- Comprehensive error logging
- User-friendly error messages

### Performance Optimization
- Intelligent data caching
- Parallel API requests where possible
- Efficient data transformation
- Minimal payload sizes

### Scientific Accuracy
- Peer-reviewed calculation methods
- Real NASA/USGS data validation
- Uncertainty quantification
- Reproducible results

## 🌟 Future Enhancements

### Additional NASA APIs
- **Eyes on Asteroids**: 3D visualization reference
- **Asteroid Radar**: Shape and rotation data
- **Planetary Defense**: Mitigation strategy data

### Additional USGS APIs
- **Water Resources**: Tsunami modeling enhancement
- **Geological Surveys**: Regional impact analysis
- **Hazards Data**: Risk assessment improvement

### Canadian Space Agency Integration
- **NEOSSAT Data**: Space telescope observations
- **Asteroid Tracking**: Enhanced detection capabilities

This comprehensive API integration ensures the Risk-Based AstroNFT Simulator uses the most accurate, up-to-date scientific data available from NASA and USGS, providing users with a scientifically rigorous and educationally valuable experience.
