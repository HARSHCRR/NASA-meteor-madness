import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const NASA_API_KEY = process.env.NASA_API_KEY || 'ujQxjG25ystYS7fGWzHTdwcOa2JVFDP7Apxhc0sW'
const NASA_NEO_URL = 'https://api.nasa.gov/neo/rest/v1/feed'
const NASA_SMALL_BODY_URL = 'https://ssd-api.jpl.nasa.gov/sbdb.api'
const NASA_COMETS_URL = 'https://data.nasa.gov/resource/gh4g-9sfh.json'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date') || new Date().toISOString().split('T')[0]
    const endDate = searchParams.get('end_date') || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const includeComets = searchParams.get('include_comets') === 'true'

    // Fetch data from NASA NEO API (NeoWs)
    const response = await axios.get(NASA_NEO_URL, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY
      }
    })

    // Fetch comet data if requested
    let cometData = []
    if (includeComets) {
      try {
        const cometResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/comets?limit=10&filter=near_earth`)
        const cometResult = await cometResponse.json()
        cometData = cometResult.comets || []
      } catch (error) {
        console.log('Failed to fetch comet data:', error)
      }
    }

    // Transform NASA data to our format
    const asteroids = []
    const neoData = response.data.near_earth_objects

    for (const date in neoData) {
      for (const asteroid of neoData[date]) {
        // Calculate diameter from absolute magnitude (rough approximation)
        const diameter = Math.pow(10, (6.259 - Math.log10(asteroid.absolute_magnitude_h)) / 2.5) * 1329
        
        // Calculate mass (assuming spherical asteroid with average density 2.6 g/cm³)
        const radius = diameter / 2 / 1000 // Convert to meters
        const density = 2600 // kg/m³
        const mass = (4/3) * Math.PI * Math.pow(radius, 3) * density

        asteroids.push({
          id: asteroid.id,
          name: asteroid.name,
          diameter: Math.round(diameter), // meters
          velocity: asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0,
          mass: Math.round(mass), // kg
          orbitalPeriod: asteroid.orbital_data?.period_days || 0,
          eccentricity: asteroid.orbital_data?.eccentricity || 0,
          inclination: asteroid.orbital_data?.inclination || 0,
          closeApproachDate: asteroid.close_approach_data?.[0]?.close_approach_date || '',
          missDistance: asteroid.close_approach_data?.[0]?.miss_distance?.kilometers || 0,
          relativeVelocity: asteroid.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour || 0,
          orbitingBody: asteroid.close_approach_data?.[0]?.orbiting_body || 'Earth',
          isPotentiallyHazardous: asteroid.is_potentially_hazardous_asteroid,
          absoluteMagnitude: asteroid.absolute_magnitude_h
        })
      }
    }

    // Combine asteroids and comets
    const allObjects = [...asteroids, ...cometData]
    
    // Filter for potentially hazardous objects and sort by miss distance
    const hazardousObjects = allObjects
      .filter(obj => obj.isPotentiallyHazardous)
      .sort((a, b) => a.missDistance - b.missDistance)
      .slice(0, 20) // Limit to top 20 most concerning

    return NextResponse.json({
      asteroids: hazardousObjects,
      total: hazardousObjects.length,
      dateRange: { startDate, endDate },
      dataSources: {
        nasaNeoApi: true,
        nasaCometsApi: includeComets,
        apiKey: 'Real NASA API Key'
      },
      note: includeComets ? 'Includes real NASA asteroid and comet data' : 'Real NASA asteroid data'
    })

  } catch (error) {
    console.error('Error fetching asteroid data:', error)
    
    // Return mock data if API fails
    const mockAsteroids = [
      {
        id: '2000433',
        name: '433 Eros',
        diameter: 34000,
        velocity: 45000,
        mass: 6.687e15,
        orbitalPeriod: 643,
        eccentricity: 0.222,
        inclination: 10.83,
        closeApproachDate: '2024-01-15',
        missDistance: 19500000,
        relativeVelocity: 45000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: false,
        absoluteMagnitude: 11.16
      },
      {
        id: '2001862',
        name: '1862 Apollo',
        diameter: 1700,
        velocity: 35000,
        mass: 2.1e12,
        orbitalPeriod: 651,
        eccentricity: 0.56,
        inclination: 6.35,
        closeApproachDate: '2024-02-20',
        missDistance: 8900000,
        relativeVelocity: 35000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 16.25
      }
    ]

    return NextResponse.json({
      asteroids: mockAsteroids,
      total: mockAsteroids.length,
      error: 'Using mock data - NASA API unavailable'
    })
  }
}
