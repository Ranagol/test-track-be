import { test, expect } from '@playwright/test';

// todo andor: you must make all urls dynamic, so that they can be used in different environments (dev, staging, prod)
test('open login page', async ({ page }) => {

    await page.goto('http://localhost:5174/login');

    await page.locator('#email-input').fill('test-taker@gmail.com');

    await page.locator('#password-input').fill('test-taker@gmail.com');

    await page.locator('#login-button').click();

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL('http://localhost:5174/');

    await expect(page.locator('text=Logout')).toBeVisible();
});
