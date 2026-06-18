import { test, expect } from '@playwright/test';
import { login } from './../auth/helpers';

test('take the Math test', async ({ page }) => {

    await login(page, 'test-taker@gmail.com', 'test-taker@gmail.com');

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL('http://localhost:5174/');

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();

    const testUrl = 'http://localhost:5174/tests/take-test/TEST-2851-yd';

    await page.goto(testUrl);

    // Just check if we are on the right page, by checking if the test title is visible
    await expect(page.locator('text=A very difficult math test')).toBeVisible();

    // 181 is the id of the first question's correct answer
    await page.locator('#answer-option-id-181').click();

    // 184 is the id of the second question's correct answer
    await page.locator('#answer-option-id-184').click();

    // 187 is the id of the third question's correct answer
    await page.locator('#answer-option-id-187').click();

    await page.locator('#submit-button').click();

    await expect(page.locator('text=You have successfully submitted the test. Have a nice day!')).toBeVisible();
});


