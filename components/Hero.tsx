'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { InteractiveAsteroid } from './InteractiveAsteroid'
import Particles from './Particles'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.pageYOffset)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="min-h-screen flex items-center pt-24 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Particle Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Particles
          particleColors={['#ffffff', '#87CEEB', '#4a90e2']}
          particleCount={150}
          particleSpread={8}
          speed={0.08}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
        {/* Black overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Defend Earth from Asteroids
          </h1>
          <p className="text-xl leading-relaxed mb-8 opacity-90 max-w-lg">
            Explore real asteroid trajectories using NASA and USGS data. Simulate impact scenarios, 
            calculate risk factors, and mint unique NFTs based on scientific accuracy.
          </p>
          <Link href="/simulator" className="btn-hero">
            Launch Simulator
          </Link>
        </div>
        
        <div className="flex justify-center items-center">
          <div 
            className="relative w-full max-w-2xl h-[400px]"
            style={{
              transform: `translateY(${scrollY * -0.3}px)`,
            }}
          >
            <InteractiveAsteroid className="w-full h-full shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
