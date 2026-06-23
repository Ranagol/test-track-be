import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '../.env'),
});


import { defineConfig, devices } from '@playwright/test';

const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5174';
const apiUrl = process.env.VITE_API_BASE_URL || process.env.APP_TEST_SERVER_URL || 'http://127.0.0.1:8001';

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
    testDir: './playwright-tests',

    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,

    reporter: [['html', { open: 'on-failure' }]],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: frontendUrl,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

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

    /**
     * local @pw flow in scripts/playwright.sh already relies on Sail, not on Webserver.
     * So, with 'composer run full-check', we do not use webServer.
     * webServer run only when CI is set
     */
    webServer: process.env.CI ? [
        {
            command: 'php artisan serve --host=127.0.0.1 --port=8001',
            url: 'http://127.0.0.1:8001',
            cwd: path.resolve(process.cwd(), '..'),
            reuseExistingServer: false,
            timeout: 120 * 1000,
        },
        {
            command: 'npm run dev -- --host 127.0.0.1 --port 5174',
            url: frontendUrl,
            cwd: process.cwd(),
            reuseExistingServer: false,
            timeout: 120 * 1000,
            env: {
                ...process.env,
                FRONTEND_URL: frontendUrl,
                VITE_API_BASE_URL: apiUrl,
            },
        },
    ] : undefined,
});
