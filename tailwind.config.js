/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Purge optimization for production
  safelist: [
    'animate-float',
    'animate-pulse-slow',
    'animate-shimmer',
    'animate-glow',
    {
      pattern: /bg-(flow|shadow|apollo|synapse|nexus)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(flow|shadow|apollo|synapse|nexus)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // Deep Ocean Theme - FlowDistributor Premium
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Fondos Deep Ocean
        'bg-primary': '#09111A',
        'bg-secondary': '#0D1821',
        'bg-card': '#0F1729',
        'bg-glass': 'rgba(15, 23, 41, 0.6)',
        
        // Acentos
        'accent-blue': '#1890FF',
        'accent-cyan': '#22D3EE',
        'accent-purple': '#7C3AED',
        'accent-green': '#10B981',
        'accent-orange': '#F59E0B',
        'accent-pink': '#EC4899',
        
        // Texto
        'text-primary': '#F8FAFC',
        'text-secondary': '#E2E8F0',
        'text-muted': '#94A3B8',
        'text-accent': '#64748B',
        
        // Bordes y glassmorphism
        'border-glass': 'rgba(148, 163, 184, 0.1)',
        'border-accent': 'rgba(24, 144, 255, 0.3)',
        
        // FlowDistributor - Azul/Cyan
        flow: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // ShadowPrime - Púrpura/Violeta
        shadow: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Apollo - Verde/Esmeralda
        apollo: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Synapse - Naranja/Ámbar
        synapse: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Nexus - Rojo/Rosa
        nexus: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9f1239',
          900: '#831843',
        },
      },
      // Animaciones Deep Ocean
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(24, 144, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(24, 144, 255, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      // Fondos gradientes
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #0D1821 0%, #1E3A8A 50%, #1E40AF 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(15, 23, 41, 0.6) 0%, rgba(30, 58, 138, 0.1) 100%)',
        'gradient-button': 'linear-gradient(135deg, #1890FF 0%, #22D3EE 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(15, 23, 41, 0.8) 0%, rgba(30, 58, 138, 0.2) 100%)',
      },
      // Sombras premium
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-blue': '0 0 20px rgba(24, 144, 255, 0.3)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.3)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
      },
    },
  },
  plugins: [],
  // Production optimizations
  corePlugins: {
    preflight: true,
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
}
