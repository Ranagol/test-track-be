import { test, expect, Page } from '@playwright/test';
import { login } from './../auth/helpers';

/**
 * We export the default tester email, password, baseUrl from the .env file.
 */
const testerEmail = process.env.DEFAULT_TESTER_EMAIL!;
const testerPassword = process.env.DEFAULT_TESTER_PASSWORD!;

const testTakerEmail = process.env.DEFAULT_TEST_TAKER_EMAIL!;
const testTakerPassword = process.env.DEFAULT_TEST_TAKER_PASSWORD!;

// This will be: http://localhost:5174 in local environment,
const baseUrl = process.env.FRONTEND_URL!;

test('Observe test taker details', async ({ page }) => {

    //THIS IS AT /test-takers page

    //Log in as tester, to get the link for the test taker invitation
    await login(page, testerEmail, testerPassword);

    //Check that we are on the home page, redirected after a successful login
    await expect(page).toHaveURL(`${baseUrl}`);

    // wait for app to fully settle, and check that the logout button is visible. This is crucial!
    await expect(page.locator('text=Logout')).toBeVisible();

    //Go to the test takers page
    await page.getByRole('menuitem', { name: 'Test Takers' }).click();

    //Confirm that we are on the right page, by checking the heading
    await expect(page.getByRole('heading', { name: 'My test takers' })).toBeVisible();

    // Click on the search box, and fill with a search term "test", simply to decrease the number of rows in the table.
    await page.getByRole('textbox', { name: 'Search for test taker name or' }).click();
    await page.getByRole('textbox', { name: 'Search for test taker name or' }).fill('test');

    const desiredTableRow = page.locator('.el-table__row')
        .filter({ hasText: testTakerEmail })
        .first();

    await expect(desiredTableRow).toBeVisible();

    const testTakerDetailsLink = desiredTableRow.locator(`a[href*="/test-takers"]`).first();


    // THIS IS AT /test-takers/:id page

    //Go to the test taker details page
    await testTakerDetailsLink.click();

    // Just check if we are on the right page
    await expect(page.getByRole('heading', { name: 'Test taker details (Analytics)' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Test taker details', exact: true })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Answer structure' }).first()).toBeVisible();

    await expect(page.getByText(`Email: ${testTakerEmail}`)).toBeVisible();

    const tables = page.getByRole('table');

    await expect(tables.first()).toBeVisible();
});
