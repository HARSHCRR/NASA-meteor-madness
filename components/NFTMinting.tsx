'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image, Zap, Star, Crown, Coins, Wallet } from 'lucide-react'
import { useSimulationStore } from '@/lib/store'

export function NFTMinting() {
  const { currentAsteroid, simulationResults } = useSimulationStore()
  const [isMinting, setIsMinting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)

  if (!currentAsteroid || !simulationResults) {
    return (
      <div className="text-center py-8">
        <Image className="h-12 w-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">Complete a simulation to mint an NFT</p>
      </div>
    )
  }

  const getRarityLevel = (riskFactor: number) => {
    if (riskFactor < 0.1) return { level: 'Common', color: 'text-gray-400', icon: '⭐' }
    if (riskFactor < 0.3) return { level: 'Uncommon', color: 'text-green-400', icon: '✨' }
    if (riskFactor < 0.6) return { level: 'Rare', color: 'text-blue-400', icon: '💎' }
    if (riskFactor < 0.8) return { level: 'Epic', color: 'text-purple-400', icon: '👑' }
    return { level: 'Legendary', color: 'text-orange-400', icon: '🔥' }
  }

  const getNFTValue = (riskFactor: number, impactEnergy: number) => {
    const baseValue = 0.01 // ETH
    const riskMultiplier = riskFactor * 10
    const energyMultiplier = Math.log10(impactEnergy + 1)
    return baseValue * (1 + riskMultiplier + energyMultiplier)
  }

  const rarity = getRarityLevel(simulationResults.riskFactor)
  const nftValue = getNFTValue(simulationResults.riskFactor, simulationResults.impactEnergy)

  const handleConnectWallet = () => {
    setIsConnected(true)
    // In a real app, this would connect to Web3 wallet
  }

  const handleMintNFT = async () => {
    if (!isConnected) return
    
    setIsMinting(true)
    
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false)
      setMintSuccess(true)
    }, 3000)
  }

  const generateNFTMetadata = () => {
    return {
      name: `${currentAsteroid.name} Impact Simulation`,
      description: `Risk-based NFT representing ${currentAsteroid.name} asteroid impact simulation with ${(simulationResults.riskFactor * 100).toFixed(1)}% risk factor.`,
      image: `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="asteroidGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:${rarity.color.replace('text-', '#')};stop-opacity:1" />
              <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
            </radialGradient>
          </defs>
          <rect width="400" height="400" fill="#0a0a0a"/>
          <circle cx="200" cy="200" r="80" fill="url(#asteroidGrad)"/>
          <text x="200" y="150" text-anchor="middle" fill="white" font-family="Arial" font-size="16">${currentAsteroid.name}</text>
          <text x="200" y="280" text-anchor="middle" fill="white" font-family="Arial" font-size="12">Risk: ${(simulationResults.riskFactor * 100).toFixed(1)}%</text>
          <text x="200" y="300" text-anchor="middle" fill="white" font-family="Arial" font-size="12">Energy: ${simulationResults.impactEnergy.toFixed(1)} MT</text>
          <text x="200" y="320" text-anchor="middle" fill="${rarity.color.replace('text-', '#')}" font-family="Arial" font-size="14" font-weight="bold">${rarity.level}</text>
        </svg>
      `)}`,
      attributes: [
        { trait_type: "Asteroid Name", value: currentAsteroid.name },
        { trait_type: "Diameter", value: `${currentAsteroid.diameter}m` },
        { trait_type: "Velocity", value: `${currentAsteroid.velocity} km/h` },
        { trait_type: "Impact Probability", value: `${(simulationResults.impactProbability * 100).toFixed(2)}%` },
        { trait_type: "Impact Energy", value: `${simulationResults.impactEnergy.toFixed(1)} MT` },
        { trait_type: "Crater Diameter", value: `${(simulationResults.craterDiameter / 1000).toFixed(1)} km` },
        { trait_type: "Seismic Magnitude", value: simulationResults.seismicMagnitude.toFixed(1) },
        { trait_type: "Tsunami Risk", value: `${(simulationResults.tsunamiRisk * 100).toFixed(1)}%` },
        { trait_type: "Risk Factor", value: `${(simulationResults.riskFactor * 100).toFixed(1)}%` },
        { trait_type: "Rarity", value: rarity.level }
      ]
    }
  }

  const nftMetadata = generateNFTMetadata()

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Image className="h-5 w-5 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">Mint Asteroid NFT</h2>
      </div>

      {/* NFT Preview */}
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">NFT Preview</h3>
          <div className="flex items-center space-x-1">
            <span className="text-2xl">{rarity.icon}</span>
            <span className={`font-bold ${rarity.color}`}>{rarity.level}</span>
          </div>
        </div>

        {/* NFT Image */}
        <div className="w-full h-48 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">{rarity.icon}</div>
            <p className="text-white font-semibold">{currentAsteroid.name}</p>
            <p className="text-gray-400 text-sm">Risk Factor: {(simulationResults.riskFactor * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* NFT Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Diameter:</span>
            <p className="text-white font-medium">{currentAsteroid.diameter.toLocaleString()}m</p>
          </div>
          <div>
            <span className="text-gray-400">Energy:</span>
            <p className="text-white font-medium">{simulationResults.impactEnergy.toFixed(1)} MT</p>
          </div>
          <div>
            <span className="text-gray-400">Probability:</span>
            <p className="text-white font-medium">{(simulationResults.impactProbability * 100).toFixed(2)}%</p>
          </div>
          <div>
            <span className="text-gray-400">Estimated Value:</span>
            <p className="text-white font-medium">{nftValue.toFixed(3)} ETH</p>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      {!isConnected ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConnectWallet}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
        >
          <Wallet className="h-5 w-5" />
          <span>Connect Wallet</span>
        </motion.button>
      ) : (
        <div className="space-y-4">
          {/* Minting Status */}
          {!mintSuccess ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMintNFT}
              disabled={isMinting}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200"
            >
              {isMinting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Minting NFT...</span>
                </>
              ) : (
                <>
                  <Coins className="h-5 w-5" />
                  <span>Mint NFT ({nftValue.toFixed(3)} ETH)</span>
                </>
              )}
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-4 border border-green-500"
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-2xl">🎉</div>
                <h4 className="text-lg font-semibold text-green-400">NFT Minted Successfully!</h4>
              </div>
              <p className="text-gray-300 text-sm">
                Your {rarity.level} asteroid NFT has been minted and added to your collection.
              </p>
            </motion.div>
          )}

          {/* NFT Metadata */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">NFT Metadata</h4>
            <div className="text-xs text-gray-400 space-y-1 max-h-32 overflow-y-auto">
              <p><strong>Name:</strong> {nftMetadata.name}</p>
              <p><strong>Description:</strong> {nftMetadata.description}</p>
              <p><strong>Attributes:</strong> {nftMetadata.attributes.length} traits</p>
              <p><strong>Rarity:</strong> {rarity.level}</p>
              <p><strong>Estimated Value:</strong> {nftValue.toFixed(3)} ETH</p>
            </div>
          </div>

          {/* Rarity Information */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Rarity System</h4>
            <div className="text-xs text-gray-400 space-y-1">
              <p><span className="text-gray-400">⭐ Common:</span> Risk Factor 0-10%</p>
              <p><span className="text-green-400">✨ Uncommon:</span> Risk Factor 10-30%</p>
              <p><span className="text-blue-400">💎 Rare:</span> Risk Factor 30-60%</p>
              <p><span className="text-purple-400">👑 Epic:</span> Risk Factor 60-80%</p>
              <p><span className="text-orange-400">🔥 Legendary:</span> Risk Factor 80-100%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
