import { expect, test } from '@playwright/test';

test.describe('Switches Tools', () => {
  test('Channel Switches and App Meter Switches follow the same pattern', async ({ page }) => {
    // 1. Navigate to /channel-switches
    await page.goto('/channel-switches');
    // expect: Page renders a similar toggle-list UI with a Save action
    // Actual behavior: the save/apply action on this page is labeled 'Submit' rather
    // than 'Save'.
    await expect(page.getByRole('heading', { name: 'Channel Switches' })).toBeVisible();
    await expect(page.getByRole('checkbox').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();

    // 2. Navigate to /apps-metering-switches
    await page.goto('/apps-metering-switches');
    // expect: Page renders a similar toggle-list UI with a Save action
    await expect(page.getByRole('heading', { name: 'Apps Metering Switches' })).toBeVisible();
    await expect(page.getByRole('checkbox').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });
});
