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
  test('Audit trail shows change history', async ({ page }) => {
    await page.goto('/epic-tests');

    // 1. Open a test that has been previously edited and click 'Audit'
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Audit' }).click();

    await expect(page).toHaveURL('/audit-tests/Epic/TEST_E2E');
    await expect(page.getByText('Audit Details for TEST_E2E')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Timestamp' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'User Email' })).toBeVisible();
    await expect(page.getByRole('row').nth(1)).toBeVisible();

    // 2. Close the audit view
    await page.goto('/epic-tests');
    await expect(page).toHaveURL('/epic-tests');
  });
});
