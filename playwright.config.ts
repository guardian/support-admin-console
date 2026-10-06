import { env } from 'node:process';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!env.CI,
  retries: env.CI ? 2 : 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'on-failure' }]],
  use: {
    baseURL: env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:9000',
    storageState: env.PLAYWRIGHT_AUTH_STATE ?? 'e2e/.auth/local.json',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
