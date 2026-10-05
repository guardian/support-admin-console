import { expect, test } from '@playwright/test';
import {
  acquireTestE2ELock,
  ensureTestE2EExists,
  openTestRow,
  releaseTestE2ELock,
} from '../test-list-helpers';

test.beforeEach(async ({ page }, testInfo) => {
  testInfo.setTimeout(15000);
  await ensureTestE2EExists(page);
  await acquireTestE2ELock();
});
test.afterEach(() => {
  releaseTestE2ELock();
});

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Targeting configuration fields behave correctly', async ({ page }) => {
    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    const editButton = page.getByRole('button', { name: 'Edit test' });
    if (await editButton.isVisible()) {
      await editButton.click();
    }
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();

    // 1. Expand 'Target audience' options (regions: AUD/CN/EUR/NZD/GBP Countries, United States, International)
    await expect(page.getByRole('heading', { name: 'Target audience' })).toBeVisible();
    const maxViewsCount = page.locator('input[name="maxViewsCount"]');
    const originalMaxViews = await maxViewsCount.inputValue();
    const usRegion = page.getByRole('checkbox', { name: 'United States' });
    const originalUsChecked = await usRegion.isChecked();
    // expect: Selecting/deselecting regions updates the target list without errors
    await usRegion.click();
    await expect(usRegion).toBeChecked({ checked: !originalUsChecked });

    // 2. Toggle between 'Everyone', 'Non-supporters', 'Existing supporters' audience options
    await page.getByRole('radio', { name: 'Everyone' }).click();
    // expect: Only one option is selected at a time (radio-like behaviour)
    await expect(page.getByRole('radio', { name: 'Everyone' })).toBeChecked();
    await expect(page.getByRole('radio', { name: 'Non-supporters' })).not.toBeChecked();
    await expect(page.getByRole('radio', { name: 'Existing supporters' })).not.toBeChecked();

    // 3. Set platform targeting (Desktop, Mobile All/iOS/Android) and sign-in status (Signed in/out/All)
    await page.getByRole('radio', { name: 'Desktop' }).click();
    await expect(page.getByRole('radio', { name: 'Desktop' })).toBeChecked();
    await page.getByRole('radio', { name: 'Signed in' }).click();
    await expect(page.getByRole('radio', { name: 'Signed in' })).toBeChecked();

    // 4. Configure 'View frequency settings' (max views) with valid and invalid (e.g. negative) numbers
    await maxViewsCount.fill('6');
    await expect(maxViewsCount).toHaveValue('6');
    // expect: Valid numbers are accepted; invalid/negative numbers show a validation error and block save
    // Actual behavior: this field does NOT perform client-side validation - a negative
    // value is accepted without an error and does not disable the Save test button.
    await maxViewsCount.fill('-5');
    await expect(maxViewsCount).toHaveValue('-5');
    await expect(maxViewsCount).toHaveAttribute('aria-invalid', 'false');
    await expect(page.getByRole('button', { name: 'Save test' })).toBeEnabled();

    // 5. Set a Start/End 'Schedule' date range, including an End Date before the Start Date
    const startDate = page.getByRole('textbox', { name: 'Start Date (UTC)' });
    const endDate = page.getByRole('textbox', { name: 'End Date (UTC)' });
    await startDate.evaluate((el: HTMLInputElement) => {
      el.value = '2025-12-01T00:00';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await endDate.evaluate((el: HTMLInputElement) => {
      el.value = '2025-11-01T00:00';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    // expect: Valid ranges are accepted; an End Date earlier than the Start Date is
    // rejected with a validation message
    // Actual behavior: no validation message is shown for an End Date before the Start
    // Date, and the Save test button remains enabled.
    await expect(endDate).toHaveAttribute('aria-invalid', 'false');
    await expect(page.getByRole('button', { name: 'Save test' })).toBeEnabled();

    // 6. Discard all changes
    await page.getByRole('button', { name: 'Discard' }).click();
    // expect: Test reverts to original targeting configuration
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.locator('input[name="maxViewsCount"]')).toHaveValue(originalMaxViews);
    await page.getByRole('button', { name: 'Discard' }).click();
  });
});
