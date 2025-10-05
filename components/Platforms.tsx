'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Platforms() {
  const platformItemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )

    platformItemsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const platforms = [
    {
      title: '↳ Trajectory Modeling',
      description: 'Simulate real asteroid paths using NASA Near-Earth Object database',
      link: '/simulator/trajectory/',
      linkText: 'Launch Modeling'
    },
    {
      title: '↳ Risk Calculation',
      description: 'Calculate impact probabilities based on size, velocity, and environmental factors',
      link: '/simulator/risk/',
      linkText: 'Analyze Risk'
    },
    {
      title: '↳ Impact Visualization',
      description: 'Visualize seismic effects, tsunami zones, and environmental consequences',
      link: '/simulator/impact/',
      linkText: 'View Impact Zones'
    },
    {
      title: '↳ NFT Minting',
      description: 'Mint unique NFTs representing asteroids with rarity tied to risk factors',
      link: '/nft-gallery/',
      linkText: 'Mint NFT'
    }
  ]

  return (
    <section className="section bg-cosmic-dark">
      <div className="container">
        <h2 className="section-title">Core Features</h2>
        <p className="section-subtitle">Advanced asteroid simulation powered by real NASA and USGS datasets</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {platforms.map((platform, index) => (
            <div
              key={index}
              ref={(el) => { platformItemsRef.current[index] = el }}
              className="bg-asteroid-gray p-8 rounded-xl border border-orbit-border transition-all duration-300 hover:-translate-y-2 hover:border-nebula-blue hover:shadow-lg hover:shadow-nebula-blue/20"
            >
              <h3 className="text-2xl mb-4 text-nebula-blue">{platform.title}</h3>
              <p className="mb-6 opacity-90">{platform.description}</p>
              <Link 
                href={platform.link}
                className="text-nebula-blue no-underline font-semibold border-b border-transparent hover:border-nebula-blue transition-colors"
              >
                {platform.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
