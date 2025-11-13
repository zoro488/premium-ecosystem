import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'integration',
    include: ['__tests__/integration/**/*.test.{ts,tsx}'],
    environment: 'node',
    setupFiles: ['__tests__/setup-integration.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    globals: true,
  },
});
