import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import axios from 'axios';
import Dashboard from './pages/Dashboard';

// Komponent ustawiający token w Axios
const AxiosInterceptor = ({ getToken, children }) => {
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(async (config) => {
      try {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Błąd pobierania tokenu', err);
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);

  return <>{children}</>;
};

function App() {
  const { login, register, isLoading, isAuthenticated, getToken } = useKindeAuth();

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

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          sx={{
            backgroundImage: 'url(/bg-it-time.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', zIndex: 0 }} />

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={3}
            sx={{
              zIndex: 1,
              backgroundColor: 'rgba(25, 25, 25, 0.4)',
              backdropFilter: 'blur(16px)',
              padding: '50px 70px',
              borderRadius: '24px',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              textAlign: 'center'
            }}
          >
            <Typography variant="h3" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', fontWeight: 800, textShadow: '0 4px 10px rgba(0,0,0,0.3)', letterSpacing: '1px' }}>
              System Ewidencji
            </Typography>
            <Typography variant="subtitle1" sx={{ fontFamily: '"Inter", "Roboto", sans-serif', mb: 2, fontSize: '1.2rem', opacity: 0.9 }}>
              Zaloguj się, aby uzyskać dostęp do aplikacji
            </Typography>
            <Box display="flex" gap={3}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  bgcolor: '#1976d2',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                  '&:hover': { bgcolor: '#1565c0', transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)' },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={login}
              >
                Zaloguj się
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  fontFamily: '"Inter", "Roboto", sans-serif',
                  color: '#ffffff',
                  borderColor: 'rgba(255,255,255,0.5)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={register}
              >
                Zarejestruj się
              </Button>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AxiosInterceptor getToken={getToken}>
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AxiosInterceptor>
    </ThemeProvider>
  );
}

export default App;