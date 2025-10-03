import { NextResponse } from 'next/server'

export async function GET() {
  try {
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
        absoluteMagnitude: 11.16,
        type: 'asteroid'
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
        absoluteMagnitude: 16.25,
        type: 'asteroid'
      },
      {
        id: '2003554',
        name: '3554 Amun',
        diameter: 3200,
        velocity: 42000,
        mass: 1.7e13,
        orbitalPeriod: 1.8,
        eccentricity: 0.28,
        inclination: 23.45,
        closeApproachDate: '2024-03-10',
        missDistance: 12000000,
        relativeVelocity: 42000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 15.8,
        type: 'asteroid'
      },
      {
        id: '2001989',
        name: '1989 ML',
        diameter: 800,
        velocity: 38000,
        mass: 2.7e11,
        orbitalPeriod: 2.1,
        eccentricity: 0.35,
        inclination: 8.2,
        closeApproachDate: '2024-03-25',
        missDistance: 7500000,
        relativeVelocity: 38000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 17.3,
        type: 'asteroid'
      },
      {
        id: '2002340',
        name: '2340 Hathor',
        diameter: 210,
        velocity: 41000,
        mass: 1.2e10,
        orbitalPeriod: 0.77,
        eccentricity: 0.45,
        inclination: 5.85,
        closeApproachDate: '2024-04-05',
        missDistance: 3200000,
        relativeVelocity: 41000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 20.2,
        type: 'asteroid'
      },
      {
        id: '2003757',
        name: '3757 Anagolay',
        diameter: 150,
        velocity: 39000,
        mass: 5.3e9,
        orbitalPeriod: 0.62,
        eccentricity: 0.52,
        inclination: 3.1,
        closeApproachDate: '2024-04-18',
        missDistance: 2800000,
        relativeVelocity: 39000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 20.8,
        type: 'asteroid'
      },
      {
        id: '2004769',
        name: '4769 Castalia',
        diameter: 1800,
        velocity: 36000,
        mass: 1.1e12,
        orbitalPeriod: 1.4,
        eccentricity: 0.48,
        inclination: 8.88,
        closeApproachDate: '2024-05-02',
        missDistance: 9800000,
        relativeVelocity: 36000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 16.9,
        type: 'asteroid'
      },
      {
        id: '20065803',
        name: '65803 Didymos',
        diameter: 780,
        velocity: 43000,
        mass: 5.4e11,
        orbitalPeriod: 2.11,
        eccentricity: 0.38,
        inclination: 3.41,
        closeApproachDate: '2024-05-15',
        missDistance: 6700000,
        relativeVelocity: 43000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 18.0,
        type: 'asteroid'
      },
      {
        id: '2003200',
        name: '3200 Phaethon',
        diameter: 5100,
        velocity: 47000,
        mass: 1.4e14,
        orbitalPeriod: 1.43,
        eccentricity: 0.89,
        inclination: 22.25,
        closeApproachDate: '2024-06-01',
        missDistance: 21000000,
        relativeVelocity: 47000,
        orbitingBody: 'Earth',
        isPotentiallyHazardous: true,
        absoluteMagnitude: 14.6,
        type: 'asteroid'
      }
    ]

    return NextResponse.json({
      asteroids: mockAsteroids,
      total: mockAsteroids.length,
      dataSources: {
        nasaNeoApi: false,
        nasaCometsApi: false,
        apiKey: 'Test API'
      },
      note: 'Test asteroids data'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Test API failed' }, { status: 500 })
  }
}
