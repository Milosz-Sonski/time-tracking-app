# Instrukcja obsługi testów Playwright

W tym katalogu znajdują się testy E2E projektu oparte na narzędziu Playwright (Laboratoria 1-7).

## 1. Instalacja zależności

Aby testy działały, upewnij się, że Playwright i jego przeglądarki są zainstalowane w projekcie:

```bash
# Instalacja paczki Playwright jako zależności deweloperskiej
npm install -D @playwright/test

# Pobranie silników przeglądarek używanych przez Playwright
npx playwright install
```

## 2. Pliki testowe

W folderze `tests` znajdziesz kompletny zbiór plików z laboratoriów:
- **`my-first-test.spec.ts`** (Lab 1) - Podstawowe testy weryfikujące tytuł strony domyślnej i nawigację.
- **`advanced-todo.spec.ts`** (Lab 2) - Rozszerzone testy aplikacji TodoMVC z użyciem `describe`, `beforeEach` oraz `first()`.
- **`forms-test.spec.ts`** (Lab 3) - Testy obsługi formularzy, podwójnych kliknięć (edycja) i asercje miękkie (`expect.soft()`).
- **`pom-todo.spec.ts`** (Lab 4) - Testy wykorzystujące wzorzec architektury **Page Object Model (POM)**.
- **`data-driven.spec.ts`** (Lab 6) - Implementacja testów opartych na danych (**Data-Driven Testing - DDT**).
- **`api-intro.spec.ts`** (Lab 6) - Wstęp do komunikacji z API za pomocą Playwright (moduł `request`).
- **`visual.spec.ts`** (Lab 7) - Testy do **Regresji Wizualnej** (Visual Regression). Porównują one wykonany przez bibliotekę zrzut ekranu z uprzednio wygenerowanym wzorcem (`toHaveScreenshot`), używając do tego zadanej tolerancji błędu pikseli.
- **`debug.spec.ts`** (Lab 7) - Plik demonstracyjny do debugowania testów przy pomocy potężnej komendy `page.pause()`. Zatrzymuje ona test w danym momencie i pozwala kontynuować krok po kroku w aplikacji Playwright Inspector.

## 3. Konfiguracja Playwright (playwright.config.ts)

W głównym katalogu projektu znajduje się plik konfiguracyjny z zaawansowanymi ustawieniami:
- Zrównoleglanie i ponawianie (`fullyParallel: true`, `retries: 2`).
- Warunkowe generowanie wideo i Trace Viewera tylko po wystąpieniu błędu.
- Definicja głównego URL (`baseURL: 'https://demo.playwright.dev'`). Umożliwia to pisanie krótkich ścieżek `await page.goto('/todomvc')` we wszystkich testach.
- Zdefiniowane równoległe środowiska wykonawcze ("Projekty"): Chromium, Firefox, WebKit oraz emulacja iPhone'a 12.

## 4. Architektura Page Object Model (POM)

Projekt zawiera główny folder **`pages/`**. Znajduje się tam klasa `TodoPage.ts`, która służy jako "abstrakcja" strony TodoMVC, przez co wewnątrz testów wywoływane są proste metody (np. `todoPage.addTodo()`).

## 5. Uruchamianie testów

- **Uruchomienie wszystkich testów:**
  ```bash
  npx playwright test
  ```

- **Odświeżenie/nadpisanie wzorców zrzutów ekranu w testach wizualnych (Lab 7):**
  Jeśli świadomie zmieniasz wygląd strony, stare testy `visual.spec.ts` przestaną przechodzić. Użyj tej komendy aby wygenerować nowe obrazki wzorcowe:
  ```bash
  npx playwright test --update-snapshots
  ```

- **Uruchomienie testów z włączonym Inspektorem i zatrzymywaniem `page.pause()`:**
  Dodaj flagę `--headed`, aby widzieć przeglądarkę. Wymagane, aby debugowanie zadziałało poprawnie.
  ```bash
  npx playwright test tests/debug.spec.ts --headed
  ```

- **Uruchomienie testów w trybie graficznym (UI Mode):**
  ```bash
  npx playwright test --ui
  ```

## 6. Raporty i Trace Viewer (Czarna skrzynka)

Jeśli test z jakiegoś powodu się nie powiedzie, możesz odpalić komendę wyświetlającą tzw. czarną skrzynkę z nagraniami:
```bash
npx playwright show-report
```
