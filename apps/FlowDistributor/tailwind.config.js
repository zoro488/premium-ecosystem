/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Chronos Core Palette - Dark Mirror Espacial
        chronos: {
          void: '#000000',
          obsidian: '#0a0a0a',
          charcoal: '#141414',
          graphite: '#1a1a1a',
          slate: '#242424',
          ash: '#2a2a2a',
          smoke: '#404040',
          fog: '#505050',
          silver: '#808080',
          platinum: '#a0a0a0',
          chrome: '#c0c0c0',
          pearl: '#e0e0e0',
          snow: '#f5f5f5',
          white: '#ffffff',
        },
        // Metal Finish - iPhone Pro Inspired
        metal: {
          titanium: '#c4c4c4',
          steel: '#a8a8a8',
          gunmetal: '#8c8c8c',
          onyx: '#707070',
          shadow: '#545454',
        },
        // Neon Accents
        neon: {
          cyan: '#00d9ff',
          blue: '#0084ff',
          purple: '#6366f1',
          pink: '#ec4899',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
        },
        // Bucket System Colors
        bucket: {
          fl: {
            DEFAULT: '#00d9ff',
            light: '#33e0ff',
            dark: '#0099b8',
            glow: 'rgba(0, 217, 255, 0.3)',
          },
          bm: {
            DEFAULT: '#6366f1',
            light: '#818cf8',
            dark: '#4338ca',
            glow: 'rgba(99, 102, 241, 0.3)',
          },
          ut: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
            glow: 'rgba(16, 185, 129, 0.3)',
          },
        },
        // Bank Colors
        bank: {
          azteca: '#00d9ff',
          leftie: '#ec4899',
          profit: '#f59e0b',
          boveda: '#6366f1',
        },
        // Status Colors
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#0084ff',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-cyan': '0 0 20px rgba(0, 217, 255, 0.5)',
        'neon-blue': '0 0 20px rgba(0, 132, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(99, 102, 241, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        metal: '0 4px 16px rgba(192, 192, 192, 0.1)',
        deep: '0 20px 60px rgba(0, 0, 0, 0.6)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.5)',
        'elevation-2': '0 4px 8px rgba(0, 0, 0, 0.5)',
        'elevation-3': '0 8px 16px rgba(0, 0, 0, 0.5)',
        'elevation-4': '0 16px 32px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
            opacity: '1',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)',
            opacity: '0.8',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities, addComponents }) {
      addUtilities({
        '.glass': {
          background: 'rgba(20, 20, 20, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-metal': {
          background:
            'linear-gradient(135deg, rgba(196, 196, 196, 0.1) 0%, rgba(112, 112, 112, 0.05) 100%)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(192, 192, 192, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      });

      addComponents({
        '.btn-primary': {
          '@apply px-6 py-3 rounded-xl glass-metal text-chronos-white font-medium': {},
          '@apply hover:scale-105 active:scale-95 transition-all duration-200': {},
          '@apply shadow-metal hover:shadow-neon-cyan': {},
        },
        '.input-glass': {
          '@apply w-full px-4 py-3 rounded-xl glass text-chronos-white': {},
          '@apply border border-chronos-smoke focus:border-neon-cyan': {},
          '@apply focus:ring-2 focus:ring-neon-cyan/30 focus:outline-none': {},
          '@apply placeholder:text-chronos-silver transition-all duration-200': {},
        },
        '.card-glass': {
          '@apply glass rounded-2xl p-6 shadow-elevation-2': {},
          '@apply hover:shadow-elevation-3 transition-shadow duration-300': {},
        },
      });
    },
  ],
};
