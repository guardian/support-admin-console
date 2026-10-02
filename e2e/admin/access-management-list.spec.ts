import { expect, test } from '@playwright/test';

test.describe('Admin and Access Management', () => {
  test('Access Management lists users with permissions', async ({ page }) => {
    // 1. Navigate to /access-management
    await page.goto('/access-management');

    // expect: A table renders with columns 'Email', 'Permissions', 'Actions'
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Permissions' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();

    // expect: Each row has an 'Edit permissions' action
    const editButtons = page.getByRole('button', { name: 'Edit permissions' });
    await expect(editButtons.first()).toBeVisible();
    expect(await editButtons.count()).toBeGreaterThan(0);
  });
});
