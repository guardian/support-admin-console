import { expect, test } from '@playwright/test';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Batch archive tests', async ({ page }) => {
    const testName = `ZZZ_E2E_BATCH_ARCHIVE_DELETE_ME_${Date.now()}`;
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().endsWith('/frontend/epic-tests') && response.ok(),
      ),
      page.goto('/epic-tests'),
    ]);

    // Create and save an e2e test artifact to archive
    await page.getByRole('button', { name: 'Create a new test' }).click();
    await page.getByRole('textbox', { name: 'Full test name' }).fill(testName);
    await page.getByRole('textbox', { name: 'Nickname' }).fill(testName);
    await page.getByRole('button', { name: 'Create test' }).click();
    await page.getByRole('button', { name: 'Save test' }).click();
    await expect(page.getByRole('button', { name: `Draft ${testName}` })).toBeVisible();

    // 1. Click 'Batch archive tests'
    await page.getByRole('button', { name: 'Batch archive tests' }).click();
    const selectionDialog = page.getByRole('dialog', { name: 'Batch archive tests' });
    await expect(selectionDialog).toBeVisible();
    await expect(selectionDialog.getByRole('checkbox', { name: testName })).toBeVisible();

    // 3. Attempt to submit with zero tests selected
    await selectionDialog.getByRole('button', { name: 'Archive' }).click();
    const zeroConfirmDialog = page.getByText(
      'Please confirm. The following tests will be archived:',
    );
    await expect(zeroConfirmDialog).toBeVisible();
    await page
      .getByRole('dialog')
      .filter({ hasText: 'Please confirm' })
      .getByRole('button', { name: 'Cancel' })
      .click();

    // 2. Select only the previously-created e2e test artifacts and confirm archive
    await selectionDialog.getByRole('checkbox', { name: testName }).click();
    await selectionDialog.getByRole('button', { name: 'Archive' }).click();
    const confirmDialog = page.getByRole('dialog').filter({ hasText: 'Please confirm' });
    await expect(confirmDialog.getByText(testName)).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Archive' }).click();

    await expect(page.getByRole('button', { name: `Draft ${testName}` })).not.toBeVisible();
  });
});
