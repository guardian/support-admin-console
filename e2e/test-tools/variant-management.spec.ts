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
  test('Variant management: add and delete a variant', async ({ page }) => {
    await page.goto('/epic-tests');

    // 1. Open a Draft test, enter edit mode, and click 'New variant'
    await openTestRow(page, 'Draft TEST_E2E');
    const editButton = page.getByRole('button', { name: 'Edit test' });
    if (await editButton.isVisible()) {
      await editButton.click();
    }
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
    await page.getByRole('button', { name: 'New variant' }).click();
    await page.getByRole('textbox', { name: 'Variant name' }).fill('v1_test');
    await page.getByRole('button', { name: 'Create variant' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByText('v1_test')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'V1_TEST' })).toBeVisible();

    // Variants are rendered as collapsed accordions; their Clone/Delete
    // actions are only present in the accessibility tree once expanded.
    await page.getByRole('heading', { name: 'CONTROL' }).click();
    await expect(page.getByRole('button', { name: 'Clone variant' })).toHaveCount(1);

    // 2. Click 'Clone variant' on an existing variant
    await page.getByRole('button', { name: 'Clone variant' }).first().click();
    await page.getByRole('textbox', { name: 'Variant name' }).fill('v2_clone_test');
    const cloneDialog = page.getByRole('dialog');
    await cloneDialog.getByRole('button', { name: 'Clone variant' }).click();
    await expect(page.getByRole('heading', { name: 'V2_CLONE_TEST' })).toBeVisible();

    // 3. Click 'Delete variant' on the newly created/cloned variant
    const clonedVariantAccordion = page.locator('.MuiAccordion-root', {
      has: page.getByRole('heading', { name: 'V2_CLONE_TEST' }),
    });
    await page.getByRole('heading', { name: 'V2_CLONE_TEST' }).click();
    await clonedVariantAccordion.getByRole('button', { name: 'Delete variant' }).click();
    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog.getByText('Are you sure?')).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: 'V2_CLONE_TEST' })).not.toBeVisible();

    // 4. Discard all changes
    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('heading', { name: 'V1_TEST' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'CONTROL' })).toBeVisible();
  });
});
