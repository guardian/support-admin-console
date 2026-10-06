import { expect, test } from '@playwright/test';
import { openTestRow } from '../test-list-helpers';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Test list renders with status badges and is navigable', async ({ page }) => {
    // 1. Navigate to /epic-tests
    await page.goto('/epic-tests');
    await expect(page.getByRole('button', { name: 'Draft', exact: false }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Live', exact: false }).first()).toBeVisible();

    // 2. Click on a Draft test in the list
    await openTestRow(page, 'Draft MPARTICLE_ATTRIBUTES_ZK_TEST_001');
    await expect(page.getByRole('button', { name: 'Copy link' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Audit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New variant' })).toBeVisible();

    // 3. Click on a Live test in the list
    await page.getByRole('button', { name: 'Live SCHEDULER_TEST' }).click();
    await expect(page.getByRole('button', { name: 'Live SCHEDULER_TEST' })).toBeVisible();
    await expect(page).toHaveURL('/epic-tests');
  });
});
