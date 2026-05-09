import { test, expect } from '@playwright/test';

test('powinien sprawdzić wygląd strony głównej', async ({ page }) => {
  await page.goto('/todomvc');
  
  // Pierwsze uruchomienie testu stworzy obraz wzorcowy (zakończy się "błędem", co jest normalne)
  // Każde kolejne uruchomienie będzie porównywało aktualny widok do tego wzorca.
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100, // dopuszczalny margines błędu
  });
});

// Zadanie domowe z Lab 7
test('test wizualny listy zadań po dodaniu trzech elementów', async ({ page }) => {
  await page.goto('/todomvc');
  
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Zadanie 1');
  await input.press('Enter');
  await input.fill('Zadanie 2');
  await input.press('Enter');
  await input.fill('Zadanie 3');
  await input.press('Enter');

  // W zadaniu wspomniano o znalezieniu najbardziej stabilnego lokatora dla "Clear completed"
  // za pomocą page.pause(). Oto on:
  const clearCompletedBtn = page.getByRole('button', { name: 'Clear completed' });
  
  // Sprawdzenie wyglądu całej strony, by upewnić się, że lista z 3 elementami wygląda poprawnie
  await expect(page).toHaveScreenshot('todo-list-3-items.png', {
    maxDiffPixels: 100,
  });
});
