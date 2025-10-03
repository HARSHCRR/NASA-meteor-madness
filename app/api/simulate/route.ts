import { NextRequest, NextResponse } from 'next/server'
import { Asteroid, SimulationResults } from '@/lib/store'

// Constants for calculations
const EARTH_MASS = 5.972e24 // kg
const EARTH_RADIUS = 6371000 // meters
const G = 6.674e-11 // Gravitational constant
const EARTH_ESCAPE_VELOCITY = 11200 // m/s

export async function POST(request: NextRequest) {
  try {
    const { asteroid }: { asteroid: Asteroid } = await request.json()

    if (!asteroid) {
      return NextResponse.json({ error: 'Asteroid data is required' }, { status: 400 })
    }

    // Calculate impact probability based on miss distance and asteroid size
    const impactProbability = calculateImpactProbability(asteroid)
    
    // Calculate impact energy
    const impactEnergy = calculateImpactEnergy(asteroid)
    
    // Calculate crater diameter (using scaling laws)
    const craterDiameter = calculateCraterDiameter(impactEnergy)
    
    // Calculate seismic magnitude
    const seismicMagnitude = calculateSeismicMagnitude(impactEnergy)
    
    // Calculate tsunami risk
    const tsunamiRisk = calculateTsunamiRisk(impactEnergy, craterDiameter)
    
    // Calculate affected area
    const affectedArea = calculateAffectedArea(craterDiameter, seismicMagnitude)
    
    // Calculate comprehensive risk factor
    const riskFactor = calculateRiskFactor({
      impactProbability,
      impactEnergy,
      craterDiameter,
      seismicMagnitude,
      tsunamiRisk,
      affectedArea
    })

    // Generate trajectory points (simplified orbital mechanics)
    const trajectory = generateTrajectory(asteroid)

    // Determine impact location (random for demo, would use actual orbital calculations)
    const impactLocation = {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    }

    // Determine if impact occurred based on probability
    const impactOccurred = impactProbability > 0.5

    const results: SimulationResults = {
      impactProbability,
      impactEnergy,
      craterDiameter,
      seismicMagnitude,
      tsunamiRisk,
      affectedArea,
      riskFactor,
      impactOccurred,
      impactLocation,
      trajectory
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Error running simulation:', error)
    return NextResponse.json({ error: 'Simulation failed' }, { status: 500 })
  }
}

function calculateImpactProbability(asteroid: Asteroid): number {
  // Simplified impact probability based on miss distance and size
  const normalizedMissDistance = asteroid.missDistance / 1000000 // Convert to millions of km
  const sizeFactor = Math.log10(asteroid.diameter) / 10
  
  // Higher probability for closer asteroids and larger sizes
  let probability = Math.max(0, 0.1 - (normalizedMissDistance * 0.01) + sizeFactor * 0.05)
  
  // Cap at reasonable maximum
  return Math.min(probability, 0.95)
}

function calculateImpactEnergy(asteroid: Asteroid): number {
  // Convert velocity from km/h to m/s
  const velocity = asteroid.velocity * 1000 / 3600
  
  // Kinetic energy = 0.5 * mass * velocity^2
  const kineticEnergy = 0.5 * asteroid.mass * Math.pow(velocity, 2)
  
  // Convert to megatons TNT (1 megaton = 4.184e15 J)
  return kineticEnergy / (4.184e15)
}

function calculateCraterDiameter(impactEnergy: number): number {
  // Scaling law for crater diameter (simplified)
  // D = k * E^(1/3.4) where E is energy in megatons
  const k = 1.2 // Scaling factor
  return k * Math.pow(impactEnergy, 1/3.4) * 1000 // Convert to meters
}

function calculateSeismicMagnitude(impactEnergy: number): number {
  // Relationship between impact energy and seismic magnitude
  // M = 0.67 * log10(E) + 4.4 (simplified)
  return 0.67 * Math.log10(impactEnergy) + 4.4
}

function calculateTsunamiRisk(impactEnergy: number, craterDiameter: number): number {
  // Tsunami risk depends on impact energy and ocean proximity
  // Simplified calculation: higher energy and larger craters increase risk
  const baseRisk = Math.min(impactEnergy / 1000, 1) // Normalize by 1000 megatons
  const sizeFactor = Math.min(craterDiameter / 50000, 1) // Normalize by 50km crater
  
  return (baseRisk + sizeFactor) / 2
}

function calculateAffectedArea(craterDiameter: number, seismicMagnitude: number): number {
  // Affected area includes crater plus seismic damage radius
  const craterArea = Math.PI * Math.pow(craterDiameter / 2, 2)
  const seismicRadius = Math.pow(10, (seismicMagnitude - 4) / 2) * 1000 // meters
  const seismicArea = Math.PI * Math.pow(seismicRadius, 2)
  
  return craterArea + seismicArea // square meters
}

function calculateRiskFactor(params: {
  impactProbability: number
  impactEnergy: number
  craterDiameter: number
  seismicMagnitude: number
  tsunamiRisk: number
  affectedArea: number
}): number {
  const { impactProbability, impactEnergy, craterDiameter, seismicMagnitude, tsunamiRisk, affectedArea } = params
  
  // Weighted risk calculation
  const weights = {
    probability: 0.3,
    energy: 0.25,
    diameter: 0.2,
    seismic: 0.15,
    tsunami: 0.1
  }
  
  // Normalize values (0-1 scale)
  const normalizedEnergy = Math.min(impactEnergy / 10000, 1) // Cap at 10,000 megatons
  const normalizedDiameter = Math.min(craterDiameter / 100000, 1) // Cap at 100km
  const normalizedSeismic = Math.min(seismicMagnitude / 10, 1) // Cap at magnitude 10
  const normalizedArea = Math.min(affectedArea / 1e12, 1) // Cap at 1 million km²
  
  const riskFactor = 
    impactProbability * weights.probability +
    normalizedEnergy * weights.energy +
    normalizedDiameter * weights.diameter +
    normalizedSeismic * weights.seismic +
    tsunamiRisk * weights.tsunami
  
  return Math.min(riskFactor, 1) // Cap at 1.0
}

function generateTrajectory(asteroid: Asteroid): Array<{ x: number; y: number; z: number; time: number }> {
  // Generate simplified trajectory points
  const points = []
  const numPoints = 100
  const timeSpan = asteroid.orbitalPeriod * 24 * 60 * 60 // Convert days to seconds
  
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * timeSpan
    const angle = (t / timeSpan) * 2 * Math.PI
    
    // Simplified elliptical orbit
    const a = asteroid.missDistance * 1000 // Semi-major axis in meters
    const e = asteroid.eccentricity
    const r = a * (1 - e * e) / (1 + e * Math.cos(angle))
    
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)
    const z = r * Math.sin(angle * asteroid.inclination / 180 * Math.PI) * 0.1
    
    points.push({ x: x / 1000, y: y / 1000, z: z / 1000, time: t })
  }
  
  return points
}
