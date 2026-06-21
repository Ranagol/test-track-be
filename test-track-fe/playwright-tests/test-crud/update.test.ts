import { test, expect, Page } from '@playwright/test';
import { login } from './../auth/helpers';

/**
 * We export the default tester email, password, baseUrl from the .env file.
 */
const email = process.env.DEFAULT_TESTER_EMAIL!;
const password = process.env.DEFAULT_TESTER_PASSWORD!;

// This will be: http://localhost:5174 in local environment,
const baseUrl = process.env.FRONTEND_URL!;

const newTestTitle: string = 'This is an updated test title';
const newTestDescription: string = 'This is an updated test description';
const newFirstQuestionText: string = 'First question updated text';
const newFirstQuestionFirstAnswerOptionText: string = 'First question first answer option updated text';
const newSecondQuestionText: string = 'Second question updated text';
const newSecondQuestionFirstAnswerOptionText: string = 'Second question first answer option updated text';

test('update an existing test', async ({ page }) => {

    await doLogin(page, email, password);

    await goToEditTestPage(page);

    await editTestDetails(page);

    await editFirstQuestionAndAnswerOption(page);

    await editSecondQuestionAndAnswerOption(page);

    await page.locator('#submit-button').click();

    //'Test updated' popup should be visible after a successful update
    await expect(page.locator('text=Test updated')).toBeVisible();

    // We simply refresh the page to check if the updated test details are correctly saved in the database and displayed on the edit page.
    await goToEditTestPage(page);

    await doubleCheckUpdates(page);
});

async function doLogin(
    page: Page,
    email: string,
    password: string
): Promise<void>
{
    await login(page, email, password);

    // We expect after a successful login to be redirected to the '/' page
    await expect(page).toHaveURL(`${baseUrl}/`);

    // When the user is logged in, we expect to see a logout button in the header
    await expect(page.locator('text=Logout')).toBeVisible();
}

async function goToEditTestPage(page: Page): Promise<void>
{
    const editTestUrl = `${baseUrl}/tests/11/edit`;

    await page.goto(editTestUrl);

    await expect(page.getByRole('heading', { name: 'Edit test' })).toBeVisible();
}

async function editTestDetails(page: Page): Promise<void>
{
    await page.locator('#test-title-input').fill(newTestTitle);

    await expect(page.getByText('Test title is required')).not.toBeVisible();

    await page.locator('#test-description-input').fill(newTestDescription);

    await expect(page.getByText('Test description is required')).not.toBeVisible();
}

async function editFirstQuestionAndAnswerOption(page: Page): Promise<void>
{

    // 0 is the index of the first question.
    await page.locator('#question-text-id-0').fill(newFirstQuestionText);

    await expect(page.getByText('Question text is required')).not.toBeVisible();

    // 0 is the index of the first question, 0 is the index of the first answer option.
    await page.locator('#answer-option-0-0').fill(newFirstQuestionFirstAnswerOptionText);

    await expect(page.getByText('Answer option text is required.')).not.toBeVisible();
}

async function editSecondQuestionAndAnswerOption(page: Page): Promise<void>
{

    // 1 is the index of the second question.
    await page.locator('#question-text-id-1').fill(newSecondQuestionText);

    await expect(page.getByText('Question text is required')).not.toBeVisible();

    // 1 is the index of the second question, 0 is the index of the first answer option.
    await page.locator('#answer-option-1-0').fill(newSecondQuestionFirstAnswerOptionText);

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

        // ... and we select the last radio button in each group as the correct answer option
        const input = group.locator('input[type="radio"]').last();

        // We need to use force: true because the radio button is hidden and wrapped in a custom component.
        await input.click({ force: true });
    }
}

async function doubleCheckUpdates(page: Page): Promise<void>
{
    await expect(page.locator('#test-title-input')).toHaveValue(newTestTitle);

    await expect(page.locator('#test-description-input')).toHaveValue(newTestDescription);

    await expect(page.locator('#question-text-id-0')).toHaveValue(newFirstQuestionText);

    await expect(page.locator('#answer-option-0-0')).toHaveValue(newFirstQuestionFirstAnswerOptionText);

    await expect(page.locator('#question-text-id-1')).toHaveValue(newSecondQuestionText);

    await expect(page.locator('#answer-option-1-0')).toHaveValue(newSecondQuestionFirstAnswerOptionText);
}
