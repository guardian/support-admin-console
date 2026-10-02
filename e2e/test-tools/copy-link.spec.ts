import { expect, test } from '@playwright/test';
import { ensureTestE2EExists, openTestRow } from '../test-list-helpers';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Copy link action copies a shareable URL', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await ensureTestE2EExists(page);

    // 1. Open a test and click 'Copy link'
    await openTestRow(page, 'Draft TEST_E2E');
    await page.getByRole('button', { name: 'Copy link' }).click();

    // expect: Clipboard contents contain a URL referencing the test's id/name
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toContain('TEST_E2E');
  });
});
