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
  Tabs,
  Tab,
  Chip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { getCitizenById, updateCitizen } from '../services/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`citizen-tabpanel-${index}`}
      aria-labelledby={`citizen-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `citizen-tab-${index}`,
    'aria-controls': `citizen-tabpanel-${index}`,
  };
}

function InfoItem({ label, value, name, loading = false, isEditing, onChange }) {
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
      ) : isEditing ? (
        <TextField
          fullWidth
          name={name}
          value={value || ''}
          onChange={onChange}
          variant="outlined"
          size="small"
        />
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
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCitizen, setEditedCitizen] = useState(null);

  useEffect(() => {
    const fetchCitizen = async () => {
      try {
        setLoading(true);
        const data = await getCitizenById(id);
        setCitizen(data);
        setEditedCitizen(data);
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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCitizen(citizen);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      await updateCitizen(id, editedCitizen);
      setCitizen(editedCitizen);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating citizen details:', err);
      setError('Не удалось обновить данные гражданина. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedCitizen(prev => ({ ...prev, [name]: value }));
  };

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
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        {isEditing ? (
          <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', justifyContent: 'end', top: 16, right: 16 }}>
            <Button onClick={handleSaveChanges} variant="contained" color="primary" sx={{mb:1}}>
              Сохранить
            </Button>
            <Button onClick={handleCancelEdit} variant="outlined" color="secondary">
              Отменить
            </Button>
          </Box>
        ) : (
          <Button 
            onClick={handleEdit} 
            variant="outlined" 
            color="primary"
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            Редактировать
          </Button>
        )}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {loading ? (
            <Skeleton variant="circular" width={120} height={120} />
          ) : (
            <Avatar
              src={editedCitizen?.profile_photo || '/placeholder.svg'}
              alt={`${editedCitizen?.first_name} ${editedCitizen?.last_name}`}
              sx={{ 
                width: 120, 
                height: 120,
                bgcolor: 'primary.light',
                fontSize: '2.5rem'
              }}
            >
              {editedCitizen?.first_name?.[0]}{editedCitizen?.last_name?.[0]}
            </Avatar>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                mb: 2
              }}
            >
              {loading ? (
                <Skeleton width="60%" />
              ) : (
                isEditing ? (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Фамилия"
                      name="last_name"
                      value={editedCitizen?.last_name || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      label="Имя"
                      name="first_name"
                      value={editedCitizen?.first_name || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      label="Отчество"
                      name="middle_name"
                      value={editedCitizen?.middle_name || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                ) : (
                  `${editedCitizen?.last_name} ${editedCitizen?.first_name} ${editedCitizen?.middle_name}`
                )
              )}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {loading ? (
                <>
                  <Skeleton width={150} height={24} />
                  <Skeleton width={150} height={24} />
                  <Skeleton width={150} height={24} />
                </>
              ) : (
                <>
                  <InfoItem 
                    label="Гражданство" 
                    value={editedCitizen?.citizenship} 
                    name="citizenship"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <InfoItem 
                    label="Дата рождения" 
                    value={editedCitizen?.birth_date} 
                    name="birth_date"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                  <InfoItem 
                    label="Место рождения" 
                    value={editedCitizen?.birth_place} 
                    name="birth_place"
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        aria-label="citizen info tabs"
        sx={{
          bgcolor: 'background.subtle',
          '& .MuiTab-root': {
            fontSize: '0.875rem',
            fontWeight: 500,
            minHeight: 48,
            textTransform: 'none',
          },
          '& .MuiTabs-indicator': {
            top: 0,
            bottom: 'auto',
          },
        }}
      >
        <Tab label="Основная информация" {...a11yProps(0)} />
        <Tab label="Дополнительная информация" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Section title="Личная информация">
              <InfoItem label="Отчество" value={editedCitizen?.middle_name} name="middle_name" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Дата рождения" value={editedCitizen?.birth_date} name="birth_date" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Место рождения" value={editedCitizen?.birth_place} name="birth_place" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Пол" value={editedCitizen?.gender} name="gender" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Гражданство" value={editedCitizen?.citizenship} name="citizenship" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Национальность" value={editedCitizen?.nationality} name="nationality" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Родной язык" value={editedCitizen?.native_language} name="native_language" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Дополнительные языки" value={editedCitizen?.additional_languages?.join(', ')} name="additional_languages" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Семья и личная жизнь">
              <InfoItem label="Семейное положение" value={editedCitizen?.marital_status} name="marital_status" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Количество детей" value={editedCitizen?.children_count?.toString()} name="children_count" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Супруг(а)" value={editedCitizen?.spouse} name="spouse" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Дети" value={editedCitizen?.children?.join(', ')} name="children" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Родители" value={editedCitizen?.parents?.join(', ')} name="parents" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Братья/сестры" value={editedCitizen?.siblings?.join(', ')} name="siblings" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Бабушки/дедушки" value={editedCitizen?.grandparents?.join(', ')} name="grandparents" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Образование и карьера">
              <InfoItem label="Уровень образования" value={editedCitizen?.education_level} name="education_level" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Учебное заведение" value={editedCitizen?.institution} name="institution" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Год выпуска" value={editedCitizen?.graduation_year?.toString()} name="graduation_year" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Специализация" value={editedCitizen?.specialization} name="specialization" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Место работы" value={editedCitizen?.workplace} name="workplace" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Должность" value={editedCitizen?.position} name="position" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Опыт работы" value={editedCitizen?.work_experience ? `${editedCitizen.work_experience} лет` : undefined} name="work_experience" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Академическая степень" value={editedCitizen?.academic_degree} name="academic_degree" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Навыки" value={editedCitizen?.skills?.join(', ')} name="skills" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Компьютерные навыки" value={editedCitizen?.computer_skills} name="computer_skills" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Курсы повышения квалификации" value={editedCitizen?.training_courses?.join(', ')} name="training_courses" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Сертификаты" value={editedCitizen?.certificates?.join(', ')} name="certificates" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Section title="Документы">
              <InfoItem label="Номер паспорта" value={editedCitizen?.passport_number} name="passport_number" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Дата выдачи паспорта" value={editedCitizen?.passport_issue_date} name="passport_issue_date" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Кем выдан паспорт" value={editedCitizen?.passport_issued_by} name="passport_issued_by" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="ИНН" value={editedCitizen?.tax_id} name="tax_id" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="СНИЛС" value={editedCitizen?.social_security_number} name="social_security_number" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Загранпаспорт" value={editedCitizen?.foreign_passport ? 'Есть' : 'Нет'} name="foreign_passport" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Водительские права" value={editedCitizen?.driving_license ? 'Есть' : 'Нет'} name="driving_license" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Категории вождения" value={editedCitizen?.driving_categories?.join(', ')} name="driving_categories" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Военный билет" value={editedCitizen?.military_id} name="military_id" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Пенсионное удостоверение" value={editedCitizen?.pension_certificate} name="pension_certificate" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Контактная информация">
              <InfoItem label="Адрес" value={editedCitizen?.address} name="address" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Город" value={editedCitizen?.city} name="city" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Страна" value={editedCitizen?.country} name="country" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Почтовый индекс" value={editedCitizen?.postal_code} name="postal_code" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Телефон" value={editedCitizen?.phone_number} name="phone_number" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Email" value={editedCitizen?.email} name="email" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Личный сайт" value={editedCitizen?.personal_website} name="personal_website" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Блог" value={editedCitizen?.blog_url} name="blog_url" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="YouTube канал" value={editedCitizen?.youtube_channel} name="youtube_channel" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Spotify плейлист" value={editedCitizen?.spotify_playlist} name="spotify_playlist" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Социальные сети" value={editedCitizen?.social_media_links?.join(', ')} name="social_media_links" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Финансы">
              <InfoItem label="Зарплата" value={editedCitizen?.salary ? `${editedCitizen.salary} руб.` : undefined} name="salary" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Банковские реквизиты" value={editedCitizen?.bank_details} name="bank_details" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Кредитный рейтинг" value={editedCitizen?.credit_score?.toString()} name="credit_score" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Номер медицинской страховки" value={editedCitizen?.medical_insurance_number} name="medical_insurance_number" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Дата выхода на пенсию" value={editedCitizen?.retirement_date} name="retirement_date" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Льготы" value={editedCitizen?.benefits?.join(', ')} name="benefits" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>
          </Box>
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Section title="Физические характеристики">
              <InfoItem label="Рост" value={editedCitizen?.height ? `${editedCitizen.height} см` : undefined} name="height" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Вес" value={editedCitizen?.weight ? `${editedCitizen.weight} кг` : undefined} name="weight" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Цвет глаз" value={editedCitizen?.eye_color} name="eye_color" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Цвет волос" value={editedCitizen?.hair_color} name="hair_color" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Размер обуви" value={editedCitizen?.shoe_size?.toString()} name="shoe_size" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Размер одежды" value={editedCitizen?.clothing_size} name="clothing_size" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Размер кольца" value={editedCitizen?.ring_size?.toString()} name="ring_size" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Размер головного убора" value={editedCitizen?.hat_size?.toString()} name="hat_size" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Наличие татуировок" value={editedCitizen?.tattoos ? 'Да' : 'Нет'} name="tattoos" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Наличие пирсинга" value={editedCitizen?.piercings ? 'Да' : 'Нет'} name="piercings" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Носит очки" value={editedCitizen?.wears_glasses ? 'Да' : 'Нет'} name="wears_glasses" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Здоровье">
              <InfoItem label="Группа крови" value={editedCitizen?.blood_type} name="blood_type" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Аллергии" value={editedCitizen?.allergies?.join(', ')} name="allergies" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Хронические заболевания" value={editedCitizen?.chronic_diseases?.join(', ')} name="chronic_diseases" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Инвалидность" value={editedCitizen?.disability ? 'Да' : 'Нет'} name="disability" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Группа инвалидности" value={editedCitizen?.disability_group} name="disability_group" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Группа здоровья" value={editedCitizen?.health_group} name="health_group" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Дата последней флюорографии" value={editedCitizen?.last_fluorography_date} name="last_fluorography_date" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Дата последнего медосмотра" value={editedCitizen?.last_medical_exam_date} name="last_medical_exam_date" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Донор крови" value={editedCitizen?.blood_donor ? 'Да' : 'Нет'} name="blood_donor" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Прививки" value={editedCitizen?.vaccinations?.join(', ')} name="vaccinations" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Военная служба">
              <InfoItem label="Военная служба" value={editedCitizen?.military_service ? 'Да' : 'Нет'} name="military_service" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Военный билет" value={editedCitizen?.military_id} name="military_id" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Путешествия">
              <InfoItem label="Загранпаспорт" value={editedCitizen?.foreign_passport ? 'Есть' : 'Нет'} name="foreign_passport" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Визы" value={editedCitizen?.visa?.join(', ')} name="visa" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Посещенные страны" value={editedCitizen?.visited_countries?.join(', ')} name="visited_countries" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Предпочитаемый тип отдыха" value={editedCitizen?.preferred_vacation_type} name="preferred_vacation_type" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Личные данные">
              <InfoItem label="Фотоальбомы" value={editedCitizen?.photo_albums?.join(', ')} name="photo_albums" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Документы" value={editedCitizen?.documents?.join(', ')} name="documents" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Медицинская карта" value={editedCitizen?.medical_record} name="medical_record" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Отпечатки пальцев" value={editedCitizen?.fingerprints} name="fingerprints" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Подпись" value={editedCitizen?.signature} name="signature" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Образец почерка" value={editedCitizen?.handwriting_sample} name="handwriting_sample" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Образец голоса" value={editedCitizen?.voice_sample} name="voice_sample" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Видео-презентация" value={editedCitizen?.video_presentation} name="video_presentation" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="QR-код" value={editedCitizen?.qr_code} name="qr_code" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Штрих-код" value={editedCitizen?.barcode} name="barcode" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Section title="Личные предпочтения">
              <InfoItem label="Хобби" value={editedCitizen?.hobbies?.join(', ')} name="hobbies" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Интересы" value={editedCitizen?.interests?.join(', ')} name="interests" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимая музыка" value={editedCitizen?.favorite_music?.join(', ')} name="favorite_music" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимые фильмы" value={editedCitizen?.favorite_movies?.join(', ')} name="favorite_movies" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимые книги" value={editedCitizen?.favorite_books?.join(', ')} name="favorite_books" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимая еда" value={editedCitizen?.favorite_foods?.join(', ')} name="favorite_foods" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Диетические предпочтения" value={editedCitizen?.dietary_preferences} name="dietary_preferences" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимый цвет" value={editedCitizen?.favorite_color} name="favorite_color" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимое место" value={editedCitizen?.favorite_place} name="favorite_place" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимый праздник" value={editedCitizen?.favorite_holiday} name="favorite_holiday" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимая шутка" value={editedCitizen?.favorite_joke} name="favorite_joke" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимая цитата" value={editedCitizen?.favorite_quote} name="favorite_quote" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимый супергерой" value={editedCitizen?.favorite_superhero} name="favorite_superhero" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимая игра" value={editedCitizen?.favorite_game} name="favorite_game" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимый вид спорта" value={editedCitizen?.favorite_sport} name="favorite_sport" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Предпочитаемый стиль одежды" value={editedCitizen?.preferred_clothing_style} name="preferred_clothing_style" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Достижения и планы">
              <InfoItem label="Спортивные достижения" value={editedCitizen?.sports_achievements} name="sports_achievements" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Награды" value={editedCitizen?.awards?.join(', ')} name="awards" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Публикации" value={editedCitizen?.publications?.join(', ')} name="publications" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Патенты" value={editedCitizen?.patents?.join(', ')} name="patents" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Волонтерская деятельность" value={editedCitizen?.volunteer_activities} name="volunteer_activities" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Ежегодные цели" value={editedCitizen?.yearly_goals?.join(', ')} name="yearly_goals" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Достижения" value={editedCitizen?.achievements?.join(', ')} name="achievements" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Неудачи" value={editedCitizen?.failures?.join(', ')} name="failures" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Планы на будущее" value={editedCitizen?.future_plans} name="future_plans" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Социальные связи">
              <InfoItem label="Коллеги" value={editedCitizen?.colleagues?.join(', ')} name="colleagues" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Одноклассники" value={editedCitizen?.classmates?.join(', ')} name="classmates" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Друзья" value={editedCitizen?.friends?.join(', ')} name="friends" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Соседи" value={editedCitizen?.neighbors?.join(', ')} name="neighbors" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Личностные характеристики">
              <InfoItem label="Мечта" value={editedCitizen?.dream} name="dream" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Жизненное кредо" value={editedCitizen?.life_credo} name="life_credo" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Девиз" value={editedCitizen?.motto} name="motto" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Суперспособность" value={editedCitizen?.superpower} name="superpower" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Страхи" value={editedCitizen?.fears?.join(', ')} name="fears" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Фобии" value={editedCitizen?.phobias?.join(', ')} name="phobias" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Вредные привычки" value={editedCitizen?.bad_habits?.join(', ')} name="bad_habits" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Режим сна" value={editedCitizen?.sleep_schedule} name="sleep_schedule" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Кумир" value={editedCitizen?.idol} name="idol" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Мотивация" value={editedCitizen?.motivation} name="motivation" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>

            <Section title="Дополнительно">
              <InfoItem label="Политические взгляды" value={editedCitizen?.political_views} name="political_views" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Религиозные убеждения" value={editedCitizen?.religious_beliefs} name="religious_beliefs" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Членство в организациях" value={editedCitizen?.organization_memberships?.join(', ')} name="organization_memberships" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Домашние животные" value={editedCitizen?.pets?.join(', ')} name="pets" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Музыкальные инструменты" value={editedCitizen?.musical_instruments?.join(', ')} name="musical_instruments" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Спортивные клубы" value={editedCitizen?.sports_clubs?.join(', ')} name="sports_clubs" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Семейное древо" value={editedCitizen?.family_tree} name="family_tree" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Личный герб" value={editedCitizen?.personal_coat_of_arms} name="personal_coat_of_arms" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Судимость" value={editedCitizen?.criminal_record ? 'Есть' : 'Нет'} name="criminal_record" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Никнейм" value={editedCitizen?.nickname} name="nickname" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Знак зодиака" value={editedCitizen?.zodiac_sign} name="zodiac_sign" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Научный руководитель" value={editedCitizen?.scientific_advisor} name="scientific_advisor" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Ментор" value={editedCitizen?.mentor} name="mentor" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Любимый учитель" value={editedCitizen?.favorite_teacher} name="favorite_teacher" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
              <InfoItem label="Резюме" value={editedCitizen?.resume} name="resume" loading={loading} isEditing={isEditing} onChange={handleInputChange} />
            </Section>
          </Box>
        </Box>
      </TabPanel>
    </Container>
  );
}

export default CitizenDetails;