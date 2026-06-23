import dotenv from 'dotenv';
import path from 'path';

/**
 * dotenv reads a .env file and puts its variables into process.env object. Meaning, we can access all our
 * .env variables here in PW, from process.env like this (example):
 * process.env.FRONTEND_URL
 * process.env.APP_TEST_SERVER_URL
 * In Node.js, process is a global object that represents the currently running Node process.
 */
dotenv.config({

    /**
     * Load environment variables from the .env file that is one directory above the current working
     * directory.
     */
    path: path.resolve(process.cwd(), '../.env'),
});

import { defineConfig, devices } from '@playwright/test';

const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5174';
const apiUrl = process.env.VITE_API_BASE_URL || process.env.APP_TEST_SERVER_URL || 'http://127.0.0.1:8001';

/**
 * backendEnv is just a JS object, that contains all env variables.
 */
const backendEnv = {
    ...process.env,
    APP_ENV: 'local',
    APP_URL: process.env.APP_URL || apiUrl,
    FRONTEND_URL: frontendUrl,
    SANCTUM_STATEFUL_DOMAINS: process.env.SANCTUM_STATEFUL_DOMAINS || 'localhost:5174,127.0.0.1:5174,localhost:8001,127.0.0.1:8001',
};

export default defineConfig({
    testDir: './playwright-tests',

    /* Run tests in files in parallel */
    fullyParallel: true,

    /**
     * In Node.js, process is a global object that represents the currently running Node process.
     * process.env is a nested object in process, that contains all the env variables.
     * process.env.CI is usually 'undefined' or false in local development. However, in CI/CD
     * GitHub Actions set the process.env.CI to true
     */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,

    /**
     * Whether PW should generate a report in HTML format, after running tests.
     */
    reporter: [['html', { open: 'on-failure' }]],

    use: {

        /* Base URL to use in actions like `await page.goto('')`. */
        baseURL: frontendUrl,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],

    /**
     * local PW flow in scripts/playwright.sh relies on Sail and on 'composer run pw', not on Webserver.
     * So, with 'composer run pw', we do not use webServer.
     * webServer is used only in CI/CD process when CI is set (process.env.CI). This is set with the
     * 'webServer: process.env.CI ? [...' ternary operator
     */
    webServer: process.env.CI ? [

        /**
         * Run backend server (Laravel)
         */
        {
            command: 'php -S 127.0.0.1:8001 ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php',
            url: apiUrl,
            cwd: path.resolve(process.cwd(), '../public'),
            reuseExistingServer: false,
            timeout: 120 * 1000,
            env: backendEnv,
        },

        /**
         * Run frontend server (Vite) for Vuejs
         */
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
