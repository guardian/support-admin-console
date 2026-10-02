// spec: spec/reader-revenue-control-panel.plan.md
// seed: e2e/seed.spec.ts

import { expect, test } from '@playwright/test';
import { getOpenDrawerButton } from './helpers';

const drawerLinks: Array<{ name: string; href: string }> = [
  { name: 'Campaigns', href: '/campaigns' },
  { name: 'Header', href: '/header-tests' },
  { name: 'Epic', href: '/epic-tests' },
  { name: 'Apple News Epic', href: '/apple-news-epic-tests' },
  { name: 'Liveblog Epic', href: '/liveblog-epic-tests' },
  { name: 'Liveblog Gutter', href: '/gutter-liveblog-tests' },
  { name: 'Banner 1', href: '/banner-tests' },
  { name: 'Banner 2', href: '/banner-tests2' },
  { name: 'Banner Design 🎨', href: '/banner-designs' },
  { name: 'Landing Page', href: '/support-landing-page-tests' },
  { name: 'Student Landing Page Offers', href: '/student-landing-page-tests' },
  { name: 'Checkout Nudge', href: '/checkout-nudge-tests' },
  { name: 'Promo Tool', href: '/promo-tool' },
  { name: 'Default Promos', href: '/default-promos' },
  { name: 'One Time Checkout Tests', href: '/one-time-checkout-tests' },
  { name: 'Banner Deploy', href: '/banner-deploy' },
  { name: 'Switches', href: '/switches' },
  { name: 'Channel Switches', href: '/channel-switches' },
  { name: 'App Meter Switches', href: '/apps-metering-switches' },
  { name: 'Channel Exclusions', href: '/exclusions' },
  { name: 'Default Choice Cards', href: '/default-choice-cards' },
  { name: 'Test Audits', href: '/audit-tests' },
  { name: 'Super Mode Dashboard 🦸', href: '/super-mode' },
  { name: 'Link Tracking Builder', href: '/lynx' },
  { name: 'QR Code Generator', href: '/qr-code' },
  { name: 'Bookmarklets', href: '/bookmarklets' },
  { name: 'Access Management', href: '/access-management' },
];

test.describe('Navigation and Layout', () => {
  test('Each navigation link routes to the correct page and updates the header title', async ({
    page,
  }) => {
    // 1. For each internal link in the drawer, click it and read the resulting URL and header <h1> text
    for (const { name, href } of drawerLinks) {
      await page.goto('/');
      await getOpenDrawerButton(page).click();
      await page.getByRole('link', { name, exact: true }).click();

      await expect(page).toHaveURL(href);

      const heading = page.getByRole('banner').getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).not.toHaveText('');

      await expect(page.getByRole('main')).toBeVisible();
    }
  });
});
