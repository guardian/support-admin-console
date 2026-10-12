import { expect, test } from '@playwright/test';

test.describe('Navigation and Layout', () => {
  test('Direct navigation to an unknown route', async ({ page }) => {
    // 1. Navigate directly to /this-route-does-not-exist
    await page.goto('/this-route-does-not-exist');

    // App shows a graceful not-found state rather than a blank white screen
    await expect(page.getByRole('heading', { name: 'Action Not Found' })).toBeVisible();
    await expect(page.locator('body')).not.toBeEmpty();
  });
});
