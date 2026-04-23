@echo off
title Time Tracking App - Launcher
echo ========================================
echo   Time Tracking App - Uruchamianie
echo ========================================
echo.

:: Zabij stare procesy node
echo [1/3] Zamykanie starych procesow...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

:: Uruchom serwer w nowym oknie
echo [2/3] Uruchamianie serwera (port 5000)...
start "TimeTracker - Server" cmd /k "cd /d %~dp0server && node server.js"
timeout /t 3 /nobreak >nul

:: Uruchom klienta w nowym oknie
echo [3/3] Uruchamianie klienta (port 3000)...
start "TimeTracker - Client" cmd /k "cd /d %~dp0client && npm start"

echo.
echo ========================================
echo   Gotowe! Aplikacja startuje...
echo   Serwer:  http://localhost:5000
echo   Klient:  http://localhost:3000
echo ========================================
echo.
echo Mozesz zamknac to okno.
pause
