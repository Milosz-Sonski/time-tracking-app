import { test, expect } from '@playwright/test';

test('debugowanie za pomocą page.pause()', async ({ page }) => {
  await page.goto('/todomvc');
  const input = page.getByPlaceholder('What needs to be done?');
  await input.fill('Debugowanie Playwrighta');
  await input.press('Enter');
  await expect(page.getByTestId('todo-title')).toContainText('Debugowanie Playwrighta');
});