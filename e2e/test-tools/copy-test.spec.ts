// spec: spec/reader-revenue-control-panel.plan.md
// seed: e2e/seed.spec.ts

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
  test('Copy test to duplicate configuration', async ({ page }) => {
    const copyName = `ZZZ_E2E_COPY_TEST_DELETE_ME_${Date.now()}`;
    await page.goto('/epic-tests');

    // 1. Open an existing test and click 'Copy test'
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Copy test' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Name your new test' })).toBeVisible();

    // 2. Confirm the copy with a clearly-marked e2e test name
    await dialog.getByRole('textbox', { name: 'Full test name' }).fill(copyName);
    await dialog.getByRole('textbox', { name: 'Nickname' }).fill(copyName);
    await dialog.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByRole('button', { name: `Draft ${copyName}` })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CONTROL' })).toBeVisible();

    // 3. Delete/archive the copied test to clean up
    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('button', { name: `Draft ${copyName}` })).not.toBeVisible();
  });
});
