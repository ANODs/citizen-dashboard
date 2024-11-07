import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, useTheme, useMediaQuery, CircularProgress, Alert, Stack, Paper, Skeleton } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { getStatistics } from '../services/api';

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
      } catch (err) {
        console.error('Ошибка при загрузке статистики:', err);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processDistributionData = (distribution) => {
    return Object.entries(distribution)
      .map(([key, value]) => ({ name: key, value }))
      .sort((a, b) => b.value - a.value);
  };

  const getTop20Citizenships = () => {
    if (!statistics?.citizenship_distribution) return [];
    return processDistributionData(statistics.citizenship_distribution)
      .slice(0, 20);
  };

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#a4de6c', '#d0ed57', '#ffc658', '#ff7300',
    '#8dd1e1', '#ff6b6b', '#6b8e23', '#9467bd', '#c71585',
    '#17becf', '#b22222', '#32cd32', '#ff69b4', '#4169e1'
  ];

  const CustomLabel = (props) => {
    const { x, y, width, height, value, name } = props;
    return (
      <text
        x={x + width + 5}
        y={y + height / 2}
        fill={theme.palette.text.primary}
        textAnchor="start"
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}`}
      </text>
    );
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const genderData = statistics ? processDistributionData(statistics.gender_distribution) : [];
  const educationData = statistics ? processDistributionData(statistics.education_distribution) : [];
  const citizenshipData = statistics ? getTop20Citizenships() : [];

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh'}}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, color: 'text.primary', mb: 4 }}>
          Панель управления
        </Typography>
        <Stack spacing={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Распределение по гражданству (Топ 20)
            </Typography>
            {loading ? (
              <Skeleton variant="rectangular" width="100%" height={600} />
            ) : (
              <ResponsiveContainer width="100%" height={600}>
                <BarChart 
                  data={citizenshipData} 
                  layout="vertical" 
                  margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
                  barSize={30}
                >
                  <XAxis type="number" />
                  <YAxis type="category" hide />
                  <Bar 
                    dataKey="value" 
                    label={<CustomLabel />}
                  >
                    {citizenshipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Распределение по уровню образования
              </Typography>
              {loading ? (
                <Skeleton variant="circular" width={400} height={400} />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={educationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {educationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Paper>

            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Распределение по полу
              </Typography>
              {loading ? (
                <Skeleton variant="circular" width={400} height={400} />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Paper>
          </Stack>

          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Общая информация
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {['Средняя зарплата', 'Среднее количество детей', 'Средний возраст (мужчины)', 'Средний возраст (женщины)'].map((item, index) => (
                <Box key={index} sx={{ flex: '1 1 200px', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {item}
                  </Typography>
                  {loading ? (
                    <Skeleton variant="text" width={100} height={32} />
                  ) : (
                    <Typography variant="h6">
                      {index === 0 && statistics.avg_salary.toFixed(2) + ' ₽'}
                      {index === 1 && statistics.avg_children_count.toFixed(2)}
                      {index === 2 && statistics.avg_age_male.toFixed(2) + ' лет'}
                      {index === 3 && statistics.avg_age_female.toFixed(2) + ' лет'}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}

export default Dashboard;