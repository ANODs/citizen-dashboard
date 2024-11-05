import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  CircularProgress, 
  Alert,
} from '@mui/material';
import { getCitizenById } from '../services/api';

function CitizenDetails() {
  const { id } = useParams();
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCitizen = async () => {
      try {
        setLoading(true);
        const data = await getCitizenById(id);
        setCitizen(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching citizen details:', err);
        setError('Не удалось загрузить данные гражданина. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    fetchCitizen();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, color: 'text.primary', mb: 4 }}>
        Информация о гражданине
      </Typography>
      {citizen && (
        <Paper sx={{ p: 3, borderRadius: (theme) => theme.shape.borderRadius, backgroundColor: 'background.paper' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                ФИО
              </Typography>
              <Typography variant="body1">{citizen.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                Дата рождения
              </Typography>
              <Typography variant="body1">
                {new Date(citizen.birth_date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Адрес
              </Typography>
              <Typography variant="body1">{citizen.address}</Typography>
            </Grid>
            {/* Add more fields as needed */}
          </Grid>
        </Paper>
      )}
    </Container>
  );
}

export default CitizenDetails;