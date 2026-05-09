import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';

test('użytkownik może zarządzać listą używając POM', async ({ page }) => {
  // Inicjalizacja klasy strony
  const todoPage = new TodoPage(page);

  // Wykonywanie akcji
  await todoPage.goto();
  await todoPage.addTodo('Kupić mleko');
  await todoPage.addTodo('Nauczyć się wzorca POM');

  // Asercje - test decyduje co sprawdzamy, używając lokatorów z POM
  await expect(todoPage.todoItems).toHaveText([
    'Kupić mleko',
    'Nauczyć się wzorca POM'
  ]);

  await todoPage.removeTodo('Kupić mleko');

  await expect(todoPage.todoItems).toHaveText([
    'Nauczyć się wzorca POM'
  ]);
});

// Zadanie domowe z Lab 4
test('użytkownik może oznaczyć zadanie jako wykonane przez POM', async ({ page }) => {
  const todoPage = new TodoPage(page);

  await todoPage.goto();
  await todoPage.addTodo('Zadanie testowe POM');
  
  // Oznaczenie zadania jako wykonane używając nowej metody
  await todoPage.markAsCompleted('Zadanie testowe POM');

  // Weryfikacja czy zadanie dostało odpowiednią klasę completed
  const todoItem = page.getByTestId('todo-item').filter({ hasText: 'Zadanie testowe POM' });
  await expect(todoItem).toHaveClass(/completed/);
});
