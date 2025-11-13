/**
 * VITEST CONFIGURATION
 * Unit and integration testing setup
 */
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vitest/config';





export default defineConfig({
  plugins: [react()],

  test: {
    // Environment
    environment: 'jsdom',

    // Global setup
    globals: true,

    // Setup files
    setupFiles: ['./src/apps/FlowDistributor/chronos-system/__tests__/setup.ts'],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.{js,ts}',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/test/**',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
        '**/types/**',
        '**/schemas/**',
      ],
      include: ['src/apps/FlowDistributor/chronos-system/**/*.{js,jsx,ts,tsx}'],
      all: true,
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    // Test match patterns
    include: ['src/apps/FlowDistributor/chronos-system/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.e2e.{test,spec}.{js,ts}',
      '**/e2e/**',
      'e2e/**',
    ],

    // Mock resets
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,

    // Test timeout
    testTimeout: 10000,

    // Concurrent tests
    sequence: {
      concurrent: true,
    },

    // Reporter
    reporter: ['verbose', 'html'],
  },

  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@chronos': path.resolve(__dirname, './src/apps/FlowDistributor/chronos-system'),
      '@services': path.resolve(__dirname, './src/apps/FlowDistributor/chronos-system/services'),
      '@hooks': path.resolve(__dirname, './src/apps/FlowDistributor/chronos-system/hooks'),
      '@components': path.resolve(
        __dirname,
        './src/apps/FlowDistributor/chronos-system/components'
      ),
      '@schemas': path.resolve(__dirname, './src/apps/FlowDistributor/chronos-system/schemas'),
      '@utils': path.resolve(__dirname, './src/apps/FlowDistributor/chronos-system/utils'),
    },
  },
});
