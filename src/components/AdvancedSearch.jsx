import React from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const AdvancedSearch = ({ filters, onFilterChange, onSearch }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    if (Object.keys(nonEmptyFilters).length === 0) {
      console.log('No search criteria specified. Search not performed.');
      return;
    }
    
    console.log('Sending search request with filters:', nonEmptyFilters);
    onSearch(nonEmptyFilters);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Расширенный поиск
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Имя"
            name="first_name"
            value={filters.first_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Фамилия"
            name="last_name"
            value={filters.last_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Отчество"
            name="middle_name"
            value={filters.middle_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Дата рождения"
            name="birth_date"
            type="date"
            value={filters.birth_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Место рождения"
            name="birth_place"
            value={filters.birth_place}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Пол</InputLabel>
            <Select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              label="Пол"
            >
              <MenuItem value="male">Мужской</MenuItem>
              <MenuItem value="female">Женский</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Адрес"
            name="address"
            value={filters.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Город"
            name="city"
            value={filters.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Страна"
            name="country"
            value={filters.country}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Гражданство"
            name="citizenship"
            value={filters.citizenship}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Уровень образования</InputLabel>
            <Select
              name="education_level"
              value={filters.education_level}
              onChange={handleChange}
              label="Уровень образования"
            >
              <MenuItem value="Среднее">Среднее</MenuItem>
              <MenuItem value="Среднее специальное">Среднее специальное</MenuItem>
              <MenuItem value="Высшее">Высшее</MenuItem>
              <MenuItem value="Кандидат наук">Кандидат наук</MenuItem>
              <MenuItem value="Доктор наук">Доктор наук</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Семейное положение</InputLabel>
            <Select
              name="marital_status"
              value={filters.marital_status}
              onChange={handleChange}
              label="Семейное положение"
            >
              <MenuItem value="Холост">Холост/Не замужем</MenuItem>
              <MenuItem value="Женат">Женат/Замужем</MenuItem>
              <MenuItem value="Разведен">Разведен(а)</MenuItem>
              <MenuItem value="Вдовец">Вдовец/Вдова</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Поиск
        </Button>
      </Box>
    </Box>
  );
};

export default AdvancedSearch;