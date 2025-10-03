# NASA Meteor Madness - Next.js Version

A modern, interactive web platform built with Next.js that allows users to explore and simulate real asteroid trajectories using NASA and USGS datasets. Users can model potential Earth impacts, calculate risk factors, and mint NFTs representing simulated asteroids with rarity tied to scientific accuracy.

## 🚀 Features

- **Real-Time NASA Data**: Live asteroid trajectory data from NASA's Center for Near-Earth Object Studies (CNEOS)
- **Interactive Simulations**: Model asteroid impacts with scientific accuracy
- **Risk Assessment**: Calculate risk factors based on asteroid size, velocity, and environmental consequences
- **Impact Visualization**: Visualize impact zones including seismic and tsunami effects
- **NFT Integration**: Mint unique NFTs representing asteroids with rarity tied to risk factors
- **Educational Storytelling**: Make complex asteroid impact science accessible and engaging
- **Defense Strategies**: Test mitigation strategies and "defend Earth" in a gamified environment

## 🛠️ Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern React patterns for state management
- **Intersection Observer**: Performance-optimized animations
- **Next.js Image**: Optimized image loading

## 📁 Project Structure

```
nasa-meteor-madness/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind
├── components/
│   ├── LoadingLogo.tsx    # Loading screen component
│   ├── Navbar.tsx         # Navigation component
│   ├── Hero.tsx           # Hero section component
│   ├── Announcement.tsx   # Announcement bar component
│   ├── Platforms.tsx      # Core features section
│   ├── Awards.tsx         # Scientific partnerships section
│   ├── Bootcamps.tsx      # Interactive tutorial section
│   ├── ValueProps.tsx     # Value propositions section
│   ├── CTA.tsx            # Call-to-action section
│   └── Footer.tsx         # Footer component
├── lib/
│   └── hooks.ts           # Custom React hooks
├── public/
│   ├── logo.png           # Main logo
│   ├── aip-hero-image.svg # Hero image
│   └── bootcamp-placeholder.svg # Tutorial placeholder
├── package.json           # Dependencies and scripts
├── next.config.js        # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── postcss.config.js     # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Design System

### Color Palette
- **Space Black**: `#000000`
- **Cosmic Dark**: `#111111` 
- **Asteroid Gray**: `#1a1a1a`
- **Orbit Border**: `#333333`
- **Star White**: `#ffffff`
- **Nebula Blue**: `#4a90e2`
- **Impact Orange**: `#ff6b35`
- **Danger Red**: `#e74c3c`

### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, etc.)
- **Responsive**: Fluid typography with clamp() for optimal scaling

### Components
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Interactive Elements**: Hover effects, animations, and transitions
- **Accessibility**: Semantic HTML and ARIA attributes
- **Performance**: Optimized images and lazy loading

## 🔧 Customization

### Adding New Components

1. Create a new component in the `components/` directory
2. Import and use it in `app/page.tsx` or other pages
3. Follow the existing patterns for styling and functionality

### Modifying Styles

- **Global styles**: Edit `app/globals.css`
- **Component styles**: Use Tailwind classes or add custom CSS
- **Theme colors**: Update `tailwind.config.js`

### Adding New Pages

1. Create a new file in the `app/` directory (e.g., `app/simulator/page.tsx`)
2. Use Next.js App Router conventions
3. Add navigation links in the `Navbar` component

## 📱 Responsive Design

- **Mobile**: Optimized touch interactions and simplified layouts
- **Tablet**: Balanced design with touch-friendly elements
- **Desktop**: Full-featured experience with hover effects

## ⚡ Performance Features

- **Next.js Image Optimization**: Automatic image optimization and lazy loading
- **Code Splitting**: Automatic code splitting for optimal bundle sizes
- **Static Generation**: Pre-rendered pages for faster loading
- **Intersection Observer**: Efficient scroll-based animations
- **Throttled Events**: Performance-optimized scroll handlers

## 🔍 SEO & Metadata

- **Next.js Metadata API**: Dynamic meta tags and Open Graph data
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Accessibility**: WCAG compliant components and interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **AWS Amplify**: Full-stack deployment support
- **Docker**: Containerized deployment option

## 🔮 Future Enhancements

- [ ] Real-time NASA API integration
- [ ] 3D asteroid visualization with Three.js
- [ ] Web3 wallet integration for NFT minting
- [ ] Real-time multiplayer defense scenarios
- [ ] Advanced data visualization with D3.js
- [ ] PWA capabilities for mobile app experience
- [ ] Internationalization (i18n) support
- [ ] Advanced analytics and user tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and educational. NASA and USGS data usage follows their respective terms of service.

## 🔗 Links

- [NASA Near-Earth Object Program](https://cneos.jpl.nasa.gov/)
- [USGS Geological Survey](https://www.usgs.gov/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ for science education and planetary defense awareness using modern web technologies.**
