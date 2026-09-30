import { test, expect } from '@playwright/test';

const baseUrl = process.env.FRONTEND_URL!;

test('rejects invalid login credentials', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);

    await page.locator('#email-input').fill(`unknown_${Date.now()}@mail.com`);
    await page.locator('#password-input').fill('Password123!');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(`${baseUrl}/login`);
    await expect(page.locator('.el-form-item__error').first()).toBeVisible();
    await expect(page.getByText('Logout')).not.toBeVisible();
});

test('shows validation errors for empty login fields', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);

    await page.locator('#login-button').click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page).toHaveURL(`${baseUrl}/login`);
});