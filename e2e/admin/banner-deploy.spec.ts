import { expect, test } from '@playwright/test';

test.describe('Admin and Access Management', () => {
  test('Banner Deploy page renders deployment controls', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to /banner-deploy
    await page.goto('/banner-deploy');

    // expect: Page renders deployment status/controls for banner assets without errors
    await expect(page.getByText('Banner 1', { exact: true })).toBeVisible();
    await expect(page.getByText('Banner 2', { exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Region' }).first()).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Last Manual Deploy (UTC)' }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Redeploy channel 1 in selected regions' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Redeploy channel 2 in selected regions' }),
    ).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});
