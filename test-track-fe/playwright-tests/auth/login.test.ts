import { test, expect } from '@playwright/test';
import { login } from './helpers';

// todo andor: you must make all urls dynamic, so that they can be used in different environments (dev, staging, prod)
test('log in with valid credentials', async ({ page }) => {

    await login(page, 'test-taker@gmail.com', 'test-taker@gmail.com');

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL('http://localhost:5174/');

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();
});


