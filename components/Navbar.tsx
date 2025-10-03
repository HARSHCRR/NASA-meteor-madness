'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      setIsScrolled(currentScrollY > 100)
      
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 py-4 transition-all duration-300 ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.98)' : 'rgba(0, 0, 0, 0.95)',
        backdropFilter: isScrolled ? 'blur(15px)' : 'blur(10px)',
      }}
    >
      <div className="container flex justify-between items-center">
        <div className="flex items-center font-bold text-xl">
          <Image 
            src="/logo.png" 
            alt="AstroNFT Simulator Logo" 
            width={96}
            height={96}
            className="mr-3 filter brightness-0 invert"
          />
          <span>AstroNFT</span>
        </div>
        
        <ul className="hidden md:flex list-none gap-8">
          <li><Link href="/simulator" className="text-white no-underline font-medium hover:opacity-70 transition-opacity">Simulator</Link></li>
          <li><Link href="/risk-analysis" className="text-white no-underline font-medium hover:opacity-70 transition-opacity">Risk Analysis</Link></li>
          <li><Link href="/nft-gallery" className="text-white no-underline font-medium hover:opacity-70 transition-opacity">NFT Gallery</Link></li>
          <li><Link href="/data-sources" className="text-white no-underline font-medium hover:opacity-70 transition-opacity">Data Sources</Link></li>
          <li><Link href="/about" className="text-white no-underline font-medium hover:opacity-70 transition-opacity">About</Link></li>
        </ul>
        
        <div>
          <Link href="/simulator" className="btn-primary">
            Launch Simulator
          </Link>
        </div>
      </div>
    </nav>
  )
}
