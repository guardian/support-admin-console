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
  test('Edit an existing draft test and save changes, then revert', async ({ page }) => {
    await page.goto('/epic-tests');

    // 1. Open an existing Draft test, click 'Edit test', and change a low-risk field
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    const maxViewsInput = page.getByRole('textbox', { name: 'Maximum view counts' });
    const originalMaxViews = await maxViewsInput.inputValue();
    const updatedMaxViews = originalMaxViews === '6' ? '7' : '6';
    await maxViewsInput.fill(updatedMaxViews);

    // 2. Click 'Save test'
    await page.getByRole('button', { name: 'Save test' }).click();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();

    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.getByRole('textbox', { name: 'Maximum view counts' })).toHaveValue(
      updatedMaxViews,
    );

    // 3. Re-open the test, edit it back to its original value, and save again to restore original state
    await page.getByRole('textbox', { name: 'Maximum view counts' }).fill(originalMaxViews);
    await page.getByRole('button', { name: 'Save test' }).click();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();

    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.getByRole('textbox', { name: 'Maximum view counts' })).toHaveValue('4');
  });

  test('Epic body copy keeps new lines as separate paragraphs', async ({ page }) => {
    let submittedParagraphs: string[] | undefined;
    await page.route('**/frontend/epic-tests/test/update', async (route) => {
      const updatedTest = route.request().postDataJSON() as {
        variants: Array<{ name: string; paragraphs: string[] }>;
      };
      submittedParagraphs = updatedTest.variants.find(
        (variant) => variant.name.toUpperCase() === 'BODY_COPY_NEWLINES',
      )?.paragraphs;
      await route.fulfill({ status: 200 });
    });

    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await page.getByRole('button', { name: 'New variant' }).click();
    await page.getByRole('textbox', { name: 'Variant name' }).fill('body_copy_newlines');
    await page.getByRole('button', { name: 'Create variant' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await page.getByRole('heading', { name: 'BODY_COPY_NEWLINES' }).click();

    const bodyCopy = page.locator('#RTE-paragraphs .ProseMirror').last();
    await expect(bodyCopy).toBeVisible();
    await bodyCopy.fill('First body line');
    await bodyCopy.press('End');
    await bodyCopy.press('Enter');
    await bodyCopy.type('Second body line');

    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith('/frontend/epic-tests/test/update') &&
          response.request().method() === 'POST',
      ),
      page.getByRole('button', { name: 'Save test' }).click(),
    ]);

    expect(submittedParagraphs).toEqual(['First body line', 'Second body line']);
  });
});
