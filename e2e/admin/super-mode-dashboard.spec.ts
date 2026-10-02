// spec: spec/reader-revenue-control-panel.plan.md
// seed: e2e/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Admin and Access Management', () => {
  test('Super Mode Dashboard renders operational status', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to /super-mode
    await page.goto('/super-mode');

    // expect: Dashboard renders showing current 'Super Mode' status/configuration
    // without console errors
    await expect(page.getByRole('heading', { name: 'Epic Super Mode dashboard' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Article' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Region' })).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });
});
