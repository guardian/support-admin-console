import { expect, test } from '@playwright/test';

test('healthcheck responds successfully', async ({ page }) => {
  const response = await page.goto('/healthcheck');

  expect(response?.ok()).toBe(true);
  await expect(page.locator('body')).toContainText('"status":"ok"');
});
