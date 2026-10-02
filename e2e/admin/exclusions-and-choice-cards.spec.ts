// spec: spec/reader-revenue-control-panel.plan.md
// seed: e2e/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Admin and Access Management', () => {
  test('Channel Exclusions and Default Choice Cards pages load', async ({ page }) => {
    // 1. Navigate to /exclusions
    await page.goto('/exclusions');
    // expect: Page renders a list/form for configuring channel exclusions without errors
    await expect(page.getByRole('heading', { name: 'Exclusions' })).toBeVisible();
    await expect(page.getByText('Add epic rule')).toBeVisible();

    // 2. Navigate to /default-choice-cards
    await page.goto('/default-choice-cards');
    // expect: Page renders default choice card configuration without errors
    await expect(page.getByRole('heading', { name: 'Default Choice Cards' })).toBeVisible();
    await expect(page.getByText('Configure global default choice cards.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
  });
});
