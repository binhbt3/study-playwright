import { defineConfig, devices } from '@playwright/test';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Global setup: A file that runs once before all tests
  globalSetup: require.resolve('./src/hooks/globalSetup'),
  // Global teardown: A file that runs once after tests
  globalTeardown: require.resolve('./src/hooks/globalTeardown'),
  testDir: './',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,
  /* 
   * Reporter configuration.
   * Here, we use multiple reporters:
   *  - 'list': Outputs test results to the terminal.
   *  - 'html': Generates an HTML report saved to the outputFolder; open: 'never' prevents auto-opening.
   *  - A custom reporter located at './src/hooks/customReport'.
   */
  reporter: [
    ['list'], 
    ['html', { outputFolder: 'playwright-report', open: 'never', logLevel: 'info' }],
    ['./src/hooks/customReport']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    // Collect trace only when a test fails; helps with debugging.
    trace: 'off',
    // Capture screenshots for every test; you can change this to 'only-on-failure' if preferred.
    screenshot: 'on',
    headless: process.env.CI ? true : false  // Trong CI, chạy headless; trong local, có thể mở browser
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
