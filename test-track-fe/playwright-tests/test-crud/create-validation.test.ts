import { test, expect } from '@playwright/test';
import { login } from './../auth/helpers';

const email = process.env.DEFAULT_TESTER_EMAIL!;
const password = process.env.DEFAULT_TESTER_PASSWORD!;
const baseUrl = process.env.FRONTEND_URL!;

test('prevents creating a test without a correct answer', async ({ page }) => {
    await login(page, email, password);
    await expect(page).toHaveURL(`${baseUrl}/`);

    await page.goto(`${baseUrl}/tests/create`);
    await expect(page.getByRole('heading', { name: 'Create test' })).toBeVisible();

    await page.locator('#test-title-input').fill(`PW validation test ${Date.now()}`);
    await page.locator('#test-description-input').fill('Test for missing correct answer validation');
    await page.locator('#add-new-question-button').click();
    await page.locator('#question-text-id-0').fill('Which answer is correct?');
    await page.locator('#add-new-answer-option-button-0').click();
    await page.locator('#answer-option-0-0').fill('First answer');
    await page.locator('#add-new-answer-option-button-0').click();
    await page.locator('#answer-option-0-1').fill('Second answer');

    await page.locator('#submit-button').click();

    await expect(page.getByText('Please select the correct answer option for each question.')).toBeVisible();
    await expect(page.locator('.error-message')).toHaveCount(1);
    await expect(page).toHaveURL(`${baseUrl}/tests/create`);
    await expect(page.getByText('Test created!')).not.toBeVisible();
});