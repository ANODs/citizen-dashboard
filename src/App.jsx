import React from 'react';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, useMediaQuery } from "@mui/material";
import theme from "./theme.js";
import Dashboard from "./pages/Dashboard";
import CitizenList from "./pages/CitizenList";
import CitizenDetails from "./pages/CitizenDetails";
import Documentation from './pages/Documentation';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation';

function App() {
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
          <Navigation />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              ...(isMobile 
                ? { pb: 7 } // Add bottom padding on mobile to account for navigation
                : { pl: 8 } // Add left padding on desktop to account for navigation
              ),
              transition: 'padding 0.3s ease',
              backgroundColor: theme.palette.background.default,
              minHeight: '100vh',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/citizens" element={<CitizenList />} />
              <Route path="/citizens/:id" element={<CitizenDetails />} />
              <Route path="/documentation" element={<Documentation />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;