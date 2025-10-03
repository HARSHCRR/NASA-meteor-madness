# 🌌 Risk-Based AstroNFT Simulator

An interactive web platform that allows users to explore real asteroid trajectories, simulate Earth impacts using NASA and USGS datasets, and mint NFTs based on scientifically calculated risk factors. Defend Earth in a gamified, scientifically accurate environment.

![Risk-Based AstroNFT Simulator](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.158.0-black?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)

## 🚀 Features

### 🌟 Core Functionality
- **Real Asteroid Data**: Integration with NASA NEO API for live asteroid tracking
- **3D Visualization**: Interactive Three.js-based asteroid trajectory visualization
- **Impact Simulation**: Scientifically accurate impact energy and crater modeling
- **Risk Assessment**: Multi-factor risk calculation based on asteroid parameters
- **Earth Defense**: Test mitigation strategies including kinetic impactors and nuclear devices
- **NFT Minting**: Mint collectible NFTs with rarity tied to calculated risk factors

### 🎯 Key Components
- **Simulation Dashboard**: Interactive controls for asteroid selection and parameter adjustment
- **3D Asteroid Visualizer**: Real-time trajectory animation with orbital mechanics
- **Impact Map**: 2D visualization of impact zones, seismic effects, and tsunami risks
- **Risk Factor Display**: Comprehensive risk analysis with color-coded threat levels
- **Defense Simulator**: Gamified Earth defense with multiple mitigation strategies
- **NFT Gallery**: Mint and manage asteroid NFTs with scientific metadata

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14, React 18 | Interactive web application |
| **3D Graphics** | Three.js, React Three Fiber | Asteroid trajectory visualization |
| **2D Maps** | D3.js, Leaflet.js | Impact zone mapping |
| **Backend** | Node.js, Express | API and simulation engine |
| **Blockchain** | Polygon Testnet | NFT minting and metadata |
| **Styling** | Tailwind CSS | Modern, responsive design |
| **Animation** | Framer Motion | Smooth UI transitions |
| **State Management** | Zustand | Application state management |

## 📊 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER LAYER    │    │  FRONTEND LAYER │    │  BACKEND LAYER  │    │  DATA LAYERS    │
│                 │    │                 │    │                 │    │                 │
│ • Scientists    │◄──►│ • React/Next.js │◄──►│ • Node.js API   │◄──►│ • NASA NEO API  │
│ • Educators     │    │ • Three.js 3D   │    │ • Simulation    │    │ • USGS DEM      │
│ • General Public│    │ • D3.js Maps    │    │ • Orbital Mech  │    │ • USGS NEIC     │
│ • NFT Collectors│    │ • UI Controls   │    │ • Risk Calc     │    │ • Blockchain    │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- NASA API key (optional, defaults to DEMO_KEY)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/risk-based-astronft-simulator.git
   cd risk-based-astronft-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   echo "NASA_API_KEY=your_nasa_api_key_here" > .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### 1. Asteroid Selection
- Browse available asteroids from NASA's NEO database
- Select potentially hazardous asteroids for simulation
- View detailed asteroid parameters (diameter, velocity, orbital data)

### 2. Impact Simulation
- Run impact probability calculations
- Visualize 3D asteroid trajectories
- Calculate impact energy and crater formation
- Assess seismic and tsunami risks

### 3. Risk Assessment
- View comprehensive risk factor analysis
- Understand threat levels (Low, Medium, High, Critical)
- Analyze environmental impact zones
- Review affected population estimates

### 4. Earth Defense
- Select defense strategies (Kinetic Impactor, Gravity Tractor, Nuclear Device)
- Simulate mitigation effectiveness
- Compare before/after risk scenarios
- Achieve successful deflection missions

### 5. NFT Minting
- Mint NFTs representing simulated asteroids
- Rarity based on calculated risk factors
- Metadata includes scientific parameters
- Trade and collect unique asteroid NFTs

## 📡 API Endpoints

```
GET  /api/asteroids          - Fetch NASA NEO data
POST /api/simulate           - Run impact simulation
POST /api/defend             - Simulate defense strategies
GET  /api/risk-factor        - Calculate risk score
```

## 🔬 Scientific Accuracy

### Orbital Mechanics
- Keplerian orbital elements calculation
- Real-time trajectory propagation
- Impact probability assessment
- Miss distance analysis

### Impact Modeling
- Kinetic energy calculations
- Crater scaling laws
- Seismic magnitude estimation
- Tsunami risk assessment

### Risk Assessment
- Multi-factor risk algorithm
- Population density weighting
- Environmental impact scoring
- Comprehensive threat evaluation

## 🎨 NFT System

### Rarity Levels
- **⭐ Common** (0-10% risk): Minimal threat asteroids
- **✨ Uncommon** (10-30% risk): Regional impact potential
- **💎 Rare** (30-60% risk): Continental-scale damage
- **👑 Epic** (60-80% risk): Global climate effects
- **🔥 Legendary** (80-100% risk): Extinction-level threat

### Metadata Includes
- Asteroid name and orbital parameters
- Impact simulation results
- Risk factor and threat assessment
- Scientific accuracy verification

## 🌍 Educational Value

### Learning Objectives
- Understand orbital mechanics and asteroid dynamics
- Learn about impact crater formation and scaling
- Explore Earth defense strategies and mitigation
- Experience real scientific data visualization

### Target Audience
- **Scientists & Educators**: Accurate data and educational tools
- **General Public**: Interactive, gamified learning experience
- **NFT Enthusiasts**: Collectibles with real scientific value
- **Students**: Hands-on space science education

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For providing the NEO API and asteroid data
- **USGS**: For environmental and geological datasets
- **Three.js Community**: For 3D visualization capabilities
- **Open Source Contributors**: For the amazing libraries and tools

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/risk-based-astronft-simulator/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/risk-based-astronft-simulator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/risk-based-astronft-simulator/discussions)

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Docker
```bash
docker build -t astronft-simulator .
docker run -p 3000:3000 astronft-simulator
```

---

**Built with ❤️ for space science education and asteroid impact awareness**

*Explore the cosmos, defend Earth, and mint the future of scientific NFTs!* 🌌🚀