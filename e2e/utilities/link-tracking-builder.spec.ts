import { expect, test } from '@playwright/test';

test.describe('Generator and Utility Tools', () => {
  test('Link Tracking Builder (lynx) generates a tracked URL', async ({ page }) => {
    // 1. Navigate to /lynx and fill in the required campaign/source/medium tracking fields
    await page.goto('/lynx');
    await page.getByRole('textbox', { name: 'Campaign' }).fill('e2e_test_campaign');
    await page.getByRole('textbox', { name: 'Creative / utm_content / AB' }).fill('e2e_creative');
    await page.getByRole('textbox', { name: 'Audience segment / utm_term' }).fill('e2e_variant');
    // expect: Form accepts input without errors
    await expect(page.getByRole('textbox', { name: 'Campaign' })).toHaveAttribute(
      'aria-invalid',
      'false',
    );

    // 2. Submit/generate the link
    await page.getByRole('button', { name: 'Build link' }).click();
    // expect: A generated tracked URL is displayed, containing the entered parameter
    // values as query params
    const generatedLink = page.locator('input[disabled]').last();
    await expect(generatedLink).toHaveValue(/utm_campaign=e2e_test_campaign/);
    await expect(generatedLink).toHaveValue(/utm_content=e2e_creative/);
    await expect(generatedLink).toHaveValue(/utm_term=e2e_variant/);

    // 3. Submit the form with required fields left blank
    await page.goto('/lynx');
    await page.getByRole('button', { name: 'Build link' }).click();
    // expect: Validation errors are shown and no link is generated
    await expect(page.getByRole('textbox', { name: 'Campaign' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(
      page.getByRole('textbox', { name: 'Creative / utm_content / AB' }),
    ).toHaveAttribute('aria-invalid', 'true');
    await expect(
      page.getByRole('textbox', { name: 'Audience segment / utm_term' }),
    ).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('input[disabled]')).toHaveCount(0);
  });
});
