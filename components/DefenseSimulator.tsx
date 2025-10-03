'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Rocket, Zap, Clock, DollarSign, Target } from 'lucide-react'
import { useSimulationStore } from '@/lib/store'

export function DefenseSimulator() {
  const {
    currentAsteroid,
    simulationResults,
    defenseStrategies,
    selectedDefenseStrategy,
    setSelectedDefenseStrategy,
    runDefenseSimulation
  } = useSimulationStore()

  const [isRunningDefense, setIsRunningDefense] = useState(false)

  const handleRunDefense = async () => {
    if (!currentAsteroid || !selectedDefenseStrategy) return
    
    setIsRunningDefense(true)
    await runDefenseSimulation(currentAsteroid, selectedDefenseStrategy)
    setIsRunningDefense(false)
  }

  if (!currentAsteroid) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Select an asteroid to begin defense simulation</p>
      </div>
    )
  }

  const defenseResults = simulationResults as any

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Earth Defense</h2>
      </div>

      {/* Defense Strategy Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Defense Strategies</h3>
        
        <div className="space-y-3">
          {defenseStrategies.map((strategy) => (
            <motion.button
              key={strategy.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedDefenseStrategy(strategy)}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedDefenseStrategy?.id === strategy.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  {strategy.id === 'kinetic_impactor' && <Rocket className="h-5 w-5 text-blue-400" />}
                  {strategy.id === 'gravity_tractor' && <Target className="h-5 w-5 text-green-400" />}
                  {strategy.id === 'nuclear_device' && <Zap className="h-5 w-5 text-red-400" />}
                </div>
                
                <div className="flex-1 text-left">
                  <h4 className="text-white font-semibold">{strategy.name}</h4>
                  <p className="text-gray-400 text-sm mb-2">{strategy.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        ${(strategy.cost / 1e9).toFixed(1)}B
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        {(strategy.effectiveness * 100).toFixed(0)}% effective
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        {strategy.timeToImpact} years
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Strategy Details */}
      {selectedDefenseStrategy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4"
        >
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Selected Strategy</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Cost:</span>
              <p className="text-white font-medium">${(selectedDefenseStrategy.cost / 1e9).toFixed(1)}B</p>
            </div>
            <div>
              <span className="text-gray-400">Effectiveness:</span>
              <p className="text-white font-medium">{(selectedDefenseStrategy.effectiveness * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-gray-400">Time to Impact:</span>
              <p className="text-white font-medium">{selectedDefenseStrategy.timeToImpact} years</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Run Defense Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleRunDefense}
        disabled={!selectedDefenseStrategy || isRunningDefense}
        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
      >
        {isRunningDefense ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Defending Earth...</span>
          </>
        ) : (
          <>
            <Shield className="h-5 w-5" />
            <span>Launch Defense Mission</span>
          </>
        )}
      </motion.button>

      {/* Defense Results */}
      {defenseResults && defenseResults.defenseEffectiveness !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-white">Defense Results</h3>
          
          <div className={`rounded-lg p-4 border-2 ${
            defenseResults.isSuccessful 
              ? 'border-green-500 bg-green-500/20' 
              : 'border-red-500 bg-red-500/20'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              {defenseResults.isSuccessful ? (
                <div className="text-2xl">🛡️</div>
              ) : (
                <div className="text-2xl">💥</div>
              )}
              <h4 className={`text-lg font-semibold ${
                defenseResults.isSuccessful ? 'text-green-400' : 'text-red-400'
              }`}>
                {defenseResults.isSuccessful ? 'Mission Successful!' : 'Mission Failed'}
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Defense Effectiveness:</span>
                <p className="text-white font-medium">
                  {(defenseResults.defenseEffectiveness * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <span className="text-gray-400">Risk Reduction:</span>
                <p className="text-white font-medium">
                  {(defenseResults.riskReduction * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <span className="text-gray-400">New Impact Probability:</span>
                <p className="text-white font-medium">
                  {(defenseResults.impactProbability * 100).toFixed(2)}%
                </p>
              </div>
              <div>
                <span className="text-gray-400">New Risk Factor:</span>
                <p className="text-white font-medium">
                  {(defenseResults.riskFactor * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Before vs After</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Original Impact Probability:</span>
                <span className="text-red-400">
                  {(defenseResults.originalImpactProbability * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Impact Probability:</span>
                <span className={defenseResults.isSuccessful ? 'text-green-400' : 'text-red-400'}>
                  {(defenseResults.impactProbability * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Strategy Info */}
      <div className="bg-gray-800/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Strategy Information</h4>
        <div className="text-xs text-gray-400 space-y-1">
          <p><strong>Kinetic Impactor:</strong> High-speed collision to deflect asteroid</p>
          <p><strong>Gravity Tractor:</strong> Use gravitational pull for gradual deflection</p>
          <p><strong>Nuclear Device:</strong> Explosion to fragment or deflect asteroid</p>
        </div>
      </div>
    </div>
  )
}
