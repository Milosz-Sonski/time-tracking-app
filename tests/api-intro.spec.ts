import { test, expect } from '@playwright/test';

test('sprawdzenie dostępności API aplikacji', async ({ request }) => {
  // Wysyłamy żądanie pod /todomvc, baseURL z konfiguracji to https://demo.playwright.dev
  const response = await request.get('/todomvc');
  
  // Weryfikacja kodu statusu 200 OK
  expect(response.ok()).toBeTruthy();
  
  // Pobranie i sprawdzenie nagłówków
  const headers = response.headers();
  expect(headers['content-type']).toContain('text/html');
});
