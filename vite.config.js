import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// import { VitePWA } from 'vite-plugin-pwa'; // TODO: Re-enable after package installation issue is resolved

export default defineConfig({
  plugins: [
    react({
      // Optimización de Fast Refresh
      fastRefresh: true,
      // Optimización de babel
      babel: {
        compact: false,
      },
    }),
    // TODO: PWA Configuration - Will be added in Phase 3 after resolving vite-plugin-pwa installation
  ],
  server: {
    port: 3001,
    host: true,
    open: false,
    strictPort: false,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production', // Solo dev/staging
    minify: 'esbuild', // Using esbuild (faster, built-in with Vite)
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
      legalComments: 'none',
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // State management & forms
          'state-vendor': ['zustand', '@tanstack/react-query', 'react-hook-form', 'zod'],
          // Animation libraries
          'animation-vendor': ['framer-motion'],
          // 3D libraries (heavy, separate chunk)
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Charts
          'charts-vendor': ['recharts'],
          // Icons (tree-shakeable)
          'icons-vendor': ['lucide-react'],
          // UI utilities
          'ui-vendor': ['class-variance-authority', 'clsx', 'tailwind-merge'],
          // Firebase
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
        },
        // Optimizar nombres de archivos
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 800, // Advertir si chunk > 800KB
    target: 'es2020',
    cssCodeSplit: true, // Split CSS por chunks
    assetsInlineLimit: 4096, // Inline assets < 4KB
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'recharts',
      'zustand',
      'axios',
    ],
    exclude: ['@react-three/fiber', '@react-three/drei'], // No pre-bundle (pesados)
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@apps': '/src/apps',
      '@hooks': '/src/hooks',
      '@stores': '/src/stores',
      '@utils': '/src/utils',
      '@services': '/src/services',
      '@config': '/src/config',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/mock*.js',
        '**/*.test.{js,jsx}',
        '**/*.spec.{js,jsx}',
        '**/dist/**',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
