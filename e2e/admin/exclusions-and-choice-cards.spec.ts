import { expect, test } from '@playwright/test';

test.describe('Admin and Access Management', () => {
  test('Channel Exclusions and Default Choice Cards pages load', async ({ page }) => {
    // 1. Navigate to /exclusions
    await page.goto('/exclusions');
    // expect: Page renders a list/form for configuring channel exclusions without errors
    await expect(page.getByRole('heading', { name: 'Exclusions' })).toBeVisible();
    await expect(page.getByText('Add epic rule')).toBeVisible();

    // 2. Navigate to /default-choice-cards
    await page.goto('/default-choice-cards');
    // expect: Page renders default choice card configuration without errors
    await expect(page.getByRole('heading', { name: 'Default Choice Cards' })).toBeVisible();
    await expect(page.getByText('Configure global default choice cards.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
  });

  test('Default Choice Cards can add, edit, and remove cards while preserving benefit copy', async ({
    page,
  }) => {
    type SavedSettings = {
      epic: {
        Default?: {
          choiceCards: Array<{
            pill?: { copy: string };
            benefits: Array<{ copy: string }>;
          }>;
        };
      };
    };
    let savedSettings: SavedSettings | undefined;

    await page.route('**/frontend/default-choice-cards/update', async (route) => {
      const requestBody = route.request().postDataJSON() as {
        value: SavedSettings;
      };
      savedSettings = requestBody.value;
      await route.fulfill({ status: 200 });
    });

    await page.goto('/default-choice-cards');
    await expect(page.getByRole('heading', { name: 'Default Choice Cards' })).toBeVisible();

    await page
      .getByRole('button', { name: /Recurring Contribution - Monthly/ })
      .first()
      .click();
    const expandedCard = page.getByRole('region').first();
    await expandedCard.getByRole('textbox', { name: 'Pill Copy (optional)' }).fill('Edited pill');

    const benefitEditor = expandedCard.locator('#RTE-benefit-0 .ProseMirror');
    await benefitEditor.click();
    await benefitEditor.press('End');
    await expandedCard.getByRole('button', { name: 'Currency', exact: true }).last().click();
    await benefitEditor.press('Enter');
    await benefitEditor.type('Follow-up paragraph');
    const addCardRegion = page
      .getByRole('heading', { name: 'EUR Countries' })
      .first()
      .locator('xpath=../../..');
    const addCardButton = addCardRegion.getByRole('button', { name: 'Add choice card' });
    const regionDeleteButtons = addCardRegion.getByRole('button', { name: 'Delete', exact: true });
    const initialDeleteCount = await regionDeleteButtons.count();
    await addCardButton.click();
    await expect(regionDeleteButtons).toHaveCount(initialDeleteCount + 1);
    await regionDeleteButtons.last().click();
    await expect(regionDeleteButtons).toHaveCount(initialDeleteCount);

    const saveRequest = page.waitForRequest(
      (request) =>
        request.url().endsWith('/frontend/default-choice-cards/update') &&
        request.method() === 'POST',
    );
    await page.getByRole('button', { name: 'Save changes' }).click();
    await saveRequest;
    const choiceCards = savedSettings?.epic.Default?.choiceCards;

    expect(choiceCards).toBeDefined();
    expect(choiceCards?.[0].pill?.copy).toBe('Edited pill');
    expect(choiceCards?.[0].benefits[0].copy).toContain('%%CURRENCY_SYMBOL%%');
    expect(savedSettings?.epic.Default?.choiceCards[0].benefits[0].copy).toContain(
      'Follow-up paragraph',
    );
  });
});
