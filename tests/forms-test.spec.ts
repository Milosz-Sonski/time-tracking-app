import { test, expect } from '@playwright/test';

test('Zaawansowana walidacja formularza', async ({ page }) => {
  // 1. Nawigacja
  await page.goto('/todomvc');

  // 2. Przykład asercji miękkiej
  await expect.soft(page).toHaveTitle(/TodoMVC/);
  await expect.soft(page.getByRole('heading')).toHaveText('todos');

  // 3. Obsługa interakcji (Checkbox i Edycja)
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Zadanie do edycji');
  await input.press('Enter');

  const todoItem = page.getByTestId('todo-item').first();

  // Edycja przez dwukrotne kliknięcie (dblclick)
  await todoItem.dblclick();
  const editInput = todoItem.locator('.edit');
  await editInput.fill('Zadanie poprawione');
  await editInput.press('Enter');

  // 4. Sprawdzenie wyniku
  await expect(page.getByTestId('todo-item').first()).toHaveText('Zadanie poprawione');
});

// Zadanie domowe z Lab 3
test('Asercje miękkie widoczności filtrów', async ({ page }) => {
  await page.goto('/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');
  
  // Dodanie 5 zadań
  for (let i = 1; i <= 5; i++) {
    await input.fill(`Zadanie ${i}`);
    await input.press('Enter');
  }

  // Sprawdzenie widoczności przycisków filtrów używając asercji miękkich
  await expect.soft(page.getByRole('link', { name: 'All' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Active' })).toBeVisible();
  await expect.soft(page.getByRole('link', { name: 'Completed' })).toBeVisible();
});
