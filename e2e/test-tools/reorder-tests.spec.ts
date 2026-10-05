import { expect, test } from '@playwright/test';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Reorder test list via drag and drop', async ({ page }) => {
    test.setTimeout(15000);

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

    // 1. Click 'Reorder test list'
    await page.getByRole('button', { name: 'Reorder test list' }).click();
    // expect: List enters a reorderable/drag mode
    await expect(page.getByText('EDITING: tests in priority order')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save order' })).toBeVisible();

    const firstItem = page
      .getByRole('button', { description: /To pick up a draggable item/ })
      .first();
    const secondItem = page
      .getByRole('button', { description: /To pick up a draggable item/ })
      .nth(1);

    const originalFirstName = await firstItem.textContent();
    const originalSecondName = await secondItem.textContent();
    const originalFirstTestName = originalFirstName?.replace(/^(Live|Draft)/, '');
    const originalSecondTestName = originalSecondName?.replace(/^(Live|Draft)/, '');

    // 2. Drag one test above another
    await dragItemTo(secondItem, firstItem);
    // expect: Order visually updates to reflect the new position
    const reorderedFirstName = await page
      .getByRole('button', { description: /To pick up a draggable item/ })
      .first()
      .textContent();
    expect(reorderedFirstName).toBe(originalSecondName);

    // 3. Save the reordering, then reload the page
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/list/reorder') && response.ok(),
        { timeout: 15000 },
      ),
      page.getByRole('button', { name: 'Save order' }).click(),
    ]);
    await page.reload();
    // expect: New order persists after reload
    const persistedFirstItem = page
      .getByRole('button', { name: new RegExp(originalSecondTestName ?? '') })
      .first();
    await expect(persistedFirstItem).toBeVisible();
    const persistedFirstName = await persistedFirstItem.textContent();
    expect(persistedFirstName).toBe(originalSecondName);

    // 4. Restore original order and save again
    await page.getByRole('button', { name: 'Reorder test list' }).click();
    const revertFirstItem = page
      .getByRole('button', { description: /To pick up a draggable item/ })
      .first();
    const revertSecondItem = page
      .getByRole('button', { description: /To pick up a draggable item/ })
      .nth(1);
    await dragItemTo(revertSecondItem, revertFirstItem);
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/list/reorder') && response.ok(),
        { timeout: 15000 },
      ),
      page.getByRole('button', { name: 'Save order' }).click(),
    ]);
    // expect: Original order is restored to avoid disrupting other users' workflows
    await page.reload();
    const restoredFirstItem = page
      .getByRole('button', { name: new RegExp(originalFirstTestName ?? '') })
      .first();
    await expect(restoredFirstItem).toBeVisible();
    const restoredFirstName = await restoredFirstItem.textContent();
    expect(restoredFirstName).toBe(originalFirstName);
  });
});
