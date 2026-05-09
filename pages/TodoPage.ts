import { type Locator, type Page } from '@playwright/test';

export class TodoPage {
  // 1. Definicja typów dla lokatorów
  readonly page: Page;
  readonly todoInput: Locator;
  readonly todoItems: Locator;

  constructor(page: Page) {
    this.page = page;
    // 2. Inicjalizacja lokatorów w konstruktorze
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-title');
  }

  // 3. Metody reprezentujące akcje użytkownika
  async goto() {
    await this.page.goto('/todomvc');
  }

  async addTodo(text: string) {
    await this.todoInput.fill(text);
    await this.todoInput.press('Enter');
  }

  async removeTodo(text: string) {
    const todo = this.page.getByTestId('todo-item').filter({ hasText: text });
    await todo.hover(); // Przycisk usuwania pojawia się po najechaniu
    await todo.getByRole('button', { name: 'Delete' }).click();
  }

  // Zadanie domowe z Lab 4
  async markAsCompleted(text: string) {
    const todo = this.page.getByTestId('todo-item').filter({ hasText: text });
    await todo.locator('.toggle').check();
  }
}
