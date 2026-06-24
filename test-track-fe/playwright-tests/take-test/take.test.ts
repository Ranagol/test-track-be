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

test('take the Math test', async ({ page }) => {

    //Log in as tester, to get the link for the test taker invitation
    await login(page, testerEmail, testerPassword);

    //Check that we are on the home page, redirected after a successful login
    await expect(page).toHaveURL(`${baseUrl}`);

    // wait for app to fully settle, and check that the logout button is visible. This is crucial!
    await expect(page.locator('text=Logout')).toBeVisible();

    //Go to the tests page, where all tests are listed
    await page.goto(`${baseUrl}/tests`);

    //Check if we are on the tests page, by checking if the heading is visible
    await expect(page).toHaveURL(`${baseUrl}/tests`);

    //Confirm that we are on the tests page, by checking if the heading is visible
    await expect(page.getByRole('heading', { name: 'My tests' })).toBeVisible();

    /**
     * In /tests page, tests are listed. We need to find the specific Math test, that is pre-seeded
     * exactly for this kind of check. This Math test has title "Math test" and description "A very
     * difficult math test". We need to find the row in the table that contains this test.
     */
    const mathTestRow = page.locator('.el-table__row')
        .filter({ hasText: 'Math test' })
        .filter({ hasText: 'A very difficult math test' })
        .first();

    await expect(mathTestRow).toBeVisible();

    /**
     * Now, in the given table row, we need to find the "Take test" link for this math test.
     */
    const takeTestLink = mathTestRow.locator(`a[href*="/tests/take-test/"]`).first();
    await expect(takeTestLink).toBeVisible();
    const href = await takeTestLink.getAttribute('href');

    await logOutTester(page);

    //Log in as test taker, to take the test
    await doLogin(page, testTakerEmail, testTakerPassword);

    //Go to the test that needs to be taken
    await page.goto(href!);

    // Just check if we are on the right page, by checking if the test title is visible
    await expect(page.getByRole('heading', { name: 'Math test' })).toBeVisible();
    await expect(page.getByText('A very difficult math test', { exact: true })).toBeVisible();

    await page.locator('#radio-group-for-question-index-0').getByText('4').click();

    await page.locator('#radio-group-for-question-index-1').getByText('15').click();

    await page.locator('#radio-group-for-question-index-2').getByText('5').click();

    await page.locator('#submit-button').click();

    await expect(page.locator('text=You have successfully submitted the test. Have a nice day!')).toBeVisible();
});


async function logOutTester(page: Page): Promise<void>
{
    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();

    await page.locator('#logout-button').click();

    // We expect after a successful logout to be redirected to the 'login' page
    await expect(page).toHaveURL(`${baseUrl}/login`);

}

async function doLogin(
    page: Page,
    email: string,
    password: string
): Promise<void>
{
    await login(page, email, password);

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL(`${baseUrl}/`);

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();
}
