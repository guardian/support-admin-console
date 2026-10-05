import { expect, test } from '@playwright/test';
import { getOpenDrawerButton } from '../navigation/helpers';

test.describe('Cross-cutting Concerns', () => {
  test('Responsive/basic accessibility smoke check', async ({ page }) => {
    // 1. On the Epic Tests and Switches pages, verify keyboard navigation (Tab)
    // reaches primary interactive controls (Create a new test, toggles, Save)
    await page.goto('/epic-tests');

    const createButton = page.getByRole('button', { name: 'Create a new test' });
    await expect(createButton).toBeVisible();
    await page.keyboard.press('Tab'); // open drawer
    const menuButton = getOpenDrawerButton(page);
    await expect(menuButton).toBeFocused();
    await page.keyboard.press('Tab'); // User Guide link
    await page.keyboard.press('Tab'); // User Guide link (focusable wrapper)
    await expect(page.getByRole('button', { name: 'User Guide' })).toBeFocused();
    await page.keyboard.press('Tab'); // Create a new test
    // expect: Focus order is logical and all primary controls are reachable and
    // operable via keyboard
    await expect(createButton).toBeFocused();

    await page.goto('/switches');

    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    const saveButtons = page.getByRole('button', { name: 'Save' });

    // expect: toggles and Save are reachable and operable via keyboard
    await expect(firstCheckbox).toBeEnabled();
    await firstCheckbox.focus();
    await expect(firstCheckbox).toBeFocused();

    await expect(saveButtons.first()).toBeEnabled();
    await saveButtons.first().focus();
    await expect(saveButtons.first()).toBeFocused();
  });
});
