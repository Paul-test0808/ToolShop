// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig, cucumberReporter } from 'playwright-bdd';

/**
 * Gherkin features are compiled by `bddgen` into .features-gen/ and run as regular Playwright tests.
 * @see https://vitalets.github.io/playwright-bdd
 */
const bddTestDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: ['e2e/steps/**/*.js', 'e2e/fixtures/fixtures.js'],
});

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    cucumberReporter('html', { outputFile: 'cucumber-report/index.html' }),
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://practicesoftwaretesting.com',
    /* The app exposes stable `data-test` attributes — make getByTestId() use them. */
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'bdd-chromium',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'] },
    },
    /* Enable after `npx playwright install firefox webkit`:
    { name: 'bdd-firefox', testDir: bddTestDir, use: { ...devices['Desktop Firefox'] } },
    { name: 'bdd-webkit', testDir: bddTestDir, use: { ...devices['Desktop Safari'] } },
    */
  ],
});
