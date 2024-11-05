import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, useTheme, useMediaQuery, CircularProgress, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCitizens } from '../services/api';

function Dashboard() {
  const [citizensData, setCitizensData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCitizens();
        const processedData = processDataForChart(data);
        setCitizensData(processedData);
      } catch (err) {
        console.error('Error fetching citizens data:', err);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processDataForChart = (data) => {
    return data.slice(0, 6).map((citizen, index) => ({
      name: `Гражданин ${index + 1}`,
      value: Math.floor(Math.random() * 1000) 
    }));
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, color: 'text.primary', mb: 4 }}>
        Панель управления
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box 
        display="grid" 
        gridTemplateColumns={isMobile ? "1fr" : "repeat(12, 1fr)"}
        gap={4}
      >
        <Box 
          gridColumn={isMobile ? "1" : "span 8"} 
          sx={{ 
            height: isMobile ? 300 : 400,
            backgroundColor: theme.palette.background.paper,
            p: 3,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 400, color: 'text.secondary' }}>
            Статистика граждан
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={citizensData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              <Bar dataKey="value" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box 
          gridColumn={isMobile ? "1" : "span 4"} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            backgroundColor: theme.palette.background.paper,
            p: 3,
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 400, color: 'text.secondary' }}>
            Общая информация
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 300, color: 'text.primary', my: 2 }}>
            {citizensData.length}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Зарегистрированных граждан
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Dashboard;