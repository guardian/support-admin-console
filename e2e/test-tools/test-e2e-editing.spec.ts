import { expect, test } from '@playwright/test';
import {
  acquireTestE2ELock,
  ensureTestE2EExists,
  openTestRow,
  releaseTestE2ELock,
} from '../test-list-helpers';

test.describe('Shared TEST_E2E and test-list state', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(15000);
    await ensureTestE2EExists(page);
    await acquireTestE2ELock();
  });
  test.afterEach(() => {
    releaseTestE2ELock();
  });

  test('Edit an existing draft test and save changes, then revert', async ({ page }) => {
    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    const maxViewsInput = page.getByRole('textbox', { name: 'Maximum view counts' });
    const originalMaxViews = await maxViewsInput.inputValue();
    const updatedMaxViews = originalMaxViews === '6' ? '7' : '6';
    await maxViewsInput.fill(updatedMaxViews);

    await page.getByRole('button', { name: 'Save test' }).click();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();

    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.getByRole('textbox', { name: 'Maximum view counts' })).toHaveValue(
      updatedMaxViews,
    );

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

  test('Edit an existing draft test and discard changes', async ({ page }) => {
    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.getByRole('button', { name: 'Archive test', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save test' })).toBeVisible();

    const maxViewsInput = page.getByRole('textbox', { name: 'Maximum view counts' });
    await maxViewsInput.fill('7');
    await expect(maxViewsInput).toHaveValue('7');

    await page.getByRole('button', { name: 'New variant' }).click();
    await page.getByRole('textbox', { name: 'Variant name' }).fill('v1_e2e_test');
    await page.getByRole('button', { name: 'Create variant' }).click();
    await expect(page.getByRole('heading', { name: 'V1_E2E_TEST' })).toBeVisible();

    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('heading', { name: 'V1_E2E_TEST' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'CONTROL' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Discard' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Save test' })).not.toBeVisible();
  });

  test('Targeting configuration fields behave correctly', async ({ page }) => {
    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    const editButton = page.getByRole('button', { name: 'Edit test' });
    if (await editButton.isVisible()) {
      await editButton.click();
    }
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Target audience' })).toBeVisible();
    const maxViewsCount = page.locator('input[name="maxViewsCount"]');
    const originalMaxViews = await maxViewsCount.inputValue();
    const usRegion = page.getByRole('checkbox', { name: 'United States' });
    const originalUsChecked = await usRegion.isChecked();
    await usRegion.click();
    await expect(usRegion).toBeChecked({ checked: !originalUsChecked });

    await page.getByRole('radio', { name: 'Everyone' }).click();
    await expect(page.getByRole('radio', { name: 'Everyone' })).toBeChecked();
    await expect(page.getByRole('radio', { name: 'Non-supporters' })).not.toBeChecked();
    await expect(page.getByRole('radio', { name: 'Existing supporters' })).not.toBeChecked();

    await page.getByRole('radio', { name: 'Desktop' }).click();
    await expect(page.getByRole('radio', { name: 'Desktop' })).toBeChecked();
    await page.getByRole('radio', { name: 'Signed in' }).click();
    await expect(page.getByRole('radio', { name: 'Signed in' })).toBeChecked();

    await maxViewsCount.fill('6');
    await expect(maxViewsCount).toHaveValue('6');
    await maxViewsCount.fill('-5');
    await expect(maxViewsCount).toHaveValue('-5');
    await expect(maxViewsCount).toHaveAttribute('aria-invalid', 'false');
    await expect(page.getByRole('button', { name: 'Save test' })).toBeEnabled();

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
    await expect(endDate).toHaveAttribute('aria-invalid', 'false');
    await expect(page.getByRole('button', { name: 'Save test' })).toBeEnabled();

    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit test' }).click();
    await expect(page.locator('input[name="maxViewsCount"]')).toHaveValue(originalMaxViews);
    await page.getByRole('button', { name: 'Discard' }).click();
  });

  test('Variant management: add and delete a variant', async ({ page }) => {
    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    const editButton = page.getByRole('button', { name: 'Edit test' });
    if (await editButton.isVisible()) {
      await editButton.click();
    }
    await expect(page.getByRole('button', { name: 'Discard' })).toBeVisible();
    await page.getByRole('button', { name: 'New variant' }).click();
    await page.getByRole('textbox', { name: 'Variant name' }).fill('v1_test');
    await page.getByRole('button', { name: 'Create variant' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(page.getByText('v1_test')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'V1_TEST' })).toBeVisible();

    await page.getByRole('heading', { name: 'CONTROL' }).click();
    await expect(page.getByRole('button', { name: 'Clone variant' })).toHaveCount(1);

    await page.getByRole('button', { name: 'Clone variant' }).first().click();
    await page.getByRole('textbox', { name: 'Variant name' }).fill('v2_clone_test');
    const cloneDialog = page.getByRole('dialog');
    await cloneDialog.getByRole('button', { name: 'Clone variant' }).click();
    await expect(page.getByRole('heading', { name: 'V2_CLONE_TEST' })).toBeVisible();

    const clonedVariantAccordion = page.locator('.MuiAccordion-root', {
      has: page.getByRole('heading', { name: 'V2_CLONE_TEST' }),
    });
    await page.getByRole('heading', { name: 'V2_CLONE_TEST' }).click();
    await clonedVariantAccordion.getByRole('button', { name: 'Delete variant' }).click();
    const confirmDialog = page.getByRole('dialog');
    await expect(confirmDialog.getByText('Are you sure?')).toBeVisible();
    await confirmDialog.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('heading', { name: 'V2_CLONE_TEST' })).not.toBeVisible();

    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('heading', { name: 'V1_TEST' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'CONTROL' })).toBeVisible();
  });
});

