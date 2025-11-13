import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

/**
 * ============================================
 * VITEST E2E CONFIGURATION
 * ============================================
 * Configuración específica para tests E2E que validan:
 * - Excel → Firestore → UI
 * - Flujo completo de datos
 * - Integración entre servicios
 */
export default defineConfig({
  plugins: [react()],
  test: {
    // ========================================
    // ENVIRONMENT
    // ========================================
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],

    // ========================================
    // E2E SPECIFIC SETTINGS
    // ========================================
    testTimeout: 60000, // 60 segundos para operaciones lentas
    hookTimeout: 60000,

    // ========================================
    // REPORTERS
    // ========================================
    reporters: ['verbose'],

    // ========================================
    // FILE PATTERNS - Solo tests E2E
    // ========================================
    include: ['src/__tests__/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.vite',
      '.firebase',
      'playwright-report',
      'src/test/**',
      'src/apps/**/*.test.{js,jsx}',
      'src/components/**/*.test.{js,jsx}',
      'src/utils/**/*.test.{js,jsx}',
    ],

    // ========================================
    // COVERAGE
    // ========================================
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/e2e',
      include: ['src/services/**', 'src/components/**'],
      exclude: [
        'node_modules/',
        'src/tests/',
        'src/__tests__/',
        '**/*.config.js',
        '**/*.test.{js,jsx}',
      ],
    },

    // ========================================
    // MOCKING
    // ========================================
    mockReset: false, // No resetear mocks entre tests E2E
    restoreMocks: false,
    clearMocks: false,

    // ========================================
    // PERFORMANCE
    // ========================================
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // E2E tests corren en secuencia
        isolate: false, // Compartir contexto para performance
      },
    },

    // ========================================
    // UI & WATCH
    // ========================================
    ui: false,
    open: false,
    watch: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@apps': path.resolve(__dirname, './src/apps'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@config': path.resolve(__dirname, './src/config'),
      '@services': path.resolve(__dirname, './src/services'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
