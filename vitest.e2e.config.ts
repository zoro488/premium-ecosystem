import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

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
    // E2E CONFIGURATION
    // ========================================
    testTimeout: 60000, // 60 seconds for E2E tests
    hookTimeout: 60000,

    // ========================================
    // REPORTERS
    // ========================================
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './test-results/e2e/index.html',
    },

    // ========================================
    // FILE PATTERNS - Only E2E tests
    // ========================================
    include: ['src/__tests__/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.vite', '.firebase', 'playwright-report'],

    // ========================================
    // MOCKING - Reduced for E2E (more integration-like)
    // ========================================
    mockReset: false,
    restoreMocks: false,
    clearMocks: false,

    // ========================================
    // PERFORMANCE
    // ========================================
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true, // E2E tests run sequentially
        isolate: true,
      },
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
