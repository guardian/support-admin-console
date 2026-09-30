import { expect, test } from '@playwright/test';

test.describe('Index page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the welcome content', async ({ page }) => {
    await expect(
      page.getByText('Welcome to the Reader Revenue Control Panel.'),
    ).toBeVisible();
    await expect(
      page.getByText('To begin, select a tool from the menu.'),
    ).toBeVisible();
  });

  test('renders the header with the page title and user guide link', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', { level: 1, name: 'Home Page' }),
    ).toBeVisible();

    const userGuide = page.getByRole('link', { name: 'User Guide' });
    await expect(userGuide).toBeVisible();
    await expect(userGuide).toHaveAttribute('target', '_blank');
    await expect(userGuide).toHaveAttribute(
      'href',
      'https://docs.google.com/document/d/1ErgEoQJRpiVMHZZpUmAnq3MGY8tJCaHTun0INzLcLRc/edit',
    );
  });

  test('opens the navigation drawer from the menu button', async ({ page }) => {
    const campaigns = page.getByRole('link', { name: 'Campaigns', exact: true });
    await expect(campaigns).toBeHidden();

    await page.getByRole('button', { name: 'open drawer' }).click();

    await expect(campaigns).toBeVisible();
  });

  test('exposes stage and permissions to the client', async ({ page }) => {
    const guardian = await page.evaluate(() => window.guardian);

    expect(guardian.stage).toBe('CODE');
    expect(Array.isArray(guardian.permissions)).toBe(true);
  });
});
