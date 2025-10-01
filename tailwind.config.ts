import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',     // Dark background
        primary: '#E50914',        // Netflix Red
        secondary: '#1DB954',      // Spotify Green
        accent: '#FFD700',         // Gold
        text: '#FFFFFF',
        muted: '#B3B3B3'
      },
      boxShadow: {
        glow: '0 0 20px rgba(229, 9, 20, 0.6)',
        glowGreen: '0 0 20px rgba(29, 185, 84, 0.6)',
        glowGold: '0 0 20px rgba(255, 215, 0, 0.6)',
        neon: '0 0 10px rgba(229, 9, 20, 0.7), 0 0 20px rgba(229, 9, 20, 0.5)'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px'
      },
      backgroundImage: {
        glass: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))'
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px #E50914' },
          '100%': { boxShadow: '0 0 20px #FFD700' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite alternate',
        float: 'float 6s ease-in-out infinite',
        gradient: 'gradient 3s ease infinite'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar')
  ]
}

export default config


