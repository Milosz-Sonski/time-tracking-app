# System Ewidencji Czasu Pracy (MERN Stack)

Projekt inżynierski mający na celu automatyzację rozliczania czasu pracy w sektorze MŚP, zapewniający pełną zgodność z art. 149 Kodeksu Pracy.

## 🚀 Technologie
- **Frontend:** React.js, MUI (Material UI), Axios
- **Backend:** Node.js, Express.js
- **Baza danych:** MongoDB (NoSQL)
- **Bezpieczeństwo:** Server-side timestamping, SSL/TLS ready

## 📂 Struktura Projektu
- `/client` - Interfejs użytkownika (React + MUI)
- `/server` - Logika biznesowa i API (Node.js + MongoDB)

## 🛠️ Instalacja i Uruchomienie

### Backend
1. Przejdź do katalogu `server`: `cd server`
2. Zainstaluj zależności: `npm install`
3. Skonfiguruj plik `.env` (MONGO_URI)
4. Uruchom serwer: `node server.js`

### Frontend
1. Przejdź do katalogu `client`: `cd client`
2. Zainstaluj zależności: `npm install`
3. Uruchom aplikację: `npm start`

## ⚖️ Główne Funkcjonalności
- Rejestracja zdarzeń START/STOP z czasem serwerowym (Data Integrity).
- Automatyczne generowanie ścieżki audytowej (Audit Log) dla RODO.
- Intuicyjny Dashboard pracownika wykonany w standardzie Material Design.