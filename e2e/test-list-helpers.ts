import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { expect, Page } from '@playwright/test';

export async function exitReorderModeIfActive(page: Page): Promise<void> {
  const editingBanner = page.getByText('EDITING: tests in priority order');
  const isActive = await editingBanner.isVisible().catch(() => false);
  if (isActive) {
    await page.getByRole('button', { name: 'Save order' }).click();
  }
}

export async function releaseEditModeIfActive(page: Page): Promise<void> {
  const discardButton = page.getByRole('button', { name: 'Discard', exact: true });
  if (await discardButton.isVisible().catch(() => false)) {
    await discardButton.click();
    await expect(page.getByRole('button', { name: 'Edit test', exact: true })).toBeVisible();
  }
}

const E2E_TEST_NAME = 'TEST_E2E';
const E2E_TEST_LOCK_DIR = path.join(os.tmpdir(), 'e2e-test.lock');

export async function acquireTestE2ELock(): Promise<void> {
  const maxWaitMs = 15000;
  const start = Date.now();
  while (Date.now() - start <= maxWaitMs) {
    try {
      fs.mkdirSync(E2E_TEST_LOCK_DIR);
      return;
    } catch (error: unknown) {
      if (
        typeof error !== 'object' ||
        error === null ||
        !('code' in error) ||
        error.code !== 'EEXIST'
      ) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`Timed out waiting to acquire the shared ${E2E_TEST_NAME} lock`);
}

export function releaseTestE2ELock(): void {
  try {
    fs.rmdirSync(E2E_TEST_LOCK_DIR);
  } catch {
    // Already released or never acquired - ignore.
  }
}

export async function ensureTestE2EExists(page: Page): Promise<void> {
  await acquireTestE2ELock();
  try {
    await Promise.all([
      page.waitForResponse(
        (response) => response.url().includes('/frontend/epic-tests') && response.ok(),
      ),
      page.goto('/epic-tests', { waitUntil: 'domcontentloaded' }),
    ]);

    const testRows = page.getByRole('button', {
      name: new RegExp(`^(Draft|Live) ${E2E_TEST_NAME}$`),
    });
    if ((await testRows.count()) === 0) {
      await page.getByRole('button', { name: 'Create a new test' }).click();
      await page.getByRole('textbox', { name: 'Full test name' }).fill(E2E_TEST_NAME);
      await page.getByRole('textbox', { name: 'Nickname' }).fill(E2E_TEST_NAME);
      await page.getByRole('button', { name: 'Create test' }).click();
      await expect(page.getByRole('button', { name: 'Draft TEST_E2E' })).toBeVisible();

      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().includes('/frontend/epic-tests/test/create') && response.ok(),
        ),
        page.getByRole('button', { name: 'Save test' }).click(),
      ]);
    }
    await expect(testRows.first()).toBeVisible();

    await openTestRow(page, E2E_TEST_NAME);
    const controlVariant = page.getByRole('heading', { name: 'CONTROL', exact: true });
    if ((await controlVariant.count()) === 0) {
      await page.getByRole('button', { name: 'Edit test' }).click();
      await page.getByRole('button', { name: 'New variant' }).click();
      await page.getByRole('textbox', { name: 'Variant name' }).fill('CONTROL');
      await page.getByRole('button', { name: 'Create variant' }).click();

      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.url().endsWith('/frontend/epic-tests/test/update') &&
            response.request().method() === 'POST' &&
            response.ok(),
        ),
        page.getByRole('button', { name: 'Save test' }).click(),
      ]);
      await expect(controlVariant).toBeVisible();
    }
  } finally {
    releaseTestE2ELock();
  }
}

export async function openTestRow(page: Page, name: string): Promise<void> {
  // A previous test (in this run, or left over from a previous session)
  // may have left the shared list stuck in reorder mode; clear that first.
  await exitReorderModeIfActive(page);

  const testName = name.replace(/^(Draft|Live) /, '');
  const draftRow = page.getByRole('button', { name: `Draft ${testName}`, exact: true });
  const liveRow = page.getByRole('button', { name: `Live ${testName}`, exact: true });
  await expect(draftRow.or(liveRow).last()).toBeVisible();
  const row = (await draftRow.count()) > 0 ? draftRow.last() : liveRow.last();

  // Activating the row via mouse click can bubble a pointerdown/pointerup
  // pair into the dnd-kit sortable wrapper surrounding it, which registers
  // as a zero-distance drag-and-drop and flips the list into "reorder"
  // editing mode instead of opening the row. Keyboard activation (focus +
  // Enter) triggers the row's onClick without going through the pointer
  // sensor, avoiding that side effect entirely.
  await row.focus();
  await page.keyboard.press('Enter');

  await exitReorderModeIfActive(page);
  await releaseEditModeIfActive(page);
}
