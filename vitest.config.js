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
    // COVERAGE
    // ========================================
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.config.js',
        '**/*.config.ts',
        '**/dist/',
        '**/*.d.ts',
        '**/types/',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },

    // ========================================
    // REPORTERS
    // ========================================
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './test-results/index.html',
    },

    // ========================================
    // PERFORMANCE
    // ========================================
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        useAtomics: true,
      },
    },

    // ========================================
    // FILE PATTERNS
    // ========================================
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.vite', '.firebase', 'e2e', 'playwright-report'],

    // ========================================
    // MOCKING
    // ========================================
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,

    // ========================================
    // UI & WATCH
    // ========================================
    ui: true,
    open: false,
    watch: false,

    // ========================================
    // BROWSER MODE (EXPERIMENTAL)
    // ========================================
    browser: {
      enabled: false,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
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