test.describe('Shared test-list order', () => {
  test.beforeEach(async () => {
    await acquireTestE2ELock();
  });
  test.afterEach(() => {
    releaseTestE2ELock();
  });

  test('Reorder test list via drag and drop', async ({ page }) => {
    const dragItemTo = async (
      source: ReturnType<typeof page.getByRole>,
      target: ReturnType<typeof page.getByRole>,
    ) => {
      const sourceBox = await source.boundingBox();
      const targetBox = await target.boundingBox();
      if (!sourceBox || !targetBox) {
        throw new Error('Could not determine draggable item bounds');
      }

      await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
        steps: 10,
      });
      await page.mouse.up();
    };

    await page.goto('/epic-tests');
    await page.getByRole('button', { name: 'Reorder test list' }).click();
    await expect(page.getByText('EDITING: tests in priority order')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save order' })).toBeVisible();

    const draggableItems = page.getByRole('button', {
      description: /To pick up a draggable item/,
    });
    const firstItem = draggableItems.first();
    const secondItem = draggableItems.nth(1);
    const originalFirstName = await firstItem.textContent();
    const originalSecondName = await secondItem.textContent();
    const originalFirstTestName = originalFirstName?.replace(/^(Live|Draft)/, '');
    const originalSecondTestName = originalSecondName?.replace(/^(Live|Draft)/, '');

    await dragItemTo(secondItem, firstItem);
    const reorderedFirstName = await draggableItems.first().textContent();
    expect(reorderedFirstName).toBe(originalSecondName);

    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/list/reorder') && response.ok(),
        { timeout: 15000 },
      ),
      page.getByRole('button', { name: 'Save order' }).click(),
    ]);
    await page.reload();
    const persistedFirstItem = page
      .getByRole('button', { name: new RegExp(originalSecondTestName ?? '') })
      .first();
    await expect(persistedFirstItem).toBeVisible();
    expect(await persistedFirstItem.textContent()).toBe(originalSecondName);

    await page.getByRole('button', { name: 'Reorder test list' }).click();
    const revertFirstItem = page
      .getByRole('button', {
        description: /To pick up a draggable item/,
      })
      .first();
    const revertSecondItem = page
      .getByRole('button', {
        description: /To pick up a draggable item/,
      })
      .nth(1);
    await dragItemTo(revertSecondItem, revertFirstItem);
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/list/reorder') && response.ok(),
        { timeout: 15000 },
      ),
      page.getByRole('button', { name: 'Save order' }).click(),
    ]);
    await page.reload();
    const restoredFirstItem = page
      .getByRole('button', { name: new RegExp(originalFirstTestName ?? '') })
      .first();
    await expect(restoredFirstItem).toBeVisible();
    expect(await restoredFirstItem.textContent()).toBe(originalFirstName);
  });
});

