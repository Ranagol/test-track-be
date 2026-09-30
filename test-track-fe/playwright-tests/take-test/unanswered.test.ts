import { test, expect, Page } from '@playwright/test';
import { login } from './../auth/helpers';

const testerEmail = process.env.DEFAULT_TESTER_EMAIL!;
const testerPassword = process.env.DEFAULT_TESTER_PASSWORD!;
const testTakerEmail = process.env.DEFAULT_TEST_TAKER_EMAIL!;
const testTakerPassword = process.env.DEFAULT_TEST_TAKER_PASSWORD!;
const baseUrl = process.env.FRONTEND_URL!;

test('prevents submitting a test with unanswered questions', async ({ page }) => {
    await login(page, testerEmail, testerPassword);
    await expect(page).toHaveURL(`${baseUrl}/`);

    await page.goto(`${baseUrl}/tests`);
    await expect(page.getByRole('heading', { name: 'My tests' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Search tests' }).fill('math');

    const mathTestRow = page.locator('.el-table__row')
        .filter({ hasText: 'Math test' })
        .filter({ hasText: 'A very difficult math test' })
        .first();

    await expect(mathTestRow).toBeVisible();

    const takeTestLink = mathTestRow.locator('a[href*="/tests/take-test/"]').first();
    const testUrl = await takeTestLink.getAttribute('href');

    await logout(page);
    await login(page, testTakerEmail, testTakerPassword);
    await expect(page).toHaveURL(`${baseUrl}/`);
    await expect(page.locator('text=Logout')).toBeVisible();
    await page.goto(testUrl!);

    await expect(page.getByRole('heading', { name: 'Math test' })).toBeVisible();
    await page.locator('#submit-button').click();

    await expect(page.getByText('Please select one answer option for each question.')).toBeVisible();
    await expect(page.locator('.error-message')).toHaveCount(3);
    await expect(page.getByText('You have successfully submitted the test. Have a nice day!')).not.toBeVisible();
});

async function logout(page: Page): Promise<void> {
    await expect(page.locator('text=Logout')).toBeVisible();
    await page.locator('#logout-button').click();
    await expect(page).toHaveURL(`${baseUrl}/login`);
}
