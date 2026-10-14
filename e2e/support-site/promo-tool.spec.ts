import { expect, test } from '@playwright/test';

test.describe('Support Site Tools', () => {
  test('Promo Tool and Default Promos load and list existing promos', async ({ page }) => {
    // 1. Navigate to /promo-tool
    await page.goto('/promo-tool');
    // expect: Existing promo configurations are listed, with an action to create a new promo
    await expect(page.getByRole('heading', { name: 'Promo Tool' })).toBeVisible();
    await expect(page.getByText('Promo Campaigns', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create new promo campaign' })).toBeVisible();

    // 2. Navigate to /default-promos
    await page.goto('/default-promos');
    // expect: Default promo mappings are listed per product/region without errors
    await expect(page.getByRole('heading', { name: 'Default Promos' })).toBeVisible();
    await expect(page.getByText('Guardian Weekly').first()).toBeVisible();
    await expect(page.getByText('Supporter Plus').first()).toBeVisible();
  });
});
