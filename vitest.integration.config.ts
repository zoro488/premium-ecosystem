import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'integration-real',
    root: '.',
    include: ['__tests__/integration/**/*.integration.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**'],
    globals: true,
    environment: 'node',
    setupFiles: ['__tests__/setup.integration.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    reporters: ['verbose', 'html', 'json'],
    outputFile: {
      html: './test-results/integration/index.html',
      json: './test-results/integration/results.json',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './coverage/integration',
      include: [
        'src/apps/FlowDistributor/chronos-system/services/**/*.js',
        'src/apps/FlowDistributor/services/**/*.{js,ts}',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
