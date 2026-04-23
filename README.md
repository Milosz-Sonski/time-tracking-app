# ⏳ System Ewidencji Czasu Pracy

> Projekt licencjacki — aplikacja webowa do automatyzacji ewidencji czasu pracy w sektorze MŚP, zgodna z art. 149 Kodeksu Pracy.

---

## 🖥️ Zrzuty ekranu

Aplikacja posiada nowoczesny interfejs z trybem ciemnym, responsywny dashboard i ekran logowania z motywem IT/czas.

---

## 🚀 Technologie

| Warstwa | Technologie |
|---------|-------------|
| **Frontend** | React 19, Material UI (MUI 7), Axios, jsPDF |
| **Backend** | Node.js, Express 5 |
| **Baza danych** | MongoDB Atlas (Mongoose ODM) |
| **Autoryzacja** | Kinde Auth (OAuth 2.0 / OpenID Connect) |
| **E-mail** | Nodemailer (Ethereal — tryb testowy) |
| **Automatyzacja** | node-cron (raporty tygodniowe) |

---

## 📂 Struktura Projektu

```
time-tracking-app/
├── client/                     # Frontend (React)
│   ├── public/
│   │   ├── bg-it-time.png      # Tło strony logowania
│   │   ├── logo.png            # Logo aplikacji (favicon + AppBar)
│   │   └── index.html
│   ├── src/
│   │   ├── App.js              # Routing, autoryzacja Kinde, strona logowania
│   │   └── pages/
│   │       └── Dashboard.js    # Główny widok (pulpit, arkusz, ustawienia)
│   └── .env                    # Konfiguracja Kinde (client)
│
├── server/                     # Backend (Node.js + Express)
│   ├── config/                 # Konfiguracja bazy danych
│   ├── controllers/
│   │   └── timeController.js   # Logika REST API
│   ├── models/
│   │   ├── TimeRecord.js       # Model rejestracji START/STOP
│   │   └── UserSettings.js     # Model ustawień użytkownika
│   ├── routes/
│   │   └── timeRoutes.js       # Definicje endpointów API
│   ├── services/
│   │   └── emailService.js     # Wysyłanie e-maili (Nodemailer)
│   ├── cron/
│   │   └── weeklyReport.js     # Automatyczne raporty tygodniowe
│   ├── middleware/              # Middleware (autoryzacja JWT)
│   ├── server.js               # Punkt wejścia serwera
│   └── .env                    # Konfiguracja (MongoDB, porty)
│
├── start.bat                   # Skrypt uruchamiający całą aplikację
└── README.md
```

---

## 🛠️ Wymagania wstępne

Przed uruchomieniem upewnij się, że masz zainstalowane:

| Narzędzie | Wersja | Sprawdzenie |
|-----------|--------|-------------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | dowolna | `git --version` |

> 💡 Node.js pobierzesz z: https://nodejs.org/

---

