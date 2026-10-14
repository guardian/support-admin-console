import { expect, test } from '@playwright/test';

test.describe('Support Site Tools', () => {
  test('One Time Checkout Tests and Checkout Nudge follow the standard test-tool CRUD pattern', async ({
    page,
  }) => {
    // 1. Navigate to /one-time-checkout-tests
    await page.goto('/one-time-checkout-tests');
    // expect: Test list with Draft/Live badges renders, consistent with other test tools
    await expect(page.getByRole('heading', { name: 'One Time Checkout Tests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create a new test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Batch archive tests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reorder test list' })).toBeVisible();

    // 2. Navigate to /checkout-nudge-tests
    await page.goto('/checkout-nudge-tests');
    // expect: Test list with Draft/Live badges renders, consistent with other test tools
    await expect(page.getByRole('heading', { name: 'Checkout Nudge Tests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create a new test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Batch archive tests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reorder test list' })).toBeVisible();
  });
});
