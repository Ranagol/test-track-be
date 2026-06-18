import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string): Promise<void> {
    await page.goto('http://localhost:5174/login');
    await page.locator('#email-input').fill(email);
    await page.locator('#password-input').fill(password);
    await page.locator('#login-button').click();
}
