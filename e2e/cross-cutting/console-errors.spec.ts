import { expect, test } from '@playwright/test';

test.describe('Cross-cutting Concerns', () => {
  test('No unhandled console errors on core pages', async ({ page }) => {
    const routes = [
      '/',
      '/epic-tests',
      '/header-tests',
      '/switches',
      '/access-management',
      '/qr-code',
      '/bookmarklets',
    ];

    // 1. Visit each top-level route from the drawer in turn, capturing browser console output
    for (const route of routes) {
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(`${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // expect: No uncaught JavaScript errors (console 'error' level) are logged on
      // initial page load for any route
      expect(consoleErrors, `Console errors on ${route}`).toEqual([]);

      page.removeAllListeners('console');
    }
  });
});
