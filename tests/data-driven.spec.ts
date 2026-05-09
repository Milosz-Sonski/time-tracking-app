import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

// 1. Definicja zestawu danych (rozbudowana o pole expectedCount z zadania domowego)
const testCases = [
  { task: 'Kupić chleb', category: 'Zakupy', expectedCount: 1 },
  { task: '📈 Napisać raport', category: 'Praca', expectedCount: 1 },
  { task: '12345 !@#$', category: 'Znaki specjalne', expectedCount: 1 },
];

// 2. Dynamiczne generowanie testów
for (const data of testCases) {
  test(`Test dodawania zadania: ${data.task} (${data.category})`, async ({ page }) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    
    // Użycie wygenerowanych danych
    await todoPage.addTodo(data.task);
    
    // Standardowa weryfikacja dodania zadania
    await expect(page.getByTestId('todo-title')).toContainText(data.task);
    
    // Zadanie domowe - Weryfikacja dokładnej liczby elementów na liście po dodaniu
    await expect(todoPage.todoItems).toHaveCount(data.expectedCount);
  });
}
