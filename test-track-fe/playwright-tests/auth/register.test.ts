import { test, expect } from '@playwright/test';

/**
 * We export the baseUrl from the .env file. This will be: http://localhost:5174 in local environment.
 */
const baseUrl = process.env.FRONTEND_URL!;

test('register with valid credentials', async ({ page }) => {

    await page.goto(`${baseUrl}/register`);

    await page.locator('#name-input').fill('Test Taker');

    // We create a unique email address for each test run
    const email = `test_${Date.now()}@mail.com`;

    await page.locator('#email-input').fill(email);

    await page.locator('#password-input').fill('Password123!');

    await page.locator('#password-confirmation-input').fill('Password123!');

    await page.locator('#register-button').click();

    // We expect after a successful registration to be redirected to the '/' page
    await expect(page).toHaveURL(`${baseUrl}/`);

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();
});
