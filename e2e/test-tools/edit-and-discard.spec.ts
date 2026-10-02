import { expect, test } from '@playwright/test';
import {
  acquireTestE2ELock,
  ensureTestE2EExists,
  openTestRow,
  releaseTestE2ELock,
} from '../test-list-helpers';

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(60000);
  await ensureTestE2EExists(page);
  await acquireTestE2ELock();
});
test.afterEach(() => {
  releaseTestE2ELock();
});

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Edit an existing draft test and discard changes', async ({ page }) => {
    await page.goto('/epic-tests');

    // 1. Open an existing Draft test and click 'Edit test'
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.getByRole('button', { name: 'Archive test', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save test' })).toBeVisible();

    // 2. Modify a text field (e.g. a targeting label) and/or add a 'New variant'
    const maxViewsInput = page.getByRole('textbox', { name: 'Maximum view counts' });
    await maxViewsInput.fill('7');
    await expect(maxViewsInput).toHaveValue('7');

    await page.getByRole('button', { name: 'New variant' }).click();
    await page.getByRole('textbox', { name: 'Variant name' }).fill('v1_e2e_test');
    await page.getByRole('button', { name: 'Create variant' }).click();
    await expect(page.getByRole('heading', { name: 'V1_E2E_TEST' })).toBeVisible();

    // 3. Click 'Discard'
    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('heading', { name: 'V1_E2E_TEST' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'CONTROL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Discard' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Save test' })).not.toBeVisible();
  });
});
