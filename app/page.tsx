import LoadingLogo from '@/components/LoadingLogo'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Announcement from '@/components/Announcement'
import Platforms from '@/components/Platforms'
import Awards from '@/components/Awards'
import Bootcamps from '@/components/Bootcamps'
import ValueProps from '@/components/ValueProps'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Rocket, Shield, Image, Zap } from 'lucide-react'
import { AnimatedSection, AnimatedCard, AnimatedButton } from '@/components/AnimatedSection'

export default function Home() {
  return (
    <>
      <LoadingLogo />
      <Navbar />
      <Hero />
      
      {/* New Simulator Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <AnimatedSection>
              <h2 className="text-4xl font-bold text-white mb-4">
                Risk-Based AstroNFT Simulator
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Explore real asteroid trajectories, simulate Earth impacts, and mint NFTs based on scientifically accurate NASA and USGS data. Defend Earth in an interactive, gamified environment.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <AnimatedCard delay={0.2} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Rocket className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Real Asteroid Data</h3>
              <p className="text-gray-400 text-sm">NASA NEO API integration with live asteroid tracking</p>
            </AnimatedCard>

            <AnimatedCard delay={0.3} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Impact Simulation</h3>
              <p className="text-gray-400 text-sm">Scientifically accurate impact energy and crater modeling</p>
            </AnimatedCard>

            <AnimatedCard delay={0.4} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Defense Strategies</h3>
              <p className="text-gray-400 text-sm">Test kinetic impactors, gravity tractors, and nuclear devices</p>
            </AnimatedCard>

            <AnimatedCard delay={0.5} className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Image className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Risk-Based NFTs</h3>
              <p className="text-gray-400 text-sm">Mint collectible NFTs with rarity tied to calculated risk factors</p>
            </AnimatedCard>
          </div>

          <div className="text-center">
            <AnimatedButton 
              href="/simulator"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 text-lg"
            >
              <Rocket className="h-6 w-6" />
              <span>Launch Simulator</span>
            </AnimatedButton>
          </div>
        </div>
      </section>

      <Announcement />
      <Platforms />
      <Awards />
      <Bootcamps />
      <ValueProps />
      <CTA />
      <Footer />
    </>
  )
}
