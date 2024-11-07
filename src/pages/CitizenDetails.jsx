import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  CircularProgress, 
  Alert,
  Skeleton,
  Avatar,
} from '@mui/material';
import { getCitizenById } from '../services/api';

function InfoItem({ label, value, loading = false }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="caption" 
        component="div" 
        sx={{ 
          color: 'text.secondary',
          mb: 0.5,
          fontSize: '0.875rem'
        }}
      >
        {label}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width="60%" />
      ) : (
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          {value || 'данные отсутствуют'}
        </Typography>
      )}
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: 'primary.main',
          fontWeight: 500,
          mb: 3
        }}
      >
        {title}
      </Typography>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        {children}
      </Paper>
    </Box>
  );
}

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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert 
          severity="error"
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4,
          mb: 4,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Box sx={{ mb: { xs: 3, md: 0 }, mr: { md: 4 }, textAlign: { xs: 'center', md: 'left' } }}>
            {loading ? (
              <Skeleton 
                variant="circular" 
                width={200} 
                height={200} 
                sx={{ mb: 2 }}
              />
            ) : (
              <Avatar
                src={citizen?.profile_photo || '/placeholder.svg'}
                alt={`${citizen?.first_name} ${citizen?.last_name}`}
                sx={{ 
                  width: 200, 
                  height: 200,
                  mb: 2,
                  bgcolor: 'primary.light',
                  fontSize: '4rem'
                }}
              >
                {citizen?.first_name?.[0]}{citizen?.last_name?.[0]}
              </Avatar>
            )}
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                width: '100%'
              }}
            >
              {loading ? (
                <Skeleton width="100%" />
              ) : (
                `${citizen?.first_name}`
              )}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <InfoItem 
                  label="ФИО" 
                  value={`${citizen?.last_name} ${citizen?.first_name} ${citizen?.middle_name}`}
                  loading={loading}
                />
                <InfoItem 
                  label="Дата рождения" 
                  value={citizen?.birth_date ? new Date(citizen.birth_date).toLocaleDateString() : undefined}
                  loading={loading}
                />
                <InfoItem 
                  label="Место рождения" 
                  value={citizen?.birth_place}
                  loading={loading}
                />
                <InfoItem 
                  label="Пол" 
                  value={citizen?.gender}
                  loading={loading}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <InfoItem 
                  label="Адрес" 
                  value={citizen?.address ? `${citizen.address}, ${citizen.city}, ${citizen.country}, ${citizen.postal_code}` : undefined}
                  loading={loading}
                />
                <InfoItem 
                  label="Телефон" 
                  value={citizen?.phone_number}
                  loading={loading}
                />
                <InfoItem 
                  label="Email" 
                  value={citizen?.email}
                  loading={loading}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Box sx={{ width: { xs: '100%', md: '48%' } }}>
          <Section title="Основная информация">
            <InfoItem label="Гражданство" value={citizen?.citizenship} loading={loading} />
            <InfoItem label="Национальность" value={citizen?.nationality} loading={loading} />
          </Section>

          <Section title="Семья и личная жизнь">
            <InfoItem label="Семейное положение" value={citizen?.marital_status} loading={loading} />
            <InfoItem label="Количество детей" value={citizen?.children_count?.toString()} loading={loading} />
            <InfoItem label="Родной язык" value={citizen?.native_language} loading={loading} />
            <InfoItem label="Дополнительные языки" value={citizen?.additional_languages?.join(', ')} loading={loading} />
          </Section>

          <Section title="Образование и карьера">
            <InfoItem label="Уровень образования" value={citizen?.education_level} loading={loading} />
            <InfoItem label="Учебное заведение" value={citizen?.institution} loading={loading} />
            <InfoItem label="Год выпуска" value={citizen?.graduation_year?.toString()} loading={loading} />
            <InfoItem label="Специализация" value={citizen?.specialization} loading={loading} />
            <InfoItem label="Место работы" value={citizen?.workplace} loading={loading} />
            <InfoItem label="Должность" value={citizen?.position} loading={loading} />
            <InfoItem 
              label="Опыт работы" 
              value={citizen?.work_experience ? `${citizen.work_experience} лет` : undefined}
              loading={loading}
            />
          </Section>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '48%' } }}>
          <Section title="Документы">
            <InfoItem label="Номер паспорта" value={citizen?.passport_number} loading={loading} />
            <InfoItem 
              label="Дата выдачи паспорта" 
              value={citizen?.passport_issue_date ? new Date(citizen.passport_issue_date).toLocaleDateString() : undefined}
              loading={loading}
            />
            <InfoItem label="Кем выдан паспорт" value={citizen?.passport_issued_by} loading={loading} />
            <InfoItem label="ИНН" value={citizen?.tax_id} loading={loading} />
            <InfoItem label="СНИЛС" value={citizen?.social_security_number} loading={loading} />
          </Section>

          <Section title="Дополнительная информация">
            <InfoItem 
              label="Водительские права" 
              value={citizen?.driving_license ? 'Есть' : 'Нет'}
              loading={loading}
            />
            <InfoItem label="Категории вождения" value={citizen?.driving_categories?.join(', ')} loading={loading} />
            <InfoItem 
              label="Наличие автомобиля" 
              value={citizen?.has_car ? 'Есть' : 'Нет'}
              loading={loading}
            />
            <InfoItem label="Марка автомобиля" value={citizen?.car_brand} loading={loading} />
          </Section>

          <Section title="Контактная информация">
            <InfoItem label="Дополнительный телефон" value={citizen?.additional_phone} loading={loading} />
            <InfoItem label="Рабочий телефон" value={citizen?.work_phone} loading={loading} />
            <InfoItem label="Дополнительный email" value={citizen?.additional_email} loading={loading} />
            <InfoItem label="Предпочитаемый способ связи" value={citizen?.preferred_contact_method} loading={loading} />
          </Section>
        </Box>
      </Box>
    </Container>
  );
}

export default CitizenDetails;