'use client'

import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useSimulationStore } from '@/lib/store'

interface AsteroidVisualizerProps {
  showDefense?: boolean
}

function Asteroid({ position, size, trajectory, isDeflected = false }: {
  position: [number, number, number]
  size: number
  trajectory: Array<{ x: number; y: number; z: number; time: number }>
  isDeflected?: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [currentPosition, setCurrentPosition] = useState(position)
  const [trajectoryIndex, setTrajectoryIndex] = useState(0)

  useFrame((state, delta) => {
    if (meshRef.current && trajectory.length > 0) {
      // Animate along trajectory
      const speed = 0.5 // Animation speed
      const newIndex = Math.floor((state.clock.elapsedTime * speed) % trajectory.length)
      
      if (newIndex !== trajectoryIndex) {
        setTrajectoryIndex(newIndex)
        const point = trajectory[newIndex]
        setCurrentPosition([point.x, point.y, point.z])
        meshRef.current.position.set(point.x, point.y, point.z)
      }

      // Rotate the asteroid
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={currentPosition}>
      <icosahedronGeometry args={[size, 0]} />
      <meshStandardMaterial 
        color={isDeflected ? "#4ade80" : "#8b5cf6"} 
        roughness={0.8}
        metalness={0.2}
      />
    </mesh>
  )
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={earthRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial 
        color="#4a90e2"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

function OrbitPath({ trajectory, isDeflected = false }: {
  trajectory: Array<{ x: number; y: number; z: number; time: number }>
  isDeflected?: boolean
}) {
  const points = trajectory.map(point => new THREE.Vector3(point.x, point.y, point.z))
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  
  return (
    <line geometry={geometry}>
      <lineBasicMaterial 
        color={isDeflected ? "#4ade80" : "#8b5cf6"} 
        linewidth={2}
        transparent
        opacity={0.6}
      />
    </line>
  )
}

function ImpactZone({ showImpact = false }: { showImpact?: boolean }) {
  if (!showImpact) return null

  return (
    <group>
      {/* Impact crater */}
      <mesh position={[0, 0, 2]}>
        <cylinderGeometry args={[0.3, 0.5, 0.1, 32]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      
      {/* Shock wave */}
      <mesh position={[0, 0, 2.1]}>
        <ringGeometry args={[0.6, 1.5, 32]} />
        <meshStandardMaterial 
          color="#ff6b6b" 
          transparent 
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function SceneContent({ showDefense = false }: { showDefense?: boolean }) {
  const { currentAsteroid, simulationResults } = useSimulationStore()

  if (!currentAsteroid) {
    return (
      <group>
        <Earth />
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Select an asteroid to visualize
        </Text>
      </group>
    )
  }

  const asteroidSize = Math.max(0.1, Math.min(0.5, currentAsteroid.diameter / 10000))
  const trajectory = simulationResults?.trajectory || []
  
  // Show impact zone if simulation results indicate an impact occurred
  const showImpact = Boolean(simulationResults?.impactOccurred)

  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Earth />
      
      {showImpact && <ImpactZone showImpact={showImpact} />}
      
      {trajectory.length > 0 && (
        <OrbitPath 
          trajectory={trajectory} 
          isDeflected={showDefense && simulationResults?.defenseEffectiveness > 0}
        />
      )}
      
      <Asteroid
        position={[0, 0, 5]}
        size={asteroidSize}
        trajectory={trajectory}
        isDeflected={showDefense && simulationResults?.defenseEffectiveness > 0}
      />

      {/* Labels */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Earth
      </Text>
      
      <Text
        position={[0, 0, 6]}
        fontSize={0.2}
        color={showDefense ? "#4ade80" : "#8b5cf6"}
        anchorX="center"
        anchorY="middle"
      >
        {currentAsteroid.name}
      </Text>
    </group>
  )
}

export function AsteroidVisualizer({ showDefense = false }: AsteroidVisualizerProps) {
  const { simulationResults } = useSimulationStore()

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        className="rounded-lg"
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <SceneContent showDefense={showDefense} />
        </Suspense>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={5}
        />
      </Canvas>

      {/* Overlay Controls */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
        <div className="space-y-1">
          <p><span className="text-gray-400">Mouse:</span> Rotate view</p>
          <p><span className="text-gray-400">Scroll:</span> Zoom in/out</p>
          <p><span className="text-gray-400">Right-click:</span> Pan view</p>
        </div>
      </div>

      {/* Simulation Status */}
      {simulationResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm"
        >
          <div className="space-y-1">
            <p><span className="text-gray-400">Impact Probability:</span> {(simulationResults.impactProbability * 100).toFixed(2)}%</p>
            <p><span className="text-gray-400">Energy:</span> {simulationResults.impactEnergy.toFixed(1)} MT</p>
            <p><span className="text-gray-400">Risk Factor:</span> {(simulationResults.riskFactor * 100).toFixed(1)}%</p>
            {showDefense && simulationResults.defenseEffectiveness && (
              <p><span className="text-gray-400">Defense Success:</span> 
                <span className={simulationResults.isSuccessful ? "text-green-400" : "text-red-400"}>
                  {simulationResults.isSuccessful ? " SUCCESS" : " FAILED"}
                </span>
              </p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