## 📦 Instalacja (krok po kroku)

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/Milosz-Sonski/time-tracking-app.git
cd time-tracking-app
```

### 2. Zainstaluj zależności serwera

```bash
cd server
npm install
```

### 3. Skonfiguruj plik `server/.env`

Utwórz plik `server/.env` z następującą zawartością:

```env
MONGO_URI=mongodb+srv://<user>:<haslo>@<cluster>.mongodb.net/ewidencja_db?retryWrites=true&w=majority
KINDE_DOMAIN=https://<twoja-domena>.kinde.com
PORT=5000
NODE_ENV=production
```

> ⚠️ Zastąp `<user>`, `<haslo>` i `<cluster>` własnymi danymi z MongoDB Atlas.
> Ustaw `NODE_ENV=development` jeśli chcesz testować raporty tygodniowe co minutę.

### 4. Zainstaluj zależności klienta

```bash
cd ../client
npm install
```

### 5. Skonfiguruj plik `client/.env`

Utwórz plik `client/.env`:

```env
REACT_APP_KINDE_DOMAIN=https://<twoja-domena>.kinde.com
REACT_APP_KINDE_CLIENT_ID=<twoj-client-id>
```

> Dane uzyskasz po utworzeniu aplikacji na https://kinde.com

---

## ▶️ Uruchomienie

### Sposób 1 — Skrypt `start.bat` (Windows, zalecany)

Kliknij dwukrotnie na plik **`start.bat`** w głównym katalogu projektu.

Skrypt automatycznie:
- ✅ Zamknie stare procesy
- ✅ Uruchomi serwer backend (port 5000)
- ✅ Uruchomi frontend React (port 3000)

### Sposób 2 — Ręcznie (dwa terminale)

**Terminal 1 — Serwer:**
```bash
cd server
node server.js
```

**Terminal 2 — Klient:**
```bash
cd client
npm start
```

### Po uruchomieniu

Otwórz przeglądarkę i wejdź na:

```
http://localhost:3000
```

> ⚠️ **Ważne:** Zawsze uruchamiaj **oba** serwisy (backend + frontend). Nigdy nie uruchamiaj dwóch kopii tego samego — klient musi być na porcie **3000**, żeby Kinde Auth działało poprawnie.

---

## ⚖️ Główne Funkcjonalności

### 📊 Pulpit Sterowniczy
- Rejestracja czasu pracy (START / STOP) z timestampem serwerowym
- Statystyki w czasie rzeczywistym: czas dzisiaj, w tym tygodniu, status
- 5 trybów pracy: stacjonarna, zadaniowa, zdalna, zmianowa, nocna
- Reset czasu pracy

### 📝 Arkusz Zadań
- Wybór daty, działu, zadania i godzin
- Blokada raportowania w święta (dni ustawowo wolne)
- Ostrzeżenie przy raportowaniu w weekendy
- Walidacja limitu 8h i duplikatów
- Tryb zadaniowy (bez ewidencji godzin)

### 📄 Raport PDF
- Generowanie raportu PDF z polskimi znakami (czcionka Roboto)
- Tabela z datami, działami, zadaniami, godzinami i lokalizacją

### ⚙️ Ustawienia
- **Profil:** imię, stanowisko, e-mail do raportów
- **Powiadomienia:**
  - ✉️ E-mail — potwierdzenie po zapisaniu arkusza (Ethereal / SMTP)
  - 🔔 Push — przypomnienie o starcie pracy (po 9:00 w dni robocze)
  - ⏰ Push — alert po 8 godzinach ciągłej pracy
  - 📊 Raporty tygodniowe — automatyczne podsumowanie co piątek o 16:00

### 🌍 Inne
- Dwujęzyczność: Polski / Angielski
- Tryb ciemny / jasny
- Regulacja rozmiaru czcionki
- Autoryzacja OAuth 2.0 (Kinde) z obsługą Google, Apple, Microsoft
- Audit Log zgodny z RODO

---

## 📧 Testowanie e-maili

Aplikacja korzysta z **Ethereal Email** — darmowego serwera testowego SMTP.

1. W **Ustawieniach → Profil** wpisz dowolny e-mail (np. `test@test.com`)
2. W **Powiadomienia** włącz **E-mail** → kliknij **Zapisz Zmiany**
3. Zapisz arkusz zadań
4. W terminalu serwera pojawi się link `Preview URL`
5. Kliknij w link — otworzy się podgląd wysłanego maila

> 💡 W wersji produkcyjnej wystarczy podmienić konfigurację SMTP w `server/services/emailService.js` na prawdziwego dostawcę (Gmail, Outlook, SendGrid).

---

## 🔧 Zmienne środowiskowe

### `server/.env`

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `MONGO_URI` | Connection string do MongoDB Atlas | `mongodb+srv://...` |
| `KINDE_DOMAIN` | Domena Kinde Auth | `https://milsoneq.kinde.com` |
| `PORT` | Port serwera | `5000` |
| `NODE_ENV` | Tryb aplikacji | `production` / `development` |

### `client/.env`

| Zmienna | Opis | Przykład |
|---------|------|---------|
| `REACT_APP_KINDE_DOMAIN` | Domena Kinde | `https://milsoneq.kinde.com` |
| `REACT_APP_KINDE_CLIENT_ID` | Client ID z panelu Kinde | `72b0076f...` |

---

## 📚 API Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/time/register` | Rejestracja START/STOP |
| `GET` | `/api/time/history/:userId` | Historia rejestracji |
| `GET` | `/api/time/stats/:userId` | Statystyki (czas dziś/tydzień) |
| `DELETE` | `/api/time/clear/:userId` | Usunięcie historii |
| `GET` | `/api/time/settings/:userId` | Pobranie ustawień |
| `POST` | `/api/time/settings` | Zapis ustawień |
| `POST` | `/api/time/timesheet` | Zapis arkusza zadań |

---

## 👨‍💻 Autor

**Miłosz Soński** — Praca licencjacka

---

## 📄 Licencja

Projekt akademicki — wszelkie prawa zastrzeżone.