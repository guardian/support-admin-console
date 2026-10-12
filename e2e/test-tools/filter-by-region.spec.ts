import { expect, test } from '@playwright/test';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Filter test list by region', async ({ page }) => {
    // 1. Navigate to /epic-tests and open the 'Filter by Region' combobox (default 'Show all tests')
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/frontend/epic-tests') && response.ok(),
      ),
      page.goto('/epic-tests'),
    ]);
    const regionCombobox = page.getByRole('combobox', { name: 'Filter by Region Show all' });
    await expect(regionCombobox).toBeVisible();
    const testList = page.getByRole('list').last();
    const initialCount = await testList.getByRole('button').count();
    await regionCombobox.click();
    const options = page.locator('li[role="option"]');
    await expect(options).toHaveCount(8);

    // 2. Select a specific region
    await options.filter({ hasText: 'United States' }).click();
    await expect(
      page.getByRole('combobox', { name: 'Filter by Region United States' }),
    ).toBeVisible();
    const filteredCount = await testList.getByRole('button').count();
    expect(filteredCount).toBeLessThan(initialCount);

    // 3. Reset the filter back to 'Show all tests'
    await page.getByRole('combobox', { name: 'Filter by Region United States' }).click();
    await page.locator('li[role="option"]').filter({ hasText: 'Show all tests' }).click();
    await expect(page.getByRole('combobox', { name: 'Filter by Region Show all' })).toBeVisible();
    await expect(testList.getByRole('button')).toHaveCount(initialCount);
  });
});
