import { expect, test } from '@playwright/test';

test.describe('Generator and Utility Tools', () => {
  test('QR Code Generator happy path', async ({ page }) => {
    // 1. Navigate to /qr-code, enter a valid URL and a size, optionally a file name
    await page.goto('/qr-code');
    await page.getByRole('textbox', { name: 'URL' }).fill('https://www.theguardian.com');
    await expect(page.getByRole('textbox', { name: 'Size (in px)' })).toHaveValue('256');

    // expect: 'Download as SVG' button is enabled
    const downloadButton = page.getByRole('button', { name: 'Download as SVG' });
    await expect(downloadButton).toBeEnabled();

    // 2. Click 'Download as SVG'
    const downloadPromise = page.waitForEvent('download');
    await downloadButton.click();
    // expect: An SVG file download is triggered with the specified/default file name
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('qrCode.svg');
  });
});
