import { test, expect } from '@playwright/test';

const baseUrl = process.env.FRONTEND_URL!;

test('shows validation errors for invalid registration data', async ({ page }) => {
    await page.goto(`${baseUrl}/register`);

    await page.locator('#name-input').fill('A');
    await page.locator('#email-input').fill('invalid-email');
    await page.locator('#password-input').fill('Password123!');
    await page.locator('#password-confirmation-input').fill('DifferentPassword123!');
    await page.locator('#register-button').click();

    await expect(page.getByText('Name should be min. 3 characters.')).toBeVisible();
    await expect(page.getByText('Invalid email format')).toBeVisible();
    await expect(page.getByText('Passwords do not match')).toBeVisible();
    await expect(page).toHaveURL(`${baseUrl}/register`);
    await expect(page.getByText('Logout')).not.toBeVisible();
});

test('shows required validation errors for empty registration fields', async ({ page }) => {
    await page.goto(`${baseUrl}/register`);

    await page.locator('#register-button').click();

    await expect(page.getByText('Name is required')).toBeVisible();
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page.getByText('Password confirmation is required')).toBeVisible();
    await expect(page).toHaveURL(`${baseUrl}/register`);
});