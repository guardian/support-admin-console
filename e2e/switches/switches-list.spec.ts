import { expect, test } from '@playwright/test';

test.describe('Switches Tools', () => {
  test('Switches page lists grouped toggles with descriptions', async ({ page }) => {
    // 1. Navigate to /switches
    await page.goto('/switches');

    // expect: Grouped sections are visible
    const groups = [
      'Campaign switches',
      'Feature switches',
      'Payment methods - one-off contributions',
      'Payment methods - recurring contributions',
      'Recaptcha switches',
      'Subscriptions',
    ];
    for (const group of groups) {
      await expect(page.getByText(group, { exact: true })).toBeVisible();
    }

    await expect(page.getByRole('checkbox', { name: 'Enable mparticle' })).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: 'Enable Recaptcha on the backend' }),
    ).toBeVisible();
  });
});
