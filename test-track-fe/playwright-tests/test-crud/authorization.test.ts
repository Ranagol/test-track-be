import { test, expect, Page } from '@playwright/test';
import { login } from './../auth/helpers';

const testerEmail = process.env.DEFAULT_TESTER_EMAIL!;
const testerPassword = process.env.DEFAULT_TESTER_PASSWORD!;
const testTakerEmail = process.env.DEFAULT_TEST_TAKER_EMAIL!;
const testTakerPassword = process.env.DEFAULT_TEST_TAKER_PASSWORD!;
const baseUrl = process.env.FRONTEND_URL!;

test('redirects an unauthorized test edit to the forbidden page', async ({ page }) => {
    await loginAs(page, testerEmail, testerPassword);
    await page.goto(`${baseUrl}/tests`);
    await page.getByRole('textbox', { name: 'Search tests' }).fill('math');

    const mathTestRow = page.locator('.el-table__row')
        .filter({ hasText: 'Math test' })
        .filter({ hasText: 'A very difficult math test' })
        .first();

    await expect(mathTestRow).toBeVisible();

    const editUrl = await mathTestRow.locator('a[href*="/tests/"][href$="/edit"]').getAttribute('href');
    await logout(page);

    await loginAs(page, testTakerEmail, testTakerPassword);
    await page.goto(editUrl!);

    await expect(page).toHaveURL(`${baseUrl}/403`);
    await expect(page.getByText('403', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Page forbidden' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Edit test' })).not.toBeVisible();
});

async function loginAs(page: Page, email: string, password: string): Promise<void> {
    await login(page, email, password);
    await expect(page).toHaveURL(`${baseUrl}/`);
    await expect(page.locator('text=Logout')).toBeVisible();
}

async function logout(page: Page): Promise<void> {
    await page.locator('#logout-button').click();
    await expect(page).toHaveURL(`${baseUrl}/login`);
}