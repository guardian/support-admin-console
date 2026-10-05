import { expect, test } from '@playwright/test';
import {
  acquireTestE2ELock,
  ensureTestE2EExists,
  openTestRow,
  releaseTestE2ELock,
} from '../test-list-helpers';

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(15000);
  await ensureTestE2EExists(page);
  await acquireTestE2ELock();
});
test.afterEach(() => {
  releaseTestE2ELock();
});

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Edit an existing draft test and save changes, then revert', async ({ page }) => {
    await page.goto('/epic-tests');

    // 1. Open an existing Draft test, click 'Edit test', and change a low-risk field
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    const maxViewsInput = page.getByRole('textbox', { name: 'Maximum view counts' });
    const originalMaxViews = await maxViewsInput.inputValue();
    const updatedMaxViews = originalMaxViews === '6' ? '7' : '6';
    await maxViewsInput.fill(updatedMaxViews);

    // 2. Click 'Save test'
    await page.getByRole('button', { name: 'Save test' }).click();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();

    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.getByRole('textbox', { name: 'Maximum view counts' })).toHaveValue(
      updatedMaxViews,
    );

    // 3. Re-open the test, edit it back to its original value, and save again to restore original state
    await page.getByRole('textbox', { name: 'Maximum view counts' }).fill(originalMaxViews);
    await page.getByRole('button', { name: 'Save test' }).click();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();

    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.getByRole('textbox', { name: 'Maximum view counts' })).toHaveValue('4');
  });
});
