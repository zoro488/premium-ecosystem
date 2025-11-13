import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    // ========================================
    // ENVIRONMENT
    // ========================================
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],

    // ========================================
    // E2E SPECIFIC CONFIGURATION
    // ========================================
    include: ['**/__tests__/e2e/**/*.test.{js,jsx,ts,tsx}'],
    testTimeout: 90000, // 90 segundos para tests E2E
    hookTimeout: 90000, // 90 segundos para hooks

    // ========================================
    // COVERAGE
    // ========================================
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage-e2e',
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/dist/',
      ],
    },

    // ========================================
    // REPORTERS
    // ========================================
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './test-results-e2e/index.html',
    },

    // ========================================
    // PERFORMANCE
    // ========================================
    pool: 'forks', // Usar forks para tests E2E que pueden ser intensivos
    poolOptions: {
      forks: {
        singleFork: true, // Un solo fork para tests E2E secuenciales
      },
    },

    // ========================================
    // MOCKING
    // ========================================
    mockReset: false, // No resetear mocks para tests E2E
    restoreMocks: false,
    clearMocks: false,

    // ========================================
    // UI & WATCH
    // ========================================
    ui: false,
    open: false,
    watch: false,

    // ========================================
    // SEQUENCE
    // ========================================
    sequence: {
      shuffle: false, // No mezclar tests E2E
    },
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
