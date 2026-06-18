import { test, expect } from '@playwright/test';

test('log in with valid credentials', async ({ page }) => {

    await page.goto('http://localhost:5174/login');

    await page.locator('#email-input').fill('test-taker@gmail.com');

    await page.locator('#password-input').fill('test-taker@gmail.com');

    await page.locator('#login-button').click();

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL('http://localhost:5174/');

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();

    await page.locator('#logout-button').click();

    // We expect after a successful logout to be redirected to the '/' page
    await expect(page).toHaveURL('http://localhost:5174/');

    // When the user is logged out, we expect to see a login button in the header
    await expect(page.locator('text=Login')).toBeVisible();
});


