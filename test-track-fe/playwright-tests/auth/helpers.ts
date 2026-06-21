import { Page } from '@playwright/test';

// This will be: http://localhost:5174 in local environment,
const baseUrl = process.env.FRONTEND_URL!;

export async function login(page: Page, email: string, password: string): Promise<void> {
    await page.goto(`${baseUrl}/login`);
    await page.locator('#email-input').fill(email);
    await page.locator('#password-input').fill(password);
    await page.locator('#login-button').click();
}
