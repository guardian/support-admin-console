import { expect, test } from '@playwright/test';

test.describe('Navigation and Layout', () => {
  test('Home page loads with welcome message', async ({ page }) => {
    // 1. Navigate to the home page
    await page.goto('/');
    await expect(page).toHaveTitle('Reader Revenue Control Panel');
    await expect(page.getByRole('heading', { name: 'Home Page' })).toBeVisible();
    await expect(page.getByText('Welcome to the Reader Revenue Control Panel.')).toBeVisible();
    await expect(page.getByText('To begin, select a tool from the menu.')).toBeVisible();

    // 2. Verify the 'User Guide' link in the header
    const userGuideLink = page.getByRole('link', { name: 'User Guide' });
    await expect(userGuideLink).toBeVisible();
    await expect(userGuideLink).toHaveAttribute('href', /^https:\/\//);
    await expect(userGuideLink).toHaveAttribute('target', '_blank');
  });
});
