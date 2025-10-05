'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function ValueProps() {
  const propItemsRef = useRef<(HTMLDivElement | null)[]>([])

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

    propItemsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const valueProps = [
    {
      letter: '—— A',
      title: 'Real-Time Scientific Data',
      description: 'Powered by live NASA Near-Earth Object database and USGS geological modeling for accurate simulations.',
      link: '/data-sources',
      linkText: 'Explore Data Sources'
    },
    {
      letter: '—— B',
      title: 'Gamified Learning Experience',
      description: 'Make complex asteroid impact science accessible through interactive simulations and engaging visualizations.',
      link: '/simulator',
      linkText: 'Launch Simulator'
    },
    {
      letter: '—— C',
      title: 'Unique NFT Integration',
      description: 'Mint NFTs representing simulated asteroids with rarity and value tied to calculated risk factors and scientific accuracy.',
      link: '/nft-gallery',
      linkText: 'Explore NFTs'
    },
    {
      letter: '—— D',
      title: 'Educational Storytelling',
      description: 'Combine scientific accuracy with educational storytelling to make asteroid impact science understandable and engaging for all audiences.',
      link: '/education',
      linkText: 'Learn More'
    }
  ]

  return (
    <section className="section bg-space-black">
      <div className="container">
        <h2 className="section-title">What Makes AstroNFT Simulator Unique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              ref={(el) => { propItemsRef.current[index] = el }}
              className="bg-asteroid-gray p-10 rounded-xl border border-orbit-border transition-all duration-300 hover:-translate-y-2 hover:border-nebula-blue hover:shadow-lg hover:shadow-nebula-blue/15"
            >
              <h3 className="text-2xl text-gray-400 mb-2">{prop.letter}</h3>
              <h4 className="text-xl mb-4 font-bold">{prop.title}</h4>
              <p className="mb-6 opacity-90 leading-relaxed">{prop.description}</p>
              <Link 
                href={prop.link}
                className="text-nebula-blue no-underline font-semibold border-b border-transparent hover:border-nebula-blue transition-colors"
              >
                {prop.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
