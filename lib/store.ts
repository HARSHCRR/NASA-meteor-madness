import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface Asteroid {
  id: string
  name: string
  diameter: number
  velocity: number
  mass: number
  orbitalPeriod: number
  eccentricity: number
  inclination: number
  closeApproachDate: string
  missDistance: number
  relativeVelocity: number
  orbitingBody: string
  isPotentiallyHazardous: boolean
  absoluteMagnitude: number
}

export interface SimulationResults {
  impactProbability: number
  impactEnergy: number
  craterDiameter: number
  seismicMagnitude: number
  tsunamiRisk: number
  affectedArea: number
  riskFactor: number
  impactOccurred: boolean
  impactLocation?: {
    lat: number
    lng: number
  }
  trajectory: Array<{ x: number; y: number; z: number; time: number }>
}

export interface DefenseStrategy {
  id: string
  name: string
  description: string
  cost: number
  effectiveness: number
  timeToImpact: number
}

interface SimulationState {
  // Current asteroid being simulated
  currentAsteroid: Asteroid | null
  
  // Simulation results
  simulationResults: SimulationResults | null
  
  // Available asteroids from NASA API
  availableAsteroids: Asteroid[]
  
  // Loading states
  isLoading: boolean
  isFetchingAsteroids: boolean
  
  // Defense simulation
  defenseStrategies: DefenseStrategy[]
  selectedDefenseStrategy: DefenseStrategy | null
  
  // Actions
  setCurrentAsteroid: (asteroid: Asteroid) => void
  setSimulationResults: (results: SimulationResults) => void
  setAvailableAsteroids: (asteroids: Asteroid[]) => void
  setLoading: (loading: boolean) => void
  setFetchingAsteroids: (fetching: boolean) => void
  setSelectedDefenseStrategy: (strategy: DefenseStrategy | null) => void
  
  // API calls
  fetchAsteroids: () => Promise<void>
  runSimulation: (asteroid: Asteroid) => Promise<void>
  runDefenseSimulation: (asteroid: Asteroid, strategy: DefenseStrategy) => Promise<void>
}

export const useSimulationStore = create<SimulationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentAsteroid: null,
      simulationResults: null,
      availableAsteroids: [],
      isLoading: false,
      isFetchingAsteroids: false,
      defenseStrategies: [
        {
          id: 'kinetic_impactor',
          name: 'Kinetic Impactor',
          description: 'High-speed spacecraft collision to deflect asteroid',
          cost: 500000000,
          effectiveness: 0.8,
          timeToImpact: 10
        },
        {
          id: 'gravity_tractor',
          name: 'Gravity Tractor',
          description: 'Use gravitational pull to gradually deflect asteroid',
          cost: 300000000,
          effectiveness: 0.6,
          timeToImpact: 20
        },
        {
          id: 'nuclear_device',
          name: 'Nuclear Device',
          description: 'Nuclear explosion to fragment or deflect asteroid',
          cost: 1000000000,
          effectiveness: 0.9,
          timeToImpact: 5
        }
      ],
      selectedDefenseStrategy: null,

      // Actions
      setCurrentAsteroid: (asteroid) => set({ currentAsteroid: asteroid }),
      setSimulationResults: (results) => set({ simulationResults: results }),
      setAvailableAsteroids: (asteroids) => set({ availableAsteroids: asteroids }),
      setLoading: (loading) => set({ isLoading: loading }),
      setFetchingAsteroids: (fetching) => set({ isFetchingAsteroids: fetching }),
      setSelectedDefenseStrategy: (strategy) => set({ selectedDefenseStrategy: strategy }),

      // API calls
      fetchAsteroids: async (includeComets = false) => {
        set({ isFetchingAsteroids: true })
        try {
          const url = includeComets ? '/api/asteroids?include_comets=true' : '/api/asteroids'
          const response = await fetch(url)
          const data = await response.json()
          set({ availableAsteroids: data.asteroids || [] })
        } catch (error) {
          console.error('Failed to fetch asteroids:', error)
        } finally {
          set({ isFetchingAsteroids: false })
        }
      },

      runSimulation: async (asteroid) => {
        set({ isLoading: true })
        try {
          // Use enhanced simulation API with NASA and USGS data
          const response = await fetch('/api/enhanced-simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asteroid, useUSGSData: true })
          })
          const results = await response.json()
          set({ 
            simulationResults: results,
            currentAsteroid: asteroid 
          })
        } catch (error) {
          console.error('Failed to run simulation:', error)
          // Fallback to basic simulation if enhanced fails
          try {
            const fallbackResponse = await fetch('/api/simulate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ asteroid })
            })
            const fallbackResults = await fallbackResponse.json()
            set({ 
              simulationResults: fallbackResults,
              currentAsteroid: asteroid 
            })
          } catch (fallbackError) {
            console.error('Fallback simulation also failed:', fallbackError)
          }
        } finally {
          set({ isLoading: false })
        }
      },

      runDefenseSimulation: async (asteroid, strategy) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/defend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ asteroid, strategy })
          })
          const results = await response.json()
          set({ 
            simulationResults: results,
            currentAsteroid: asteroid,
            selectedDefenseStrategy: strategy 
          })
        } catch (error) {
          console.error('Failed to run defense simulation:', error)
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    { name: 'simulation-store' }
  )
)
