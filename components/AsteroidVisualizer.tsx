'use client'

import { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Sphere, useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useSimulationStore } from '@/lib/store'

interface AsteroidVisualizerProps {
  showDefense?: boolean
}

function ParticleTrail({ position, isDeflected = false }: {
  position: [number, number, number]
  isDeflected?: boolean
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 50
  
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles behind the asteroid
      positions[i * 3] = position[0] + (Math.random() - 0.5) * 0.5
      positions[i * 3 + 1] = position[1] + (Math.random() - 0.5) * 0.5
      positions[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
      
      // Random velocities for trail effect
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
    
    return geometry
  }, [position])
  
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: isDeflected ? "#4ade80" : "#8b5cf6",
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
  }, [isDeflected])

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      const velocities = particlesRef.current.geometry.attributes.velocity.array as Float32Array
      
      for (let i = 0; i < particleCount; i++) {
        // Update particle positions
        positions[i * 3] += velocities[i * 3] * delta * 60
        positions[i * 3 + 1] += velocities[i * 3 + 1] * delta * 60
        positions[i * 3 + 2] += velocities[i * 3 + 2] * delta * 60
        
        // Reset particles that are too far behind
        const distance = Math.sqrt(
          Math.pow(positions[i * 3] - position[0], 2) +
          Math.pow(positions[i * 3 + 1] - position[1], 2) +
          Math.pow(positions[i * 3 + 2] - position[2], 2)
        )
        
        if (distance > 2) {
          positions[i * 3] = position[0] + (Math.random() - 0.5) * 0.5
          positions[i * 3 + 1] = position[1] + (Math.random() - 0.5) * 0.5
          positions[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
        }
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <points ref={particlesRef} geometry={particleGeometry} material={particleMaterial} />
  )
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

  // Create a more realistic asteroid shape
  const asteroidGeometry = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(size, 2)
    
    // Add some randomness to vertices for irregular shape
    const positions = geometry.attributes.position.array as Float32Array
    for (let i = 0; i < positions.length; i += 3) {
      const randomFactor = 0.3 + Math.random() * 0.4 // 0.3 to 0.7
      positions[i] *= randomFactor     // x
      positions[i + 1] *= randomFactor // y
      positions[i + 2] *= randomFactor // z
    }
    
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [size])

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

      // Realistic tumbling rotation
      meshRef.current.rotation.x += delta * (0.3 + Math.random() * 0.4)
      meshRef.current.rotation.y += delta * (0.2 + Math.random() * 0.3)
      meshRef.current.rotation.z += delta * (0.1 + Math.random() * 0.2)
    }
  })

  return (
    <group>
      {/* Main asteroid */}
      <mesh ref={meshRef} position={currentPosition} geometry={asteroidGeometry} castShadow>
        <meshStandardMaterial 
          color={isDeflected ? "#4ade80" : "#8b5cf6"} 
          roughness={0.9}
          metalness={0.1}
          bumpScale={0.1}
        />
      </mesh>
      
      {/* Particle trail */}
      <ParticleTrail position={currentPosition} isDeflected={isDeflected} />
    </group>
  )
}

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudRef = useRef<THREE.Mesh>(null)

  // Create realistic Earth textures using procedural generation
  const earthMaterial = useMemo(() => {
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(0.4, 0.6, 1.0), // Ocean blue base
      shininess: 100,
      transparent: false,
    })

    // Create a simple landmass pattern using noise
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Ocean background
    ctx.fillStyle = '#1e3a8a' // Deep blue
    ctx.fillRect(0, 0, 512, 256)
    
    // Add continents with simple shapes
    ctx.fillStyle = '#166534' // Dark green
    // North America
    ctx.beginPath()
    ctx.arc(100, 80, 30, 0, Math.PI * 2)
    ctx.fill()
    
    // Europe/Africa
    ctx.beginPath()
    ctx.arc(200, 120, 35, 0, Math.PI * 2)
    ctx.fill()
    
    // Asia
    ctx.beginPath()
    ctx.arc(300, 70, 40, 0, Math.PI * 2)
    ctx.fill()
    
    // Australia
    ctx.beginPath()
    ctx.arc(350, 180, 15, 0, Math.PI * 2)
    ctx.fill()
    
    // South America
    ctx.beginPath()
    ctx.arc(150, 200, 25, 0, Math.PI * 2)
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    material.map = texture

    return material
  }, [])

  const cloudMaterial = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!
    
    // Semi-transparent white clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    
    // Add cloud patterns
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 256
      const size = Math.random() * 40 + 20
      
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    
    return new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      opacity: 0.4,
    })
  }, [])

  useFrame((state, delta) => {
    if (earthRef.current) {
      // Realistic Earth rotation (24-hour cycle)
      earthRef.current.rotation.y += delta * 0.1
    }
    if (cloudRef.current) {
      // Clouds rotate slightly faster than Earth
      cloudRef.current.rotation.y += delta * 0.12
    }
  })

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={earthRef} position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[2, 64, 32]} />
        <primitive object={earthMaterial} />
      </mesh>
      
      {/* Cloud layer */}
      <mesh ref={cloudRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.01, 64, 32]} />
        <primitive object={cloudMaterial} />
      </mesh>
      
      {/* Atmospheric glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.05, 32, 16]} />
        <meshBasicMaterial 
          color="#4a90e2" 
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
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
        shadows
      >
        {/* Sun light */}
        <directionalLight
          position={[10, 5, 5]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        
        {/* Ambient light for overall illumination */}
        <ambientLight intensity={0.3} />
        
        {/* Fill light from the dark side */}
        <pointLight position={[-5, -2, -3]} intensity={0.5} color="#4a90e2" />
        
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
