import { Locator, Page } from '@playwright/test';

export function getOpenDrawerButton(page: Page): Locator {
  return page.getByRole('button', { name: 'open drawer' });
}
