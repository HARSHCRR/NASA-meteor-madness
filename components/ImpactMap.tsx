'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, Zap, Waves, Activity } from 'lucide-react'
import { useSimulationStore } from '@/lib/store'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

// Fix for default markers in react-leaflet - will be set up in useEffect

export function ImpactMap() {
  const { simulationResults, currentAsteroid } = useSimulationStore()
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Set up Leaflet icons and CSS after component mounts
    const setupLeafletIcons = async () => {
      // Import Leaflet CSS
      await import('leaflet/dist/leaflet.css')
      
      // Import and set up Leaflet
      const L = await import('leaflet')
      
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })
      
      setMapLoaded(true)
    }
    
    setupLeafletIcons()
  }, [])

  if (!simulationResults || !currentAsteroid) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Run a simulation to see impact analysis</p>
        </div>
      </div>
    )
  }

  const impactLocation = simulationResults.impactLocation
  const craterRadius = (simulationResults.craterDiameter / 2) / 1000 // Convert to km
  const seismicRadius = Math.pow(10, (simulationResults.seismicMagnitude - 4) / 2) // km
  const tsunamiRadius = simulationResults.tsunamiRisk * 200 // km (max 200km for ocean impacts)

  if (!mapLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[impactLocation.lat, impactLocation.lng]}
        zoom={6}
        className="w-full h-full rounded-lg"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Impact Location Marker */}
        <Marker position={[impactLocation.lat, impactLocation.lng]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-lg">{currentAsteroid.name}</h3>
              <p className="text-sm text-gray-600">Impact Location</p>
            </div>
          </Popup>
        </Marker>

        {/* Crater Zone */}
        <Circle
          center={[impactLocation.lat, impactLocation.lng]}
          radius={craterRadius * 1000} // Convert to meters
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.3,
            weight: 2
          }}
        >
          <Popup>
            <div className="text-center">
              <h4 className="font-semibold text-red-600">Crater Zone</h4>
              <p className="text-sm">Diameter: {craterRadius.toFixed(1)} km</p>
              <p className="text-sm">Total destruction</p>
            </div>
          </Popup>
        </Circle>

        {/* Seismic Zone */}
        <Circle
          center={[impactLocation.lat, impactLocation.lng]}
          radius={seismicRadius * 1000}
          pathOptions={{
            color: '#f59e0b',
            fillColor: '#f59e0b',
            fillOpacity: 0.2,
            weight: 2
          }}
        >
          <Popup>
            <div className="text-center">
              <h4 className="font-semibold text-orange-600">Seismic Zone</h4>
              <p className="text-sm">Radius: {seismicRadius.toFixed(1)} km</p>
              <p className="text-sm">Magnitude: {simulationResults.seismicMagnitude.toFixed(1)}</p>
              <p className="text-sm">Severe structural damage</p>
            </div>
          </Popup>
        </Circle>

        {/* Tsunami Zone (only if ocean impact) */}
        {simulationResults.tsunamiRisk > 0.3 && (
          <Circle
            center={[impactLocation.lat, impactLocation.lng]}
            radius={tsunamiRadius * 1000}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#06b6d4',
              fillOpacity: 0.15,
              weight: 2
            }}
          >
            <Popup>
              <div className="text-center">
                <h4 className="font-semibold text-cyan-600">Tsunami Zone</h4>
                <p className="text-sm">Radius: {tsunamiRadius.toFixed(1)} km</p>
                <p className="text-sm">Risk: {(simulationResults.tsunamiRisk * 100).toFixed(1)}%</p>
                <p className="text-sm">Coastal flooding</p>
              </div>
            </Popup>
          </Circle>
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
        <h4 className="font-semibold mb-3">Impact Zones</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>Crater Zone</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span>Seismic Zone</span>
          </div>
          {simulationResults.tsunamiRisk > 0.3 && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
              <span>Tsunami Zone</span>
            </div>
          )}
        </div>
      </div>

      {/* Impact Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white text-sm max-w-xs"
      >
        <h4 className="font-semibold mb-3 flex items-center">
          <Zap className="h-4 w-4 mr-2 text-yellow-400" />
          Impact Analysis
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Energy:</span>
            <span className="font-medium">{simulationResults.impactEnergy.toFixed(1)} MT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Crater:</span>
            <span className="font-medium">{(simulationResults.craterDiameter / 1000).toFixed(1)} km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Seismic:</span>
            <span className="font-medium">{simulationResults.seismicMagnitude.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Affected Area:</span>
            <span className="font-medium">{(simulationResults.affectedArea / 1e6).toFixed(1)} km²</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
