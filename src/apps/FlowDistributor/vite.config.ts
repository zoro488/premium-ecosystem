import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Babel plugins para optimización
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
        ],
      },
    }),
  ],

  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },

  // Optimización de construcción
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          'vendor-framer': ['framer-motion'],
          'vendor-charts': ['recharts'],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },

  // Optimización del servidor de desarrollo
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  // Optimización de dependencias
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/firestore',
      'firebase/auth',
      'framer-motion',
    ],
    exclude: ['@vite/client', '@vite/env'],
  },

  // CSS
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Preview
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: true,
  },
});
