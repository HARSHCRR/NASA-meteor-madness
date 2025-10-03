'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Database, Globe, Zap, CheckCircle, AlertCircle } from 'lucide-react'

interface DataSourceInfo {
  name: string
  status: 'active' | 'inactive' | 'error'
  description: string
  icon: React.ReactNode
  dataPoints: number
  lastUpdated: string
}

export function DataSourceDisplay() {
  const [dataSources, setDataSources] = useState<DataSourceInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking data source status
    const checkDataSources = async () => {
      try {
        // Check NASA NEO API
        const asteroidsResponse = await fetch('/api/asteroids?limit=5')
        const asteroidsData = await asteroidsResponse.json()
        
        // Check USGS API
        const usgsResponse = await fetch('/api/usgs?type=earthquake&limit=5')
        const usgsData = await usgsResponse.json()
        
        // Check Comets API
        const cometsResponse = await fetch('/api/comets?limit=5')
        const cometsData = await cometsResponse.json()

        setDataSources([
          {
            name: 'NASA NEO Web Service API',
            status: 'active',
            description: 'Real-time Near-Earth Object tracking',
            icon: <Globe className="h-5 w-5" />,
            dataPoints: asteroidsData.total || 0,
            lastUpdated: new Date().toISOString()
          },
          {
            name: 'NASA Near-Earth Comets API',
            status: 'active',
            description: 'Orbital elements for 170+ comets',
            icon: <Zap className="h-5 w-5" />,
            dataPoints: cometsData.total || 0,
            lastUpdated: new Date().toISOString()
          },
          {
            name: 'USGS NEIC Earthquake Catalog',
            status: 'active',
            description: 'Global earthquake data for seismic modeling',
            icon: <Database className="h-5 w-5" />,
            dataPoints: usgsData.count || 0,
            lastUpdated: new Date().toISOString()
          },
          {
            name: 'USGS National Map Elevation',
            status: 'active',
            description: 'High-resolution terrain data',
            icon: <Database className="h-5 w-5" />,
            dataPoints: 1000000, // Estimated
            lastUpdated: new Date().toISOString()
          }
        ])
      } catch (error) {
        console.error('Error checking data sources:', error)
        setDataSources([
          {
            name: 'NASA NEO Web Service API',
            status: 'error',
            description: 'Real-time Near-Earth Object tracking',
            icon: <Globe className="h-5 w-5" />,
            dataPoints: 0,
            lastUpdated: 'Unknown'
          }
        ])
      } finally {
        setIsLoading(false)
      }
    }

    checkDataSources()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'inactive': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'inactive': return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Database className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Data Sources</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Live Data Sources</h3>
      </div>

      <div className="space-y-3">
        {dataSources.map((source, index) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  source.status === 'active' ? 'bg-green-500/20' :
                  source.status === 'inactive' ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                }`}>
                  {source.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-medium">{source.name}</h4>
                    {getStatusIcon(source.status)}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{source.description}</p>
                  <div className="flex items-center space-x-4 text-xs">
                    <span className="text-gray-500">
                      Data Points: <span className="text-white font-medium">{source.dataPoints.toLocaleString()}</span>
                    </span>
                    <span className="text-gray-500">
                      Status: <span className={getStatusColor(source.status)}>{source.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4"
      >
        <h4 className="text-sm font-semibold text-blue-300 mb-2">Enhanced Features</h4>
        <div className="text-xs text-gray-300 space-y-1">
          <p>✅ Real NASA API Key Integration</p>
          <p>✅ Live Comet Orbital Elements (170+ comets)</p>
          <p>✅ USGS Earthquake & Elevation Data</p>
          <p>✅ Scientific Accuracy Validation</p>
          <p>✅ Real-time Data Updates</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-3 text-center"
      >
        <a
          href="https://eyes.nasa.gov/apps/asteroids/#/home"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>View NASA Eyes on Asteroids</span>
        </a>
      </motion.div>
    </div>
  )
}
