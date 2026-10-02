// spec: spec/reader-revenue-control-panel.plan.md
// seed: e2e/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Create a new draft test, then discard without saving', async ({ page }) => {
    const testName = `ZZZ_E2E_TEST_DELETE_ME_${Date.now()}`;
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/frontend/epic-tests') && response.ok(),
      ),
      page.goto('/epic-tests'),
    ]);

    // 1. Navigate to /epic-tests and click 'Create a new test'
    await page.getByRole('button', { name: 'Create a new test' }).click();
    await expect(page.getByRole('heading', { name: 'Create a new test' })).toBeVisible();
    const fullTestNameInput = page.getByRole('textbox', { name: 'Full test name' });
    await expect(fullTestNameInput).toBeVisible();

    // 2. Enter a clearly-marked test name, e.g. 'ZZZ_E2E_TEST_DELETE_ME_<timestamp>', and submit
    await fullTestNameInput.fill(testName);
    await page.getByRole('textbox', { name: 'Nickname' }).fill(testName);
    await page.getByRole('button', { name: 'Create test' }).click();
    await expect(page.getByRole('button', { name: `Draft ${testName}` })).toBeVisible();

    // 3. Without making further changes, delete or archive the newly created test to clean up
    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('button', { name: `Draft ${testName}` })).not.toBeVisible();

    await page.goto('/epic-tests');
    await expect(page.getByRole('button', { name: `Draft ${testName}` })).not.toBeVisible();
  });
});
