'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Zap, MapPin, Waves, Activity } from 'lucide-react'
import { useSimulationStore } from '@/lib/store'

export function RiskFactorDisplay() {
  const { simulationResults, currentAsteroid } = useSimulationStore()

  if (!simulationResults || !currentAsteroid) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Run a simulation to see risk analysis</p>
      </div>
    )
  }

  const getRiskLevel = (riskFactor: number) => {
    if (riskFactor < 0.2) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/20' }
    if (riskFactor < 0.5) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/20' }
    if (riskFactor < 0.8) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-400/20' }
    return { level: 'Critical', color: 'text-red-400', bg: 'bg-red-400/20' }
  }

  const riskLevel = getRiskLevel(simulationResults.riskFactor)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-400" />
        <h2 className="text-xl font-semibold text-white">Risk Assessment</h2>
      </div>

      {/* Overall Risk Factor */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${riskLevel.bg} rounded-xl p-6 border border-white/10`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Overall Risk Factor</h3>
          <span className={`text-2xl font-bold ${riskLevel.color}`}>
            {(simulationResults.riskFactor * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Risk Level:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${riskLevel.bg} ${riskLevel.color} border border-current`}>
            {riskLevel.level}
          </span>
        </div>

        {/* Risk Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${simulationResults.riskFactor * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-2 rounded-full ${
                riskLevel.level === 'Low' ? 'bg-green-400' :
                riskLevel.level === 'Medium' ? 'bg-yellow-400' :
                riskLevel.level === 'High' ? 'bg-orange-400' : 'bg-red-400'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Detailed Risk Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Risk Components</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Impact Probability */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Impact Probability</h4>
                <p className="text-gray-400 text-sm">Chance of Earth impact</p>
              </div>
              <span className="text-xl font-bold text-blue-400">
                {(simulationResults.impactProbability * 100).toFixed(2)}%
              </span>
            </div>
          </motion.div>

          {/* Impact Energy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Impact Energy</h4>
                <p className="text-gray-400 text-sm">Kinetic energy release</p>
              </div>
              <span className="text-xl font-bold text-yellow-400">
                {simulationResults.impactEnergy.toFixed(1)} MT
              </span>
            </div>
          </motion.div>

          {/* Crater Size */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Crater Diameter</h4>
                <p className="text-gray-400 text-sm">Expected crater size</p>
              </div>
              <span className="text-xl font-bold text-orange-400">
                {(simulationResults.craterDiameter / 1000).toFixed(1)} km
              </span>
            </div>
          </motion.div>

          {/* Seismic Magnitude */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Seismic Magnitude</h4>
                <p className="text-gray-400 text-sm">Earthquake intensity</p>
              </div>
              <span className="text-xl font-bold text-red-400">
                {simulationResults.seismicMagnitude.toFixed(1)}
              </span>
            </div>
          </motion.div>

          {/* Tsunami Risk */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Waves className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">Tsunami Risk</h4>
                <p className="text-gray-400 text-sm">Coastal flooding risk</p>
              </div>
              <span className="text-xl font-bold text-cyan-400">
                {(simulationResults.tsunamiRisk * 100).toFixed(1)}%
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Risk Interpretation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4"
      >
        <h4 className="text-sm font-semibold text-blue-300 mb-2">Risk Interpretation</h4>
        <p className="text-sm text-gray-300">
          {riskLevel.level === 'Low' && "Minimal threat to Earth. Impact would cause localized damage only."}
          {riskLevel.level === 'Medium' && "Moderate threat. Regional impact with significant environmental effects."}
          {riskLevel.level === 'High' && "High threat. Continental-scale damage with global climate effects."}
          {riskLevel.level === 'Critical' && "Extinction-level threat. Global catastrophe with massive loss of life."}
        </p>
      </motion.div>
    </div>
  )
}
