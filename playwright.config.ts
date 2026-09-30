import { env } from 'node:process';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!env.CI,
  retries: env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:9000',
    storageState: env.PLAYWRIGHT_AUTH_STATE ?? 'e2e/.auth/local.json',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
