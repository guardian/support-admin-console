import { expect, test } from '@playwright/test';

test.describe('Admin and Access Management', () => {
  test('Banner Deploy page renders deployment controls', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. Navigate to /banner-deploy
    await page.goto('/banner-deploy');

    // expect: Page renders deployment status/controls for banner assets without errors
    await expect(page.getByText('Banner 1', { exact: true })).toBeVisible();
    await expect(page.getByText('Banner 2', { exact: true })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Region' }).first()).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Last Manual Deploy (UTC)' }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Redeploy channel 1 in selected regions' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Redeploy channel 2 in selected regions' }),
    ).toBeVisible();
    expect(consoleErrors).toEqual([]);
  });

  test('Variant schedule defaults to all weekdays and saves selected days', async ({ page }) => {
    const manualDeploys = Object.fromEntries(
      ['Australia', 'EuropeanUnion', 'RestOfWorld', 'UnitedKingdom', 'UnitedStates'].map(
        (region) => [region, { timestamp: 0, email: 'operator@example.com' }],
      ),
    );
    let storedDays = [0, 1, 2, 3, 4, 5, 6];
    let storedManualRedeploysByRegion: Record<string, { timestamp: number; email: string }> = {};
    const savedDays: number[][] = [];
    const savedVersions: string[] = [];
    const savedManualRedeploys: Array<Record<string, { timestamp: number; email: string }>> = [];

    await page.route('**/isValid', (route) => route.fulfill({ status: 200 }));
    await page.route('**/frontend/banner-deploy', (route) =>
      route.fulfill({ json: { value: manualDeploys, version: 'manual-v1', email: '' } }),
    );
    await page.route('**/frontend/banner-deploy2', (route) =>
      route.fulfill({ json: { value: manualDeploys, version: 'manual-v1', email: '' } }),
    );
    await page.route('**/frontend/banner-deploy-schedule**', async (route) => {
      if (route.request().method() === 'POST') {
        const requestBody = route.request().postDataJSON() as {
          value: {
            daysOfWeek: number[];
            manualRedeploysByRegion?: Record<string, { timestamp: number; email: string }>;
          };
          version: string;
        };
        storedDays = requestBody.value.daysOfWeek;
        storedManualRedeploysByRegion = requestBody.value.manualRedeploysByRegion ?? {};
        savedDays.push(storedDays);
        savedVersions.push(requestBody.version);
        savedManualRedeploys.push(storedManualRedeploysByRegion);
        await route.fulfill({ status: 200, body: 'updated' });
      } else {
        await route.fulfill({
          json: {
            value: {
              daysOfWeek: storedDays,
              ...(Object.keys(storedManualRedeploysByRegion).length === 0
                ? {}
                : { manualRedeploysByRegion: storedManualRedeploysByRegion }),
            },
            version: 'schedule-v1',
            email: 'operator@example.com',
          },
        });
      }
    });

    await page.goto('/banner-deploy');
    await expect(page.getByRole('heading', { name: 'Variant schedule' })).toBeVisible();
    await expect(
      page.getByText(
        'Reset dismissed Banner 1 for consented Variant users at 9am on selected days.',
      ),
    ).toBeVisible();
    await expect(
      page.getByText(/channel 1 Redeploy button remains for Control and unconsented users\./),
    ).toBeVisible();
    await expect(page.getByText(/Auxia still decides whether to show the banner\./)).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Redeploy Variant Banner 1 in selected regions' }),
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Last Manual Deploy (UTC)' }).last(),
    ).toBeVisible();

    for (const day of [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]) {
      await expect(page.getByRole('checkbox', { name: day })).toBeChecked();
    }

    await page.getByRole('checkbox', { name: 'Sunday' }).uncheck();
    await page.getByRole('checkbox', { name: 'Wednesday' }).uncheck();
    const selectedSave = page.waitForRequest(
      (request) =>
        request.url().endsWith('/frontend/banner-deploy-schedule/update') &&
        request.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Save variant schedule' }).click();
    await selectedSave;
    expect(savedDays[savedDays.length - 1]).toEqual([1, 2, 4, 5, 6]);
    expect(savedVersions[savedVersions.length - 1]).toBe('schedule-v1');

    for (const day of ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday']) {
      await page.getByRole('checkbox', { name: day }).uncheck();
    }
    await expect(page.getByText('Automatic Variant resets are disabled.')).toBeVisible();

    const emptySave = page.waitForRequest(
      (request) =>
        request.url().endsWith('/frontend/banner-deploy-schedule/update') &&
        request.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Save variant schedule' }).click();
    await emptySave;
    expect(savedDays[savedDays.length - 1]).toEqual([]);
    expect(savedVersions[savedVersions.length - 1]).toBe('schedule-v1');

    await page
      .getByRole('table', { name: 'Variant Banner 1 redeploy regions' })
      .getByRole('row', { name: /Australia/ })
      .getByRole('checkbox')
      .check();
    const variantRedeploy = page.waitForRequest(
      (request) =>
        request.url().endsWith('/frontend/banner-deploy-schedule/update') &&
        request.method() === 'POST',
    );
    await page
      .getByRole('button', { name: 'Redeploy Variant Banner 1 in selected regions' })
      .click();
    const redeployRequest = await variantRedeploy;
    const redeployBody = redeployRequest.postDataJSON() as {
      value: {
        manualRedeploysByRegion: Record<string, { timestamp: number; email: string }>;
      };
    };
    expect(savedDays[savedDays.length - 1]).toEqual([]);
    expect(Object.keys(redeployBody.value.manualRedeploysByRegion)).toEqual(['Australia']);
    expect(redeployBody.value.manualRedeploysByRegion.Australia.timestamp).toEqual(
      expect.any(Number),
    );
    expect(redeployBody.value.manualRedeploysByRegion.Australia.email).toBe('operator@example.com');

    const savedAfterRedeploy = page.waitForRequest(
      (request) =>
        request.url().endsWith('/frontend/banner-deploy-schedule/update') &&
        request.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Save variant schedule' }).click();
    await savedAfterRedeploy;
    expect(savedManualRedeploys[savedManualRedeploys.length - 1]).toEqual(
      redeployBody.value.manualRedeploysByRegion,
    );
  });
});
