import { test, expect } from '@playwright/test';

test.describe('Zarządzanie zadaniami - TodoMVC', () => {

  // Ten blok wykona się przed każdym testem w tej grupie
  test.beforeEach(async ({ page }) => {
    await page.goto('/todomvc');
  });

  test('powinien dodać nowe zadanie', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Kupić mleko');
    await todoInput.press('Enter');

    // Sprawdzenie czy zadanie się pojawiło
    await expect(page.getByTestId('todo-title')).toHaveText('Kupić mleko');
  });

  test('powinien oznaczyć zadanie jako wykonane', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Kupić chleb');
    await todoInput.press('Enter');

    // Kliknięcie w checkbox
    await page.locator('.toggle').first().check();

    // Sprawdzenie czy zadanie jest przekreślone (klasa completed)
    const todoItem = page.locator('.completed');
    await expect(todoItem).toBeVisible();
  });

  test('powinien edytować istniejące zadanie', async ({ page }) => {
    // Najpierw dodajemy dwa zadania
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Zadanie 1');
    await todoInput.press('Enter');
    await todoInput.fill('Zadanie 2');
    await todoInput.press('Enter');

    // Edycja drugiego zadania (nth(1) - indeksowane od 0)
    const secondTodo = page.getByTestId('todo-item').nth(1);
    await secondTodo.dblclick();
    await secondTodo.locator('.edit').fill('Zmienione Zadanie 2');
    await secondTodo.locator('.edit').press('Enter');

    await expect(secondTodo).toHaveText('Zmienione Zadanie 2');
  });

  // Zadanie domowe z Laboratorium 2
  test('powinien wyczyścić ukończone zadania', async ({ page }) => {
    const todoInput = page.getByPlaceholder('What needs to be done?');
    await todoInput.fill('Zadanie 1');
    await todoInput.press('Enter');
    await todoInput.fill('Zadanie 2');
    await todoInput.press('Enter');

    // Oznaczenie pierwszego zadania jako wykonane
    const firstTodo = page.getByTestId('todo-item').first();
    await firstTodo.locator('.toggle').check();

    // Kliknięcie przycisku "Clear completed"
    await page.getByRole('button', { name: 'Clear completed' }).click();

    // Sprawdzenie, czy zadanie wyczyszczone zniknęło, a niezakończone zostało na liście
    await expect(page.getByTestId('todo-item')).toHaveCount(1);
    await expect(page.getByTestId('todo-item')).toHaveText('Zadanie 2');
  });
});
