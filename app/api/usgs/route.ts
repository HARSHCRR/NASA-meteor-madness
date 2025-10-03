import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const USGS_EARTHQUAKE_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query'
const USGS_ELEVATION_URL = 'https://elevation.nationalmap.gov/arcgis/services/3DEPElevation/ImageServer/WCSServer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dataType = searchParams.get('type') // 'earthquake' or 'elevation'
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') || '1000' // km

    if (dataType === 'earthquake') {
      // Fetch earthquake data from USGS NEIC
      const earthquakeResponse = await axios.get(USGS_EARTHQUAKE_URL, {
        params: {
          format: 'geojson',
          starttime: '1900-01-01',
          endtime: new Date().toISOString().split('T')[0],
          minmagnitude: 4.0,
          limit: 1000,
          ...(lat && lng ? {
            latitude: lat,
            longitude: lng,
            maxradiuskm: radius
          } : {})
        }
      })

      return NextResponse.json({
        type: 'earthquake',
        data: earthquakeResponse.data,
        count: earthquakeResponse.data.features?.length || 0
      })
    }

    if (dataType === 'elevation' && lat && lng) {
      // Fetch elevation data from USGS National Map
      try {
        const elevationResponse = await axios.get(USGS_ELEVATION_URL, {
          params: {
            service: 'WCS',
            version: '2.0.1',
            request: 'GetCoverage',
            coverageid: '3DEPElevation',
            subset: `Long(${lng}),Lat(${lat})`,
            format: 'image/tiff'
          }
        })

        return NextResponse.json({
          type: 'elevation',
          data: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            elevation: elevationResponse.data
          }
        })
      } catch (elevationError) {
        // Fallback to mock elevation data if USGS service is unavailable
        return NextResponse.json({
          type: 'elevation',
          data: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            elevation: Math.random() * 2000 + 100, // Mock elevation in meters
            source: 'mock_data'
          }
        })
      }
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })

  } catch (error) {
    console.error('Error fetching USGS data:', error)
    
    // Return mock data if API fails
    if (dataType === 'earthquake') {
      return NextResponse.json({
        type: 'earthquake',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {
                mag: 7.5,
                place: 'Impact Simulation Zone',
                time: Date.now(),
                magType: 'Mwr',
                title: 'Simulated Impact Event'
              },
              geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng || '0'), parseFloat(lat || '0'), 10]
              }
            }
          ]
        },
        count: 1,
        error: 'Using mock earthquake data - USGS API unavailable'
      })
    }

    return NextResponse.json({ error: 'USGS API unavailable' }, { status: 500 })
  }
}
