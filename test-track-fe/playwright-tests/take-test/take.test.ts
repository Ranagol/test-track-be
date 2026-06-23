import { test, expect } from '@playwright/test';
import { login } from './../auth/helpers';

/**
 * We export the default tester email, password, baseUrl from the .env file.
 */
const email = process.env.DEFAULT_TESTER_EMAIL!;
const password = process.env.DEFAULT_TESTER_PASSWORD!;

// This will be: http://localhost:5174 in local environment,
const baseUrl = process.env.FRONTEND_URL!;

test('take the Math test', async ({ page }) => {

    await login(page, email, password);

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL(`${baseUrl}/`);

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();

    await page.goto(`${baseUrl}/tests`);

    const mathTestRow = page.locator('.el-table__row').filter({ hasText: 'Math test' }).filter({ hasText: 'A very difficult math test' }).first();
    await expect(mathTestRow).toBeVisible();

    const takeTestLink = mathTestRow.locator(`a[href*="/tests/take-test/"]`).first();
    await expect(takeTestLink).toBeVisible();
    await takeTestLink.click();

    // Just check if we are on the right page, by checking if the test title is visible
    await expect(page.getByRole('heading', { name: 'Math test' })).toBeVisible();
    await expect(page.getByText('A very difficult math test', { exact: true })).toBeVisible();

    await page.locator('#radio-group-for-question-index-0').getByText('4').click();

    await page.locator('#radio-group-for-question-index-1').getByText('15').click();

    await page.locator('#radio-group-for-question-index-2').getByText('5').click();

    await page.locator('#submit-button').click();

    await expect(page.locator('text=You have successfully submitted the test. Have a nice day!')).toBeVisible();
});


