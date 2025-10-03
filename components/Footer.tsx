import Link from 'next/link'

export default function Footer() {
  const footerSections = [
    {
      title: 'Simulator Features',
      links: [
        { text: 'Trajectory Modeling', href: '/simulator/trajectory/' },
        { text: 'Risk Analysis', href: '/simulator/risk/' },
        { text: 'Impact Visualization', href: '/simulator/impact/' },
        { text: 'Defense Strategies', href: '/simulator/mitigation/' },
        { text: 'Interactive Tutorial', href: '/simulator/tutorial/' }
      ]
    },
    {
      title: 'Data Sources',
      links: [
        { text: 'NASA CNEOS', href: 'https://cneos.jpl.nasa.gov/', external: true },
        { text: 'USGS Geological', href: 'https://www.usgs.gov/', external: true },
        { text: 'NASA Near-Earth Objects', href: '/data-sources/nasa/' },
        { text: 'USGS Seismic Data', href: '/data-sources/usgs/' }
      ]
    },
    {
      title: 'NFT & Community',
      links: [
        { text: 'NFT Gallery', href: '/nft-gallery/' },
        { text: 'Mint NFTs', href: '/nft-gallery/mint/' },
        { text: 'Community', href: '/community/' },
        { text: 'Educational Resources', href: '/education/' }
      ]
    },
    {
      title: 'Legal & Support',
      links: [
        { text: 'Privacy Policy', href: '/privacy/' },
        { text: 'Terms of Service', href: '/terms/' },
        { text: 'Help Center', href: '/support/' },
        { text: 'Contact Us', href: '/contact/' }
      ]
    }
  ]

  return (
    <footer className="bg-space-black py-12 border-t border-orbit-border">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href}
                      className="text-gray-300 no-underline hover:text-nebula-blue transition-colors"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-orbit-border text-center text-gray-400 text-sm">
          <p>&copy; 2025 AstroNFT Simulator. Built with NASA and USGS data. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
