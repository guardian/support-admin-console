import { expect, test } from '@playwright/test';

test.describe('Support Site Tools', () => {
  test('Student Landing Page Offers and Landing Page tests render', async ({ page }) => {
    // 1. Navigate to /support-landing-page-tests
    await page.goto('/support-landing-page-tests');
    // expect: Landing page test list renders with expected CRUD controls
    await expect(page.getByRole('heading', { name: 'Support Landing Page Tests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create a new test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Batch archive tests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reorder test list' })).toBeVisible();

    // 2. Navigate to /student-landing-page-tests
    await page.goto('/student-landing-page-tests');
    // expect: Student offers test list renders with expected CRUD controls
    await expect(page.getByRole('heading', { name: 'Student Landing Page Offers' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create a new test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Batch archive tests' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reorder test list' })).toBeVisible();
  });
});
