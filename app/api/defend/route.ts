import { NextRequest, NextResponse } from 'next/server'
import { Asteroid, SimulationResults } from '@/lib/store'

export async function POST(request: NextRequest) {
  try {
    const { asteroid, strategy } = await request.json()

    if (!asteroid || !strategy) {
      return NextResponse.json({ error: 'Asteroid and strategy data are required' }, { status: 400 })
    }

    // Calculate defense effectiveness
    const defenseEffectiveness = calculateDefenseEffectiveness(asteroid, strategy)
    
    // Calculate new trajectory after defense
    const newTrajectory = calculateDeflectedTrajectory(asteroid, strategy)
    
    // Calculate new impact probability
    const originalImpactProbability = calculateImpactProbability(asteroid)
    const newImpactProbability = originalImpactProbability * (1 - defenseEffectiveness)
    
    // Calculate new impact energy (if still impacting)
    const newImpactEnergy = calculateImpactEnergy(asteroid) * (1 - defenseEffectiveness * 0.7)
    
    // Calculate new crater diameter
    const newCraterDiameter = calculateCraterDiameter(newImpactEnergy)
    
    // Calculate new seismic magnitude
    const newSeismicMagnitude = calculateSeismicMagnitude(newImpactEnergy)
    
    // Calculate new tsunami risk
    const newTsunamiRisk = calculateTsunamiRisk(newImpactEnergy, newCraterDiameter)
    
    // Calculate new affected area
    const newAffectedArea = calculateAffectedArea(newCraterDiameter, newSeismicMagnitude)
    
    // Calculate new risk factor
    const newRiskFactor = calculateRiskFactor({
      impactProbability: newImpactProbability,
      impactEnergy: newImpactEnergy,
      craterDiameter: newCraterDiameter,
      seismicMagnitude: newSeismicMagnitude,
      tsunamiRisk: newTsunamiRisk,
      affectedArea: newAffectedArea
    })

    // Determine success/failure
    const isSuccessful = newImpactProbability < 0.01 || newRiskFactor < 0.1
    
    const results: SimulationResults & {
      defenseEffectiveness: number
      isSuccessful: boolean
      originalImpactProbability: number
      riskReduction: number
    } = {
      impactProbability: newImpactProbability,
      impactEnergy: newImpactEnergy,
      craterDiameter: newCraterDiameter,
      seismicMagnitude: newSeismicMagnitude,
      tsunamiRisk: newTsunamiRisk,
      affectedArea: newAffectedArea,
      riskFactor: newRiskFactor,
      impactOccurred: newImpactProbability > 0.5,
      impactLocation: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
      },
      trajectory: newTrajectory,
      defenseEffectiveness,
      isSuccessful,
      originalImpactProbability,
      riskReduction: (originalImpactProbability - newImpactProbability) / originalImpactProbability
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Error running defense simulation:', error)
    return NextResponse.json({ error: 'Defense simulation failed' }, { status: 500 })
  }
}

function calculateDefenseEffectiveness(asteroid: Asteroid, strategy: any): number {
  let baseEffectiveness = strategy.effectiveness
  
  // Adjust based on asteroid characteristics
  const sizeFactor = Math.min(asteroid.diameter / 1000, 1) // Larger asteroids harder to deflect
  const velocityFactor = Math.min(asteroid.velocity / 50000, 1) // Faster asteroids harder to deflect
  
  // Adjust based on time to impact
  const timeToImpact = strategy.timeToImpact
  const timeFactor = Math.max(0, 1 - (timeToImpact / 20)) // Less time = less effective
  
  const adjustedEffectiveness = baseEffectiveness * (1 - sizeFactor * 0.3) * (1 - velocityFactor * 0.2) * (1 - timeFactor * 0.3)
  
  return Math.max(0, Math.min(adjustedEffectiveness, 0.95))
}

function calculateDeflectedTrajectory(asteroid: Asteroid, strategy: any): Array<{ x: number; y: number; z: number; time: number }> {
  const effectiveness = calculateDefenseEffectiveness(asteroid, strategy)
  const deflectionAngle = effectiveness * Math.PI / 6 // Max 30 degree deflection
  
  const points = []
  const numPoints = 100
  const timeSpan = asteroid.orbitalPeriod * 24 * 60 * 60
  
  for (let i = 0; i <= numPoints; i++) {
    const t = (i / numPoints) * timeSpan
    const angle = (t / timeSpan) * 2 * Math.PI + deflectionAngle
    
    const a = asteroid.missDistance * 1000
    const e = asteroid.eccentricity
    const r = a * (1 - e * e) / (1 + e * Math.cos(angle))
    
    const x = r * Math.cos(angle)
    const y = r * Math.sin(angle)
    const z = r * Math.sin(angle * asteroid.inclination / 180 * Math.PI) * 0.1
    
    points.push({ x: x / 1000, y: y / 1000, z: z / 1000, time: t })
  }
  
  return points
}

// Helper functions (same as in simulate route)
function calculateImpactProbability(asteroid: Asteroid): number {
  const normalizedMissDistance = asteroid.missDistance / 1000000
  const sizeFactor = Math.log10(asteroid.diameter) / 10
  let probability = Math.max(0, 0.1 - (normalizedMissDistance * 0.01) + sizeFactor * 0.05)
  return Math.min(probability, 0.95)
}

function calculateImpactEnergy(asteroid: Asteroid): number {
  const velocity = asteroid.velocity * 1000 / 3600
  const kineticEnergy = 0.5 * asteroid.mass * Math.pow(velocity, 2)
  return kineticEnergy / (4.184e15)
}

function calculateCraterDiameter(impactEnergy: number): number {
  const k = 1.2
  return k * Math.pow(impactEnergy, 1/3.4) * 1000
}

function calculateSeismicMagnitude(impactEnergy: number): number {
  return 0.67 * Math.log10(impactEnergy) + 4.4
}

function calculateTsunamiRisk(impactEnergy: number, craterDiameter: number): number {
  const baseRisk = Math.min(impactEnergy / 1000, 1)
  const sizeFactor = Math.min(craterDiameter / 50000, 1)
  return (baseRisk + sizeFactor) / 2
}

function calculateAffectedArea(craterDiameter: number, seismicMagnitude: number): number {
  const craterArea = Math.PI * Math.pow(craterDiameter / 2, 2)
  const seismicRadius = Math.pow(10, (seismicMagnitude - 4) / 2) * 1000
  const seismicArea = Math.PI * Math.pow(seismicRadius, 2)
  return craterArea + seismicArea
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
  
  const weights = {
    probability: 0.3,
    energy: 0.25,
    diameter: 0.2,
    seismic: 0.15,
    tsunami: 0.1
  }
  
  const normalizedEnergy = Math.min(impactEnergy / 10000, 1)
  const normalizedDiameter = Math.min(craterDiameter / 100000, 1)
  const normalizedSeismic = Math.min(seismicMagnitude / 10, 1)
  const normalizedArea = Math.min(affectedArea / 1e12, 1)
  
  const riskFactor = 
    impactProbability * weights.probability +
    normalizedEnergy * weights.energy +
    normalizedDiameter * weights.diameter +
    normalizedSeismic * weights.seismic +
    tsunamiRisk * weights.tsunami
  
  return Math.min(riskFactor, 1)
}
