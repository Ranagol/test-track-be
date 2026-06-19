import { test, expect, Page } from '@playwright/test';
import { login } from './../auth/helpers';

/**
 * We export the default tester email and password from the .env file.
 */
const email = process.env.DEFAULT_TESTER_EMAIL!;
const password = process.env.DEFAULT_TESTER_PASSWORD!;

const testTitle: string = 'My first test';
const testDescription: string = 'This is a description for my first test';

test('create a new test', async ({ page }) => {

    await doLogin(page, email, password);

    await goToCreateTestPage(page);

    await fillTestDetails(page);

    await createFirstQuestionWithTwoAnswerOptions(page);

    await createSecondQuestionWithTwoAnswerOptions(page);

    await selectCorrectAnswerOptions(page);

    await page.locator('#submit-button').click();

    // We expect after creating a test to be redirected to the '/tests' page
    await expect(page).toHaveURL('http://localhost:5174/tests');


});

async function doLogin(
    page: Page,
    email: string,
    password: string
): Promise<void>
{
    await login(page, email, password);

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL('http://localhost:5174/');

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();
}

async function goToCreateTestPage(page: Page): Promise<void>
{
    const createTestUrl = 'http://localhost:5174/tests/create';

    await page.goto(createTestUrl);

    await expect(page.getByRole('heading', { name: 'Create test' })).toBeVisible();
}

async function fillTestDetails(page: Page): Promise<void>
{
    await page.locator('#test-title-input').fill(testTitle);

    await expect(page.getByText('Test title is required')).not.toBeVisible();

    await page.locator('#test-description-input').fill(testDescription);

    await expect(page.getByText('Test description is required')).not.toBeVisible();
}

async function createFirstQuestionWithTwoAnswerOptions(page: Page): Promise<void>
{
    await page.locator('#add-new-question-button').click();

    // 0 is the index of the first question.
    await page.locator('#question-text-id-0').fill('What is the capital of France?');

    await expect(page.getByText('Question text is required')).not.toBeVisible();

    // 0 is the index of the first question. Every question can have this button, so the index is needed.
    await page.locator('#add-new-answer-option-button-0').click();

    // 0 is the index of the first question, 0 is the index of the first answer option.
    await page.locator('#answer-option-0-0').fill('Paris');

    await page.locator('#add-new-answer-option-button-0').click();

    // 0 is the index of the first question, 1 is the index of the second answer option.
    await page.locator('#answer-option-0-1').fill('London');

    await expect(page.getByText('Answer option text is required.')).not.toBeVisible();
}

async function createSecondQuestionWithTwoAnswerOptions(page: Page): Promise<void>
{
    await page.locator('#add-new-question-button').click();

    // 1 is the index of the second question.
    await page.locator('#question-text-id-1').fill('What is 2 + 2?');

    await expect(page.getByText('Question text is required')).not.toBeVisible();

    // 1 is the index of the second question. Every question can have this button, so the index is needed.
    await page.locator('#add-new-answer-option-button-1').click();

    // 1 is the index of the second question, 0 is the index of the first answer option.
    await page.locator('#answer-option-1-0').fill('4');

    await page.locator('#add-new-answer-option-button-1').click();

    // 1 is the index of the second question, 1 is the index of the second answer option.
    await page.locator('#answer-option-1-1').fill('5');

    await expect(page.getByText('Answer option text is required.')).not.toBeVisible();
}

async function selectCorrectAnswerOptions(page: Page): Promise<void>
{
    /**
     * Get all radio groups (every radio group contains question and answer options)
     * ^= means "starts with". It matches any element whose "id" starts with "radio-group-for-question-index-". This is useful because we have multiple questions and we want to select the correct answer options for each question.
     */
    const radioGroups = page.locator('[id^="radio-group-for-question-index-"]');

    const groupCount = await radioGroups.count();

    for (let i = 0; i < groupCount; i++) {

        // We loop thorugh every radio group...
        const group = radioGroups.nth(i);

        // ... and we select the first radio button in each group as the correct answer option
        const input = group.locator('input[type="radio"]').first();

        // We need to use force: true because the radio button is hidden and wrapped in a custom component.
        await input.click({ force: true });
    }
}

