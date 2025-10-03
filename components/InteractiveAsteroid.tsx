'use client'

import { Suspense, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function AsteroidModel() {
  const { scene } = useGLTF('/Asteroid_2a.glb')
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation animation
      meshRef.current.rotation.y += delta * 0.2
      
      // Subtle hover effect
      if (hovered) {
        meshRef.current.scale.setScalar(1.1)
      } else {
        meshRef.current.scale.setScalar(1.0)
      }
    }
  })

  // Clone the scene and enhance material quality
  const clonedScene = scene.clone()
  
  // Traverse the scene to enhance material quality
  clonedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Increase geometry detail
      if (child.geometry) {
        child.geometry.computeBoundingSphere()
        child.geometry.computeBoundingBox()
      }
      
      // Enhance material quality
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => enhanceMaterial(mat))
        } else {
          enhanceMaterial(child.material)
        }
      }
    }
  })

  return (
    <group
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={clonedScene} />
    </group>
  )
}

function enhanceMaterial(material: THREE.Material) {
  if (material instanceof THREE.MeshStandardMaterial) {
    // Enhance texture quality settings
    if (material.map) {
      material.map.anisotropy = 16 // Maximum anisotropy for better texture quality
      material.map.wrapS = THREE.RepeatWrapping
      material.map.wrapT = THREE.RepeatWrapping
      material.map.generateMipmaps = true
      material.map.minFilter = THREE.LinearMipmapLinearFilter
      material.map.magFilter = THREE.LinearFilter
    }
    
    if (material.normalMap) {
      material.normalMap.anisotropy = 16
      material.normalMap.wrapS = THREE.RepeatWrapping
      material.normalMap.wrapT = THREE.RepeatWrapping
      material.normalMap.generateMipmaps = true
      material.normalMap.minFilter = THREE.LinearMipmapLinearFilter
      material.normalMap.magFilter = THREE.LinearFilter
      material.normalScale.set(1, 1) // Use normal scale of 1 for full detail
    }
    
    if (material.roughnessMap) {
      material.roughnessMap.anisotropy = 16
      material.roughnessMap.wrapS = THREE.RepeatWrapping
      material.roughnessMap.wrapT = THREE.RepeatWrapping
      material.roughnessMap.generateMipmaps = true
      material.roughnessMap.minFilter = THREE.LinearMipmapLinearFilter
      material.roughnessMap.magFilter = THREE.LinearFilter
    }
    
    if (material.metalnessMap) {
      material.metalnessMap.anisotropy = 16
      material.metalnessMap.wrapS = THREE.RepeatWrapping
      material.metalnessMap.wrapT = THREE.RepeatWrapping
      material.metalnessMap.generateMipmaps = true
      material.metalnessMap.minFilter = THREE.LinearMipmapLinearFilter
      material.metalnessMap.magFilter = THREE.LinearFilter
    }
    
    if (material.aoMap) {
      material.aoMap.anisotropy = 16
      material.aoMap.wrapS = THREE.RepeatWrapping
      material.aoMap.wrapT = THREE.RepeatWrapping
      material.aoMap.generateMipmaps = true
      material.aoMap.minFilter = THREE.LinearMipmapLinearFilter
      material.aoMap.magFilter = THREE.LinearFilter
    }
    
    // Material properties
    material.roughness = Math.max(0.1, material.roughness || 0.5)
    material.metalness = Math.max(0, material.metalness || 0.1)
    
    // Enable high-quality rendering features
    material.envMapIntensity = 1.0
    material.transparent = false
    material.alphaTest = 0
    
    // Force material update
    material.needsUpdate = true
  }
}

function Scene() {
  return (
    <>
      {/* Enhanced lighting setup for better quality */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.2}
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.8} />
      <pointLight position={[0, 10, 0]} intensity={0.6} />
      <hemisphereLight 
        skyColor="#87CEEB" 
        groundColor="#8B4513" 
        intensity={0.3} 
      />
      
      {/* Asteroid model */}
      <Suspense fallback={null}>
        <AsteroidModel />
      </Suspense>
    </>
  )
}

interface InteractiveAsteroidProps {
  className?: string
}

export function InteractiveAsteroid({ className = "" }: InteractiveAsteroidProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="rounded-xl"
        style={{ background: 'transparent' }}
        dpr={[1, 2]} // High pixel density
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          precision: "highp",
          preserveDrawingBuffer: true,
          logarithmicDepthBuffer: true
        }}
        shadows={true}
      >
        <Scene />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={10}
          minDistance={3}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}

// Preload the model
useGLTF.preload('/Asteroid_2a.glb')
