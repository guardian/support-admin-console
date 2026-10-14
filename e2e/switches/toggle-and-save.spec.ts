import { expect, test } from '@playwright/test';
import { acquireSwitchSettingsLock, releaseSwitchSettingsLock } from './switch-settings-lock';

test.beforeEach(async () => {
  await acquireSwitchSettingsLock();
});
test.afterEach(() => {
  releaseSwitchSettingsLock();
});

test.describe('Switches Tools', () => {
  test('Toggle a low-risk switch and save, then revert', async ({ page }) => {
    await page.goto('/switches');

    // 1. Note the current state of a specific non-critical switch
    const switchCheckbox = page.getByRole('checkbox', { name: 'Enable quantum metric' });
    const originalChecked = await switchCheckbox.isChecked();

    // 2. Toggle it and click 'Save'
    await switchCheckbox.click();
    await expect(switchCheckbox).toBeChecked({ checked: !originalChecked });
    await page.getByRole('button', { name: 'Save' }).first().click();

    // expect: Reloading the page shows the new toggled state persisted
    await page.reload();
    await expect(page.getByRole('checkbox', { name: 'Enable quantum metric' })).toBeChecked({
      checked: !originalChecked,
    });

    // 3. Toggle it back to its original state and save again
    await page.getByRole('checkbox', { name: 'Enable quantum metric' }).click();
    await page.getByRole('button', { name: 'Save' }).first().click();

    // expect: Switch returns to its original recorded state
    await page.reload();
    await expect(page.getByRole('checkbox', { name: 'Enable quantum metric' })).toBeChecked({
      checked: originalChecked,
    });
  });
});
