// spec: spec/reader-revenue-control-panel.plan.md
// seed: e2e/seed.spec.ts

import { expect, test } from '@playwright/test';
import { getOpenDrawerButton } from './helpers';

test.describe('Navigation and Layout', () => {
  test('Navigation drawer opens and lists all tool sections', async ({ page }) => {
    await page.goto('/');

    // 1. Click the 'open drawer' button in the header
    await getOpenDrawerButton(page).click();
    await expect(page.getByRole('heading', { name: 'Channels' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Support Site' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Admin Console' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Help Centre' })).toBeVisible();

    // 2. Verify all expected links exist under 'Channels'
    const channelLinks: Array<[string, string]> = [
      ['Campaigns', '/campaigns'],
      ['Header', '/header-tests'],
      ['Epic', '/epic-tests'],
      ['Apple News Epic', '/apple-news-epic-tests'],
      ['Liveblog Epic', '/liveblog-epic-tests'],
      ['Liveblog Gutter', '/gutter-liveblog-tests'],
      ['Banner 1', '/banner-tests'],
      ['Banner 2', '/banner-tests2'],
      ['Banner Design 🎨', '/banner-designs'],
    ];
    for (const [name, href] of channelLinks) {
      await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
    }

    // 3. Verify all expected links exist under 'Support Site'
    const supportSiteLinks: Array<[string, string]> = [
      ['Landing Page', '/support-landing-page-tests'],
      ['Student Landing Page Offers', '/student-landing-page-tests'],
      ['Checkout Nudge', '/checkout-nudge-tests'],
      ['Promo Tool', '/promo-tool'],
      ['Default Promos', '/default-promos'],
      ['One Time Checkout Tests', '/one-time-checkout-tests'],
    ];
    for (const [name, href] of supportSiteLinks) {
      await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
    }

    // 4. Verify all expected links exist under 'Admin Console'
    const adminConsoleLinks: Array<[string, string]> = [
      ['Banner Deploy', '/banner-deploy'],
      ['Switches', '/switches'],
      ['Channel Switches', '/channel-switches'],
      ['App Meter Switches', '/apps-metering-switches'],
      ['Channel Exclusions', '/exclusions'],
      ['Default Choice Cards', '/default-choice-cards'],
      ['Test Audits', '/audit-tests'],
      ['Super Mode Dashboard 🦸', '/super-mode'],
      ['Link Tracking Builder', '/lynx'],
      ['QR Code Generator', '/qr-code'],
      ['Bookmarklets', '/bookmarklets'],
      ['Access Management', '/access-management'],
    ];
    for (const [name, href] of adminConsoleLinks) {
      await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
    }

    // 5. Click 'Report an issue' link under 'Help Centre'
    const reportIssueLink = page.getByRole('link', { name: 'Report an issue' });
    await expect(reportIssueLink).toBeVisible();
    await expect(reportIssueLink).toHaveAttribute('href', 'https://forms.gle/Z8Fzn6iw2d9F631n9');
  });
});
