import { test, expect, Page } from '@playwright/test';
import { login } from './../auth/helpers';

const email = process.env.DEFAULT_TESTER_EMAIL!;
const password = process.env.DEFAULT_TESTER_PASSWORD!;
const baseUrl = process.env.FRONTEND_URL!;

test('cancelling test deletion keeps the test in the list', async ({ page }) => {
    await doLogin(page);
    await page.goto(`${baseUrl}/tests`);
    await page.getByRole('textbox', { name: 'Search tests' }).fill('math');

    const mathTestRow = page.locator('.el-table__row')
        .filter({ hasText: 'Math test' })
        .filter({ hasText: 'A very difficult math test' })
        .first();

    await expect(mathTestRow).toBeVisible();
    await mathTestRow.getByRole('button', { name: 'Delete' }).click();

    const confirmationDialog = page.getByRole('dialog');
    await expect(confirmationDialog).toBeVisible();
    await confirmationDialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(confirmationDialog).not.toBeVisible();
    await expect(mathTestRow).toBeVisible();
});

test('confirming test deletion removes the test from the list', async ({ page }) => {
    await doLogin(page);

    const testTitle = `PW delete test ${Date.now()}`;
    await createTest(page, testTitle);

    const testRow = page.locator('.el-table__row').filter({ hasText: testTitle }).first();
    await expect(testRow).toBeVisible();
    await testRow.getByRole('button', { name: 'Delete' }).click();

    const confirmationDialog = page.getByRole('dialog');
    await expect(confirmationDialog).toBeVisible();
    await confirmationDialog.getByRole('button', { name: 'Delete' }).click();

    await expect(testRow).not.toBeVisible();
    await expect(page.getByRole('link', { name: testTitle, exact: true })).toHaveCount(0);
});

async function doLogin(page: Page): Promise<void> {
    await login(page, email, password);
    await expect(page).toHaveURL(`${baseUrl}/`);
    await expect(page.locator('text=Logout')).toBeVisible();
}

async function createTest(page: Page, title: string): Promise<void> {
    await page.goto(`${baseUrl}/tests/create`);
    await expect(page.getByRole('heading', { name: 'Create test' })).toBeVisible();

    await page.locator('#test-title-input').fill(title);
    await page.locator('#test-description-input').fill('Temporary test for delete coverage');
    await page.locator('#add-new-question-button').click();
    await page.locator('#question-text-id-0').fill('Temporary question');
    await page.locator('#add-new-answer-option-button-0').click();
    await page.locator('#answer-option-0-0').fill('Correct answer');
    await page.locator('#add-new-answer-option-button-0').click();
    await page.locator('#answer-option-0-1').fill('Incorrect answer');

    await page.locator('#radio-group-for-question-index-0 input[type="radio"]').first().click({ force: true });
    await page.locator('#submit-button').click();

    await expect(page).toHaveURL(`${baseUrl}/tests`);
    await expect(page.getByRole('link', { name: title, exact: true })).toBeVisible();
}