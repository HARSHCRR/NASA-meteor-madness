import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const NASA_SMALL_BODY_URL = 'https://ssd-api.jpl.nasa.gov/sbdb.api'
const NASA_COMETS_URL = 'https://data.nasa.gov/resource/gh4g-9sfh.json'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const asteroidId = searchParams.get('id')
    const includeComets = searchParams.get('include_comets') === 'true'

    if (asteroidId) {
      // Fetch detailed orbital data for specific asteroid from Small-Body Database
      const response = await axios.get(NASA_SMALL_BODY_URL, {
        params: {
          des: asteroidId,
          sb: 1,
          cov: 1
        }
      })

      const orbitalData = response.data.orbital_data
      const physicalData = response.data.physical_data

      return NextResponse.json({
        type: 'asteroid',
        data: {
          id: response.data.object_id,
          name: response.data.full_name,
          orbital: {
            semiMajorAxis: orbitalData?.a || 0,
            eccentricity: orbitalData?.e || 0,
            inclination: orbitalData?.i || 0,
            longitudeOfAscendingNode: orbitalData?.om || 0,
            argumentOfPeriapsis: orbitalData?.w || 0,
            meanAnomaly: orbitalData?.ma || 0,
            period: orbitalData?.per || 0,
            perihelionDistance: orbitalData?.q || 0,
            aphelionDistance: orbitalData?.ad || 0,
            orbitalClass: orbitalData?.orbit_class?.orbit_class_type || 'Unknown'
          },
          physical: {
            diameter: physicalData?.diameter || 0,
            albedo: physicalData?.albedo || 0,
            rotationPeriod: physicalData?.rot_per || 0,
            spectralType: physicalData?.spec_B || 'Unknown'
          }
        }
      })
    }

    if (includeComets) {
      // Fetch comet orbital elements from NASA Open Data Portal
      const cometsResponse = await axios.get(NASA_COMETS_URL, {
        params: {
          $limit: 50
        }
      })

      const comets = cometsResponse.data.map((comet: any) => ({
        id: comet.des,
        name: comet.full_name,
        type: 'comet',
        orbital: {
          semiMajorAxis: parseFloat(comet.a) || 0,
          eccentricity: parseFloat(comet.e) || 0,
          inclination: parseFloat(comet.i) || 0,
          longitudeOfAscendingNode: parseFloat(comet.om) || 0,
          argumentOfPeriapsis: parseFloat(comet.w) || 0,
          meanAnomaly: parseFloat(comet.ma) || 0,
          period: parseFloat(comet.per) || 0,
          perihelionDistance: parseFloat(comet.q) || 0,
          aphelionDistance: parseFloat(comet.ad) || 0,
          orbitalClass: 'Comet'
        }
      }))

      return NextResponse.json({
        type: 'comets',
        data: comets,
        count: comets.length
      })
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })

  } catch (error) {
    console.error('Error fetching orbital data:', error)
    
    // Return mock orbital data if API fails
    return NextResponse.json({
      type: 'asteroid',
      data: {
        id: asteroidId || 'mock',
        name: 'Mock Asteroid',
        orbital: {
          semiMajorAxis: 1.5,
          eccentricity: 0.3,
          inclination: 15.5,
          longitudeOfAscendingNode: 120.0,
          argumentOfPeriapsis: 45.0,
          meanAnomaly: 180.0,
          period: 365.25,
          perihelionDistance: 1.0,
          aphelionDistance: 2.0,
          orbitalClass: 'Apollo'
        },
        physical: {
          diameter: 1000,
          albedo: 0.15,
          rotationPeriod: 12.5,
          spectralType: 'S'
        }
      },
      error: 'Using mock orbital data - NASA API unavailable'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keplerianElements, timeSpan, numPoints } = await request.json()

    // Enhanced orbital propagation using NASA's Keplerian parameters
    const trajectory = propagateOrbit(keplerianElements, timeSpan, numPoints)

    return NextResponse.json({
      trajectory,
      elements: keplerianElements,
      timeSpan,
      numPoints
    })

  } catch (error) {
    console.error('Error propagating orbit:', error)
    return NextResponse.json({ error: 'Orbital propagation failed' }, { status: 500 })
  }
}

function propagateOrbit(elements: any, timeSpan: number, numPoints: number) {
  const { semiMajorAxis, eccentricity, inclination, longitudeOfAscendingNode, argumentOfPeriapsis, meanAnomaly } = elements
  
  const trajectory = []
  const dt = timeSpan / numPoints
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i * dt
    const M = meanAnomaly + (t / (semiMajorAxis * 365.25)) * 360 // Mean anomaly at time t
    
    // Solve Kepler's equation for eccentric anomaly
    const E = solveKeplersEquation(M, eccentricity)
    
    // Calculate true anomaly
    const nu = 2 * Math.atan(Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(E / 2))
    
    // Calculate radius
    const r = semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(nu))
    
    // Convert to Cartesian coordinates
    const x = r * (Math.cos(longitudeOfAscendingNode * Math.PI / 180) * Math.cos(argumentOfPeriapsis + nu) - 
                   Math.sin(longitudeOfAscendingNode * Math.PI / 180) * Math.sin(argumentOfPeriapsis + nu) * Math.cos(inclination * Math.PI / 180))
    
    const y = r * (Math.sin(longitudeOfAscendingNode * Math.PI / 180) * Math.cos(argumentOfPeriapsis + nu) + 
                   Math.cos(longitudeOfAscendingNode * Math.PI / 180) * Math.sin(argumentOfPeriapsis + nu) * Math.cos(inclination * Math.PI / 180))
    
    const z = r * Math.sin(argumentOfPeriapsis + nu) * Math.sin(inclination * Math.PI / 180)
    
    trajectory.push({
      x: x * 149.6e6, // Convert AU to km
      y: y * 149.6e6,
      z: z * 149.6e6,
      time: t,
      trueAnomaly: nu * 180 / Math.PI,
      radius: r * 149.6e6
    })
  }
  
  return trajectory
}

function solveKeplersEquation(M: number, e: number, tolerance = 1e-6, maxIterations = 100) {
  let E = M // Initial guess
  let deltaE = 1
  let iterations = 0
  
  while (Math.abs(deltaE) > tolerance && iterations < maxIterations) {
    deltaE = (M - (E - e * Math.sin(E))) / (1 - e * Math.cos(E))
    E += deltaE
    iterations++
  }
  
  return E
}
