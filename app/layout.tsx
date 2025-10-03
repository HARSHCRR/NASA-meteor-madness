import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Risk-Based AstroNFT Simulator',
  description: 'Explore asteroid trajectories, simulate Earth impacts, and mint NFTs based on real NASA and USGS data. Defend Earth in an interactive, scientifically accurate environment.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans text-white bg-space-black overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
