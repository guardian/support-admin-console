import { expect, test } from '@playwright/test';

test.describe('Generator and Utility Tools', () => {
  test('Bookmarklets page renders draggable/clickable bookmarklet links', async ({ page }) => {
    // 1. Navigate to /bookmarklets
    await page.goto('/bookmarklets');

    // expect: Page lists one or more bookmarklet tools with instructions and a
    // draggable link (typically javascript: href)
    const bookmarkletLink = page
      .locator('a[href^="javascript:"]')
      .filter({ hasText: 'Show me the epic!' })
      .first();
    await bookmarkletLink.scrollIntoViewIfNeeded();
    await expect(bookmarkletLink).toBeVisible();

    // 2. Inspect a bookmarklet link's href attribute
    const href = await bookmarkletLink.getAttribute('href');
    // expect: Href begins with 'javascript:' and contains non-empty script content
    expect(href).toMatch(/^javascript:/);
    expect(href!.length).toBeGreaterThan('javascript:'.length);
  });
});
