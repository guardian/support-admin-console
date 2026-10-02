// spec: spec/reader-revenue-control-panel.plan.md
// seed: e2e/seed.spec.ts

import { expect, test } from '@playwright/test';
import { ensureTestE2EExists } from '../test-list-helpers';

test.describe('Admin and Access Management', () => {
  test('Test Audits page shows cross-tool audit history', async ({ page }) => {
    await ensureTestE2EExists(page);

    // 1. Navigate to /audit-tests
    await page.goto('/audit-tests');
    // expect: A searchable/filterable audit log is displayed listing changes across
    // test tools, with details such as test name, user, and timestamp
    await expect(page.getByRole('columnheader', { name: 'Index' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Timestamp' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'User Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Compare' })).toBeVisible();

    // 2. Use any available search/filter control to narrow by test name or user
    await page.locator('#test-name').fill('TEST_E2E');
    await page.getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: 'Epic', exact: true }).click();
    await page.getByRole('button', { name: 'Get audit' }).click();

    // expect: List updates to show only matching entries
    await expect(page.getByText('Audit Details for TEST_E2E')).toBeVisible();
    const rows = page
      .locator('[role="grid"] [role="row"]')
      .filter({ hasText: /\d{1,2}\/\d{1,2}\/\d{4}/ });
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });
});
