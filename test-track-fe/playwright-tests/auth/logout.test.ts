import { test, expect } from '@playwright/test';
import { login } from './helpers';

/**
 * We export the default tester email, password, baseUrl from the .env file.
 */
const email = process.env.DEFAULT_TESTER_EMAIL!;
const password = process.env.DEFAULT_TESTER_PASSWORD!;

// This will be: http://localhost:5174 in local environment,
const baseUrl = process.env.FRONTEND_URL!;

test('logout works', async ({ page }) => {

    await login(page, email, password);

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL(`${baseUrl}/`);

    // When the user is logged in, we expect to see a logout button in the header
    // await expect(page.getByRole('menuitem', { name: 'Logout' })).toBeVisible();//this is faulty
    await expect(page.getByText('Logout')).toBeVisible();

    await page.locator('#logout-button').click();

    // We expect after a successful logout to be redirected to the '/' page
    await expect(page).toHaveURL(`${baseUrl}/`);

    // When the user is logged out, we expect to see a login button in the header
    await expect(page.getByRole('button', { name:'Login' })).toBeVisible();
});


