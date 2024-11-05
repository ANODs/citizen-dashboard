import React from 'react';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import theme from "./theme.js";
import Dashboard from "./pages/Dashboard";
import CitizenList from "./pages/CitizenList";
import CitizenDetails from "./pages/CitizenDetails";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from './components/Navigation';

function App() {
  const theme = useTheme();
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
                ? { pb: 7 }
                : { pl: 8 }
              ),
              transition: 'padding 0.3s ease',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/citizens" element={<CitizenList />} />
              <Route path="/citizens/:id" element={<CitizenDetails />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;