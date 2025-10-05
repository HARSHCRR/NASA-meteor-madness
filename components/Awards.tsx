'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Awards() {
  const awardItemsRef = useRef<(HTMLDivElement | null)[]>([])

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

    awardItemsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const awards = [
    {
      title: 'NASA Near-Earth Object Program Partnership',
      description: 'Real-time asteroid trajectory data from NASA\'s Center for Near-Earth Object Studies (CNEOS) for accurate impact simulations',
      link: 'https://cneos.jpl.nasa.gov/',
      linkText: '↳ Explore NASA Data'
    },
    {
      title: 'USGS Geological Modeling Integration',
      description: 'Advanced geological and seismic modeling data from the United States Geological Survey for realistic impact zone visualization',
      link: 'https://www.usgs.gov/',
      linkText: '↳ View USGS Resources'
    },
    {
      title: 'Scientifically Accurate Risk Assessment',
      description: '"Combining real astronomical data with advanced simulation algorithms to create the most accurate asteroid impact modeling platform available to the public."',
      attribution: '— International Astronomical Union Standards',
      link: '/scientific-accuracy',
      linkText: '↳ Learn About Our Methods'
    }
  ]

  return (
    <section className="section bg-space-black">
      <div className="container">
        <h2 className="section-title">Scientific Partnerships & Data Sources</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {awards.map((award, index) => (
            <div
              key={index}
              ref={(el) => { awardItemsRef.current[index] = el }}
              className="bg-asteroid-gray p-8 rounded-xl border border-orbit-border"
            >
              <h3 className="text-xl mb-4 font-bold">{award.title}</h3>
              <p className="mb-4 opacity-80 leading-relaxed">{award.description}</p>
              {award.attribution && (
                <p className="mb-4 text-sm opacity-70">{award.attribution}</p>
              )}
              <Link 
                href={award.link}
                className="text-nebula-blue no-underline font-semibold hover:underline"
                target={award.link.startsWith('http') ? '_blank' : undefined}
                rel={award.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {award.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
