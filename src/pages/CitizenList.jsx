import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { getCitizens } from '../services/api';

function CitizenList() {
  const [citizens, setCitizens] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizens = async () => {
      try {
        setLoading(true);
        const data = await getCitizens();
        setCitizens(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching citizens:', err);
        setError('Не удалось загрузить список граждан. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    fetchCitizens();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCitizens = citizens.filter(
    (citizen) =>
      citizen.name.toLowerCase().includes(filter.toLowerCase()) ||
      citizen.address.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, color: 'text.primary', mb: 4 }}>
        Список граждан
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          label="Фильтр"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ backgroundColor: 'background.paper', borderRadius: (theme) => theme.shape.borderRadius }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', borderRadius: (theme) => theme.shape.borderRadius }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ФИО</TableCell>
              <TableCell>Дата рождения</TableCell>
              <TableCell>Адрес</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCitizens
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((citizen) => (
                <TableRow key={citizen.id}>
                  
                  <TableCell>{citizen.name}</TableCell>
                  <TableCell>{new Date(citizen.birth_date).toLocaleDateString()}</TableCell>
                  <TableCell>{citizen.address}</TableCell>
                  <TableCell>
                    <Button 
                      component={Link} 
                      to={`/citizens/${citizen.id}`} 
                      variant="contained" 
                      color="primary"
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: (theme) => theme.shape.borderRadius,
                      }}
                    >
                      Подробнее
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCitizens.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ backgroundColor: 'background.paper', borderRadius: (theme) => `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px` }}
      />
    </Container>
  );
}

export default CitizenList;