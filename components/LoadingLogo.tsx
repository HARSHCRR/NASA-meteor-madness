'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function LoadingLogo() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`loading-logo ${!isVisible ? 'fade-out' : ''}`}>
      <Image 
        src="/logo.png" 
        alt="AstroNFT Simulator Loading" 
        width={360}
        height={360}
        priority
      />
    </div>
  )
}
