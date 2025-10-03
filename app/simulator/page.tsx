'use client'

import { useState, useEffect } from 'react'
import { AsteroidVisualizer } from '@/components/AsteroidVisualizer'
import { SimulationControls } from '@/components/SimulationControls'
import { ImpactMap } from '@/components/ImpactMap'
import { RiskFactorDisplay } from '@/components/RiskFactorDisplay'
import { NFTMinting } from '@/components/NFTMinting'
import { DefenseSimulator } from '@/components/DefenseSimulator'
import { useSimulationStore } from '@/lib/store'
import { motion } from 'framer-motion'

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState('simulation')
  const { currentAsteroid, simulationResults, isLoading } = useSimulationStore()

  const tabs = [
    { id: 'simulation', label: 'Simulation', icon: '🌌' },
    { id: 'impact', label: 'Impact Analysis', icon: '💥' },
    { id: 'defense', label: 'Defend Earth', icon: '🛡️' },
    { id: 'nft', label: 'Mint NFT', icon: '🎨' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Risk-Based AstroNFT Simulator</h1>
              <p className="text-gray-300 mt-1">Explore asteroid trajectories and simulate Earth impacts using real NASA data</p>
            </div>
            <div className="flex items-center space-x-4">
              {currentAsteroid && (
                <div className="text-right">
                  <p className="text-sm text-gray-300">Current Asteroid</p>
                  <p className="text-lg font-semibold text-white">{currentAsteroid.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
              {activeTab === 'simulation' && <SimulationControls />}
              {activeTab === 'impact' && <RiskFactorDisplay />}
              {activeTab === 'defense' && <DefenseSimulator />}
              {activeTab === 'nft' && <NFTMinting />}
            </div>
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 h-[600px]">
              {activeTab === 'simulation' && <AsteroidVisualizer />}
              {activeTab === 'impact' && <ImpactMap />}
              {activeTab === 'defense' && <AsteroidVisualizer showDefense={true} />}
              {activeTab === 'nft' && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-white mb-2">NFT Preview</h3>
                    <p className="text-gray-300">Your asteroid NFT will be minted with the simulation data</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Running simulation...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
