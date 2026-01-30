import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';

function App() {
  // Przechowujemy ustawienia w pamięci przeglądarki (LocalStorage), 
  // aby nie znikały po odświeżeniu (F5)
  const [darkMode, setDarkMode] = useState(localStorage.getItem('dark') === 'true');
  const [fontSize, setFontSize] = useState(Number(localStorage.getItem('fontSize')) || 14);

  // Dynamiczne tworzenie motywu na podstawie stanu
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#1976d2' },
    },
    typography: {
      fontSize: fontSize,
    },
  }), [darkMode, fontSize]);

  // Funkcje zapisujące ustawienia przy każdej zmianie
  const handleSetDarkMode = (val) => {
    setDarkMode(val);
    localStorage.setItem('dark', val);
  };

  const handleSetFontSize = (val) => {
    setFontSize(val);
    localStorage.setItem('fontSize', val);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={
            <Dashboard 
              darkMode={darkMode} 
              setDarkMode={handleSetDarkMode} 
              fontSize={fontSize} 
              setFontSize={handleSetFontSize} 
            />
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;