import { expect, test } from '@playwright/test';
import { getOpenDrawerButton } from '../navigation/helpers';
import { acquireSwitchSettingsLock, releaseSwitchSettingsLock } from './switch-settings-lock';

test.beforeEach(async () => {
  await acquireSwitchSettingsLock();
});
test.afterEach(() => {
  releaseSwitchSettingsLock();
});

test.describe('Switches Tools', () => {
  test('Unsaved switch changes are not persisted on navigation away', async ({ page }) => {
    await page.goto('/switches');

    const switchCheckbox = page.getByRole('checkbox', { name: 'Enable quantum metric' });
    const originalChecked = await switchCheckbox.isChecked();

    // 1. Toggle a switch but do not click 'Save'
    await switchCheckbox.click();
    // expect: the change is applied in the UI without saving
    await expect(switchCheckbox).toBeChecked({ checked: !originalChecked });

    // 2. Navigate away and back to /switches without saving
    // Actual behavior: no browser 'unsaved changes' warning is shown; the in-app SPA
    // navigation silently discards the unsaved change.
    await getOpenDrawerButton(page).click();
    await page.getByRole('link', { name: 'Epic', exact: true }).click();
    await getOpenDrawerButton(page).click();
    await page.getByRole('link', { name: 'Switches', exact: true }).click();

    // expect: Switch shows its original, unmodified state
    await expect(page.getByRole('checkbox', { name: 'Enable quantum metric' })).toBeChecked({
      checked: originalChecked,
    });
  });
});
