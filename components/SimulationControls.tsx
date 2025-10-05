'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, RefreshCw, Target, Zap } from 'lucide-react'
import { useSimulationStore, Asteroid } from '@/lib/store'

export function SimulationControls() {
  const {
    availableAsteroids,
    currentAsteroid,
    isFetchingAsteroids,
    fetchAsteroids,
    runSimulation,
    setCurrentAsteroid
  } = useSimulationStore()

  const [selectedAsteroidId, setSelectedAsteroidId] = useState<string>('')

  useEffect(() => {
    if (availableAsteroids.length === 0) {
      fetchAsteroids()
    }
  }, [availableAsteroids.length, fetchAsteroids])

  const [includeComets, setIncludeComets] = useState(false)

  const handleFetchWithComets = async () => {
    setIncludeComets(true)
    await fetchAsteroids()
  }

  const handleAsteroidSelect = (asteroid: Asteroid) => {
    setCurrentAsteroid(asteroid)
    setSelectedAsteroidId(asteroid.id)
  }

  const handleRunSimulation = async () => {
    if (currentAsteroid) {
      await runSimulation(currentAsteroid)
    }
  }

  const selectedAsteroid = availableAsteroids.find(a => a.id === selectedAsteroidId)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Asteroid Selection</h2>
      </div>

      {/* Asteroid Dropdown */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">
          Select Asteroid
        </label>
        {isFetchingAsteroids ? (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-300">Loading asteroids...</span>
          </div>
        ) : (
          <select
            value={selectedAsteroidId}
            onChange={(e) => {
              const asteroid = availableAsteroids.find(a => a.id === e.target.value)
              if (asteroid) handleAsteroidSelect(asteroid)
            }}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an asteroid or comet...</option>
            {availableAsteroids.map((asteroid) => (
              <option key={asteroid.id} value={asteroid.id}>
                {asteroid.name} ({asteroid.diameter}m, {asteroid.isPotentiallyHazardous ? 'Hazardous' : 'Safe'})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Selected Asteroid Details */}
      {selectedAsteroid && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-lg p-4 space-y-3"
        >
          <h3 className="text-lg font-semibold text-white">{selectedAsteroid.name}</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Diameter:</span>
              <p className="text-white font-medium">{selectedAsteroid.diameter.toLocaleString()}m</p>
            </div>
            <div>
              <span className="text-gray-400">Mass:</span>
              <p className="text-white font-medium">{(selectedAsteroid.mass / 1e12).toFixed(2)}B kg</p>
            </div>
            <div>
              <span className="text-gray-400">Velocity:</span>
              <p className="text-white font-medium">{selectedAsteroid.velocity.toLocaleString()} km/h</p>
            </div>
            <div>
              <span className="text-gray-400">Miss Distance:</span>
              <p className="text-white font-medium">{(selectedAsteroid.missDistance / 1000).toLocaleString()} km</p>
            </div>
            <div>
              <span className="text-gray-400">Orbital Period:</span>
              <p className="text-white font-medium">{selectedAsteroid.orbitalPeriod.toLocaleString()} days</p>
            </div>
            <div>
              <span className="text-gray-400">Hazardous:</span>
              <p className={`font-medium ${selectedAsteroid.isPotentiallyHazardous ? 'text-red-400' : 'text-green-400'}`}>
                {selectedAsteroid.isPotentiallyHazardous ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Simulation Controls */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Simulation</h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRunSimulation}
          disabled={!currentAsteroid}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
        >
          <Play className="h-5 w-5" />
          <span>Run Impact Simulation</span>
        </motion.button>

        <div className="text-xs text-gray-400 space-y-1">
          <p>• Calculates impact probability and energy</p>
          <p>• Models crater formation and seismic effects</p>
          <p>• Estimates tsunami risk and affected areas</p>
          <p>• Generates comprehensive risk assessment</p>
        </div>
      </div>

      {/* Comet Toggle */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-300">Include Comets</h4>
          <button
            onClick={handleFetchWithComets}
            disabled={isFetchingAsteroids}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              includeComets 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            } ${isFetchingAsteroids ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {includeComets ? 'Enabled' : 'Enable'}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Include real NASA comet data with orbital elements from 170+ comets
        </p>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-300 mb-2">Available Objects</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total:</span>
            <p className="text-white font-medium">{availableAsteroids.length}</p>
          </div>
          <div>
            <span className="text-gray-400">Hazardous:</span>
            <p className="text-red-400 font-medium">
              {availableAsteroids.filter(a => a.isPotentiallyHazardous).length}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Comets:</span>
            <p className="text-blue-400 font-medium">
              {availableAsteroids.filter(a => a.orbitingBody === 'Comet').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
