import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
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
  TextField,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { getCitizensSlice, searchCitizens } from '../services/api';
import AdvancedSearch from '../components/AdvancedSearch';

function CitizenList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [citizens, setCitizens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    birth_date: '',
    birth_place: '',
    gender: '',
    address: '',
    city: '',
    country: '',
    citizenship: '',
    education_level: '',
    marital_status: '',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const page = parseInt(searchParams.get('page') || '0', 10);
  const rowsPerPage = parseInt(searchParams.get('rowsPerPage') || '10', 10);

  useEffect(() => {
    if (!isSearchActive) {
      fetchCitizens();
    }
  }, [page, rowsPerPage, isSearchActive]);

  const fetchCitizens = async () => {
    try {
      setLoading(true);
      const start = page * rowsPerPage;
      const end = start + rowsPerPage;
      const response = await getCitizensSlice(start, end);
      
      if (response && Array.isArray(response.citizens) && typeof response.totalCount === 'number') {
        setCitizens(response.citizens);
        setTotalCount(response.totalCount);
      } else {
        throw new Error('Получены неверные данные от сервера');
      }
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке граждан:', err);
      setError('Не удалось загрузить список граждан. Пожалуйста, попробуйте позже.');
      setCitizens([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setSearchParams({ page: newPage.toString(), rowsPerPage: rowsPerPage.toString() });
    if (!isSearchActive) {
      fetchCitizens();
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const newPage = Math.floor((page * rowsPerPage) / newRowsPerPage);
    setSearchParams({ page: newPage.toString(), rowsPerPage: newRowsPerPage.toString() });
    if (!isSearchActive) {
      fetchCitizens();
    }
  };

  const handleAdvancedSearch = async (searchFilters) => {
    try {
      setLoading(true);
      const results = await searchCitizens(searchFilters);
      setCitizens(results.citizens);
      setTotalCount(results.totalCount);
      setError(null);
      setIsSearchActive(true);
      setSearchParams({ page: '0', rowsPerPage: rowsPerPage.toString() });
    } catch (err) {
      console.error('Ошибка при расширенном поиске:', err);
      setError('Не удалось выполнить поиск. Пожалуйста, попробуйте позже.');
      setCitizens([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSearch = () => {
    setIsSearchActive(false);
    setLocalSearchQuery('');
    setFilters({
      first_name: '',
      last_name: '',
      middle_name: '',
      birth_date: '',
      birth_place: '',
      gender: '',
      address: '',
      city: '',
      country: '',
      citizenship: '',
      education_level: '',
      marital_status: '',
    });
    setSearchParams({ page: '0', rowsPerPage: rowsPerPage.toString() });
    fetchCitizens();
  };

  const handleLocalSearchChange = (event) => {
    setLocalSearchQuery(event.target.value);
    setSearchParams({ page: '0', rowsPerPage: rowsPerPage.toString() });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredCitizens = useMemo(() => {
    return citizens.filter((citizen) => {
      const searchString = `${citizen.first_name} ${citizen.last_name} ${citizen.address}`.toLowerCase();
      return searchString.includes(localSearchQuery.toLowerCase());
    });
  }, [citizens, localSearchQuery]);

  const paginatedCitizens = useMemo(() => {
    if (isSearchActive && localSearchQuery) {
      const startIndex = page * rowsPerPage;
      return filteredCitizens.slice(startIndex, startIndex + rowsPerPage);
    }
    return citizens;
  }, [isSearchActive, localSearchQuery, filteredCitizens, citizens, page, rowsPerPage]);

  const SkeletonRow = () => (
    <TableRow>
      <TableCell><Skeleton variant="text" width="100%" /></TableCell>
      <TableCell><Skeleton variant="text" width="100%" /></TableCell>
      {!isMobile && <TableCell><Skeleton variant="text" width="100%" /></TableCell>}
      <TableCell><Skeleton variant="rectangular" width={isMobile ? 60 : 100} height={36} /></TableCell>
    </TableRow>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, color: 'text.primary', mb: 4, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
        Список граждан
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <AdvancedSearch filters={filters} onFilterChange={handleFilterChange} onSearch={handleAdvancedSearch} />
      {isSearchActive && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button variant="outlined" onClick={handleResetSearch}>
            Сбросить поиск
          </Button>
        </Box>
      )}
      {isSearchActive && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Локальный поиск"
            variant="outlined"
            value={localSearchQuery}
            onChange={handleLocalSearchChange}
            sx={{ backgroundColor: 'background.paper', borderRadius: (theme) => theme.shape.borderRadius }}
          />
        </Box>
      )}
      <TableContainer component={Paper} sx={{ mt: 4, backgroundColor: 'background.paper', borderRadius: (theme) => theme.shape.borderRadius }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>ФИО</TableCell>
              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>Дата рождения</TableCell>
              {!isMobile && <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>Адрес</TableCell>}
              <TableCell sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <SkeletonRow key={index} />
              ))
            ) : paginatedCitizens.length > 0 ? (
              paginatedCitizens.map((citizen) => (
                <TableRow key={citizen.id}>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>{`${citizen.first_name} ${citizen.last_name}`}</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>{new Date(citizen.birth_date).toLocaleDateString()}</TableCell>
                  {!isMobile && <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } }}>{citizen.address}</TableCell>}
                  <TableCell>
                    <Button 
                      component={Link} 
                      to={`/citizens/${citizen.id}`} 
                      variant="contained" 
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: (theme) => theme.shape.borderRadius,
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                      }}
                    >
                      {isMobile ? 'Подр.' : 'Подробнее'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isMobile ? 3 : 4}>
                  <Alert severity="info">Нет данных для отображения</Alert>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={isSearchActive ? filteredCitizens.length : totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} из ${count}`
        }
        labelRowsPerPage="Строк:"
        sx={{ 
          backgroundColor: 'background.paper', 
          borderRadius: (theme) => `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
          },
          '.MuiTablePagination-select': {
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
          }
        }}
      />
    </Container>
  );
}

export default CitizenList;