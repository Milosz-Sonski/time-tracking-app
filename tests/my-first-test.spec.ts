import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Sprawdzenie, czy tytuł strony zawiera konkretne słowo
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Kliknięcie w link "Get started"
  await page.getByRole('link', { name: 'Get started' }).click();

  // Sprawdzenie, czy URL zawiera słowo "intro"
  await expect(page).toHaveURL(/.*intro/);
});