test.describe('TEST_E2E supporting workflows', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo.setTimeout(15000);
    await ensureTestE2EExists(page);
    await acquireTestE2ELock();
  });
  test.afterEach(() => {
    releaseTestE2ELock();
  });

  test('Copy test to duplicate configuration', async ({ page }) => {
    const copyName = `ZZZ_E2E_COPY_TEST_DELETE_ME_${Date.now()}`;
    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Copy test' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Name your new test' })).toBeVisible();

    await dialog.getByRole('textbox', { name: 'Full test name' }).fill(copyName);
    await dialog.getByRole('textbox', { name: 'Nickname' }).fill(copyName);
    await dialog.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByRole('button', { name: `Draft ${copyName}` })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'CONTROL' })).toBeVisible();

    await page.getByRole('button', { name: 'Discard' }).click();
    await expect(page.getByRole('button', { name: `Draft ${copyName}` })).not.toBeVisible();
  });

  test('Audit trail shows change history', async ({ page }) => {
    await page.goto('/epic-tests');
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Audit' }).click();

    await expect(page).toHaveURL('/audit-tests/Epic/TEST_E2E');
    await expect(page.getByText('Audit Details for TEST_E2E')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Timestamp' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'User Email' })).toBeVisible();
    await expect(page.getByRole('row').nth(1)).toBeVisible();

    await page.goto('/epic-tests');
    await expect(page).toHaveURL('/epic-tests');
  });

  test('Copy link action copies a shareable URL', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Copy link' }).click();

    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('TEST_E2E');
  });

  test('Create test with duplicate/invalid name is rejected', async ({ page }) => {
    await page.getByRole('button', { name: 'Create a new test' }).click();
    const dialog = page.getByRole('dialog');
    await page.getByRole('button', { name: 'Create test' }).click();
    await expect(
      dialog.getByText('Field cannot be empty - please enter some text').first(),
    ).toBeVisible();

    await page.getByRole('textbox', { name: 'Full test name' }).fill('TEST_E2E');
    await page.getByRole('textbox', { name: 'Nickname' }).fill('TEST_E2E');
    await page.getByRole('button', { name: 'Create test' }).click();
    await expect(
      dialog.getByText('Name already exists - please try another').first(),
    ).toBeVisible();

    await page.getByRole('button', { name: 'close' }).click();
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Create a new test' })).toBeVisible();
  });

  test('Test Audits page shows cross-tool audit history', async ({ page }) => {
    await page.goto('/audit-tests');
    await expect(page.getByRole('columnheader', { name: 'Index' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Timestamp' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'User Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Compare' })).toBeVisible();

    await page.locator('#test-name').fill('TEST_E2E');
    await page.getByLabel('', { exact: true }).click();
    await page.getByRole('option', { name: 'Epic', exact: true }).click();
    await page.getByRole('button', { name: 'Get audit' }).click();

    await expect(page.getByText('Audit Details for TEST_E2E')).toBeVisible();
    const rows = page
      .locator('[role="grid"] [role="row"]')
      .filter({ hasText: /\d{1,2}\/\d{1,2}\/\d{4}/ });
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });
});
