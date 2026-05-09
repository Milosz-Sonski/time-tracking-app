import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true, // Uruchamianie testów wewnątrz plików równolegle
  retries: 2,           // Powtórzenie testu 2 razy w razie błędu
  workers: process.env.CI ? 1 : undefined, // Użycie wszystkich dostępnych rdzeni procesora (na CI ograniczamy do 1)
  
  use: {
    baseURL: 'https://demo.playwright.dev',
    trace: 'on-first-retry', // Ślad (Trace) generowany tylko przy pierwszej powtórce
    video: 'on-first-retry', // Wideo nagrywane tylko przy pierwszej powtórce
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Testowanie na urządzeniach mobilnych */
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
