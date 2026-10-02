import { expect, test } from '@playwright/test';
import { ensureTestE2EExists } from '../test-list-helpers';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Create test with duplicate/invalid name is rejected', async ({ page }) => {
    await ensureTestE2EExists(page);

    // 1. Click 'Create a new test' and submit with an empty name
    await page.getByRole('button', { name: 'Create a new test' }).click();
    const dialog = page.getByRole('dialog');
    await page.getByRole('button', { name: 'Create test' }).click();
    await expect(
      dialog.getByText('Field cannot be empty - please enter some text').first(),
    ).toBeVisible();

    // 2. Click 'Create a new test' and enter the exact name of an already-existing test
    await page.getByRole('textbox', { name: 'Full test name' }).fill('TEST_E2E');
    await page.getByRole('textbox', { name: 'Nickname' }).fill('TEST_E2E');
    await page.getByRole('button', { name: 'Create test' }).click();
    await expect(
      dialog.getByText('Name already exists - please try another').first(),
    ).toBeVisible();

    // 3. Cancel/close the create-test dialog without submitting
    await page.getByRole('button', { name: 'close' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Create a new test' })).toBeVisible();
  });
});
