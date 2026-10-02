import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

// Must match the googleAuth.redirectUrl host, or the anti-forgery session cookie is lost.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:9000';
const authStatePath = resolve(
  process.env.PLAYWRIGHT_AUTH_STATE ?? 'e2e/.auth/local.json',
);
const applicationOrigin = new URL(baseURL).origin;

if (
  process.platform === 'linux' &&
  !process.env.DISPLAY &&
  !process.env.WAYLAND_DISPLAY
) {
  console.error(
    'Google sign-in needs a visible browser. Run this from a graphical session or configure display forwarding; xvfb-run is hidden and cannot be used for interactive sign-in.',
  );
  process.exit(1);
}

const browser = await chromium.launch({ headless: false });

try {
  const context = await browser.newContext();
  const page = await context.newPage();

  console.info('Complete Google sign-in in the opened browser window.');
  await page.goto(new URL('/loginAction', baseURL).toString());
  await page.waitForURL((url) => url.origin === applicationOrigin, {
    timeout: 5 * 60 * 1000,
  });
  console.info('Google sign-in completed successfully.');
  const response = await page.goto(new URL('/isValid', baseURL).toString());
  const responseBody = await page.locator('body').innerText();
  if (!response?.ok() || responseBody !== 'auth is valid') {
    throw new Error('Google sign-in did not produce a valid RRCP session.');
  }

  await mkdir(dirname(authStatePath), { recursive: true });
  await context.storageState({ path: authStatePath });
  console.info(`Authenticated Playwright state saved to ${authStatePath}`);
} finally {
  await browser.close();
}
