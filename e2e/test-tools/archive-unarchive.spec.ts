import { expect, test } from '@playwright/test';

test.describe('Test/Campaign CRUD Tools (Epic, Header, Banner, Campaigns, etc.)', () => {
  test('Archive and unarchive a test', async ({ page }) => {
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().endsWith('/frontend/epic-tests') && response.ok(),
      ),
      page.goto('/epic-tests'),
    ]);

    // 1. Create a new e2e test artifact, enter edit mode, and click 'Archive test'
    const testName = `ZZZ_E2E_ARCHIVE_TEST_${Date.now()}`;
    const nickname = `ZZZ E2E Archive Test ${Date.now()}`;
    await page.getByRole('button', { name: 'Create a new test' }).click();
    await page.getByRole('textbox', { name: 'Full test name' }).fill(testName);
    await page.getByRole('textbox', { name: 'Nickname' }).fill(nickname);
    await page.getByRole('button', { name: 'Create test' }).click();
    await expect(page.getByRole('button', { name: 'Save test' })).toBeVisible();

    // Save the test so it exists persistently before it can be archived
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/frontend/epic-tests/test/create') && response.ok(),
      ),
      page.getByRole('button', { name: 'Save test' }).click(),
    ]);
    await expect(page.getByRole('button', { name: 'Edit test' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit test' }).click();
    await page.getByRole('button', { name: 'Archive test', exact: true }).click();

    // expect: Confirmation dialog appears; upon confirming, the test disappears from the default list
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Are you sure?' })).toBeVisible();
    await expect(
      dialog.getByText(
        "Archiving this test will remove it from the RRCP - you can only restore it with an engineer's help.",
      ),
    ).toBeVisible();
    await dialog.getByRole('button', { name: 'Archive test' }).click();

    await expect(page.getByRole('button', { name: `Draft ${testName}` })).toHaveCount(0);
    await expect(page.getByRole('button', { name: `Live ${testName}` })).toHaveCount(0);

    // 2. Locate the archived test via any 'show archived' filter/toggle if available
    // expect: Archived test is listed with an 'Archived' status
    // Actual behavior: this application does not expose a self-service 'show archived'
    // filter/toggle - the confirmation dialog explicitly states restoring an archived
    // test requires an engineer's help, so there is no in-app way to view or restore it.
    const archivedToggle = page.getByRole('button', { name: /archived/i });
    await expect(archivedToggle).toHaveCount(0);
  });
});
