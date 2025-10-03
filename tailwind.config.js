/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'space-black': '#000000',
        'cosmic-dark': '#111111',
        'asteroid-gray': '#1a1a1a',
        'orbit-border': '#333333',
        'star-white': '#ffffff',
        'nebula-blue': '#4a90e2',
        'impact-orange': '#ff6b35',
        'danger-red': '#e74c3c',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'pulse': 'pulse 2s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        fadeInUp: {
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        pulse: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
        ripple: {
          'to': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
}
