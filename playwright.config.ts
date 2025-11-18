/**
 * PLAYWRIGHT CONFIGURATION - CHRONOS E2E TESTING
 * Configuración comprehensiva para tests end-to-end
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Test match pattern
  testMatch: '**/*.spec.{ts,js}',

  // Timeout configuration
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 10000, // 10 seconds for assertions
  },

  // Test execution settings
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!process.env.CI, // Fail CI if test.only is used
  retries: process.env.CI ? 2 : 1, // Retry failed tests
  workers: process.env.CI ? 2 : 4, // Number of parallel workers

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
    ['list'],
    ['github'], // GitHub Actions integration
  ],

  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001',

    // Trace configuration (debugging)
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',

    // Screenshot configuration
    screenshot: 'only-on-failure',

    // Video configuration
    video: process.env.CI ? 'retain-on-failure' : 'off',

    // Timeouts
    actionTimeout: 15000, // 15 seconds for actions
    navigationTimeout: 30000, // 30 seconds for page loads

    // Browser context
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,

    // Accept downloads
    acceptDownloads: true,

    // Locale and timezone
    locale: 'es-MX',
    timezoneId: 'America/Mexico_City',
  },

  // Projects (browsers and devices to test)
  projects: [
    // Desktop browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        isMobile: true,
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
        isMobile: true,
      },
    },

    // Tablet browsers
    {
      name: 'tablet-ipad',
      use: {
        ...devices['iPad Pro'],
        isMobile: false,
      },
    },
  ],

  // Web server configuration (dev server)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
