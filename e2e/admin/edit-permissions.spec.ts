import { expect, test } from '@playwright/test';

test.describe('Admin and Access Management', () => {
  test("Edit a user's permissions and revert", async ({ page }) => {
    await page.goto('/access-management');

    const userRow = page.getByRole('row', { name: /test\.user4@guardian\.co\.uk/ });
    const editButton = userRow.getByRole('button', { name: 'Edit permissions' });

    // 1. Click 'Edit permissions' for a non-critical/test user account
    await editButton.click();
    // expect: A dialog/panel opens showing assignable permission options
    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('heading', { name: 'Edit Permissions for test.user4@guardian.co.uk' }),
    ).toBeVisible();
    const promosGroup = dialog.getByRole('group', { name: 'Promos Tool' });
    await expect(promosGroup.getByRole('radio', { name: 'No Access' })).toBeChecked();

    // 2. Toggle a permission and save
    await promosGroup.getByRole('radio', { name: 'Read Only' }).click();
    await dialog.getByRole('button', { name: 'Save' }).click();
    // expect: Change is reflected in the table's Permissions column for that user
    await expect(userRow).toContainText('Promos Tool:Read only');

    // 3. Revert the permission change to its original value and save
    await editButton.click();
    const promosGroupAgain = page.getByRole('dialog').getByRole('group', { name: 'Promos Tool' });
    await promosGroupAgain.getByRole('radio', { name: 'No Access' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
    // expect: User's permissions return to their original state
    await expect(userRow).not.toContainText('Promos Tool');
  });
});
