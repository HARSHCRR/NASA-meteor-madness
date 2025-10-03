'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Bootcamps() {
  const bootcampContentRef = useRef<HTMLDivElement>(null)

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

    if (bootcampContentRef.current) {
      observer.observe(bootcampContentRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="section bg-cosmic-dark">
      <div className="container">
        <div 
          ref={bootcampContentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div>
            <h2 className="text-4xl font-bold mb-6">Interactive Asteroid Defense</h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Test mitigation strategies, explore different impact scenarios, and defend Earth in a dynamic, 
              gamified environment. From basic trajectory modeling to advanced risk assessment.
            </p>
            <Link href="/simulator/tutorial" className="btn-primary">
              Start Tutorial
            </Link>
          </div>
          
          <div className="flex justify-center">
            <Image 
              src="/bootcamp-placeholder.svg" 
              alt="Asteroid Defense Simulator" 
              width={600}
              height={400}
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
