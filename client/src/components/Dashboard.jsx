import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import getDashboardTheme from './panel/theme/getDashboardTheme';
import AppNavbar from './panel/AppNavbar';
import Header from './panel/Header';
import SideMenu from './panel/SideMenu';
import TemplateFrame from './TemplateFrame';
import UsersTable from './panel/UsersTable';
import MainGrid from './panel/MainGrid';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [mode, setMode] = useState('light');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // Nuevo estado
  const navigate = useNavigate();

  const dashboardTheme = createTheme(getDashboardTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirige al login si no hay token
    }
  }, [navigate]);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme(prev => !prev);
  };

  const handleMenuClick = (view) => {
    setCurrentView(view); // Cambia el estado según el menú clicado
  };

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <SideMenu onMenuClick={handleMenuClick} /> {/* Pasa la función al menú */}
          <AppNavbar />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 10,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header />
              {/* Renderiza el componente según el estado currentView */}
              {currentView === 'dashboard' && <MainGrid />}
              {currentView === 'usuarios' && <UsersTable />}
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </TemplateFrame>
  );
}
