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
  List,
  ListItem,
  ListItemText,
  Divider,
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

  const InfoItem = ({ label, value }) => (
    <ListItem>
      <ListItemText
        primary={<Typography variant="subtitle2" color="text.secondary">{label}</Typography>}
        secondary={
          loading ? (
            <Skeleton variant="text" width="60%" />
          ) : (
            <Typography variant="body1">
              {value !== undefined && value !== null && value !== '' ? value : 'данные отсутствуют'}
            </Typography>
          )
        }
      />
    </ListItem>
  );

  const Section = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Paper elevation={1}>
        <List>{children}</List>
      </Paper>
    </Box>
  );

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
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          {loading ? (
            <Skeleton variant="circular" width={200} height={200} />
          ) : (
            <Avatar
              src={citizen?.profile_photo || '/placeholder.svg'}
              alt={`${citizen?.first_name} ${citizen?.last_name}`}
              sx={{ width: 200, height: 200 }}
            />
          )}
          <Typography variant="h5" align="center">
            {loading ? <Skeleton width={150} /> : `${citizen?.first_name} ${citizen?.last_name}`}
          </Typography>
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Section title="Основная информация">
            <InfoItem label="ФИО" value={`${citizen?.last_name} ${citizen?.first_name} ${citizen?.middle_name}`} />
            <InfoItem label="Дата рождения" value={citizen?.birth_date ? new Date(citizen.birth_date).toLocaleDateString() : undefined} />
            <InfoItem label="Место рождения" value={citizen?.birth_place} />
            <InfoItem label="Пол" value={citizen?.gender} />
            <InfoItem label="Адрес" value={citizen?.address ? `${citizen.address}, ${citizen.city}, ${citizen.country}, ${citizen.postal_code}` : undefined} />
            <InfoItem label="Телефон" value={citizen?.phone_number} />
            <InfoItem label="Email" value={citizen?.email} />
            <InfoItem label="Гражданство" value={citizen?.citizenship} />
            <InfoItem label="Национальность" value={citizen?.nationality} />
          </Section>

          <Section title="Семья и личная жизнь">
            <InfoItem label="Семейное положение" value={citizen?.marital_status} />
            <InfoItem label="Количество детей" value={citizen?.children_count} />
            <InfoItem label="Родной язык" value={citizen?.native_language} />
            <InfoItem label="Дополнительные языки" value={citizen?.additional_languages?.join(', ')} />
          </Section>

          <Section title="Образование и карьера">
            <InfoItem label="Уровень образования" value={citizen?.education_level} />
            <InfoItem label="Учебное заведение" value={citizen?.institution} />
            <InfoItem label="Год выпуска" value={citizen?.graduation_year} />
            <InfoItem label="Специализация" value={citizen?.specialization} />
            <InfoItem label="Ученая степень" value={citizen?.academic_degree} />
            <InfoItem label="Место работы" value={citizen?.workplace} />
            <InfoItem label="Должность" value={citizen?.position} />
            <InfoItem label="Опыт работы" value={citizen?.work_experience ? `${citizen.work_experience} лет` : undefined} />
            <InfoItem label="Зарплата" value={citizen?.salary ? `${citizen.salary} руб.` : undefined} />
          </Section>

          <Section title="Навыки и интересы">
            <InfoItem label="Навыки" value={citizen?.skills?.join(', ')} />
            <InfoItem label="Хобби" value={citizen?.hobbies?.join(', ')} />
            <InfoItem label="Интересы" value={citizen?.interests?.join(', ')} />
          </Section>

          <Section title="Физические характеристики">
            <InfoItem label="Группа крови" value={citizen?.blood_type} />
            <InfoItem label="Рост" value={citizen?.height ? `${citizen.height} см` : undefined} />
            <InfoItem label="Вес" value={citizen?.weight ? `${citizen.weight} кг` : undefined} />
            <InfoItem label="Цвет глаз" value={citizen?.eye_color} />
            <InfoItem label="Цвет волос" value={citizen?.hair_color} />
            <InfoItem label="Размер обуви" value={citizen?.shoe_size} />
            <InfoItem label="Размер одежды" value={citizen?.clothing_size} />
          </Section>

          <Section title="Здоровье">
            <InfoItem label="Аллергии" value={citizen?.allergies?.join(', ')} />
            <InfoItem label="Хронические заболевания" value={citizen?.chronic_diseases?.join(', ')} />
            <InfoItem label="Инвалидность" value={citizen?.disability !== undefined ? (citizen.disability ? 'Да' : 'Нет') : undefined} />
          </Section>

          <Section title="Дополнительная информация">
            <InfoItem label="Военная служба" value={citizen?.military_service !== undefined ? (citizen.military_service ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Водительские права" value={citizen?.driving_license !== undefined ? (citizen.driving_license ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Категории вождения" value={citizen?.driving_categories?.join(', ')} />
            <InfoItem label="Наличие автомобиля" value={citizen?.has_car !== undefined ? (citizen.has_car ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Марка автомобиля" value={citizen?.car_brand} />
            <InfoItem label="Год выпуска автомобиля" value={citizen?.car_year} />
          </Section>

          <Section title="Документы">
            <InfoItem label="Номер паспорта" value={citizen?.passport_number} />
            <InfoItem label="Дата выдачи паспорта" value={citizen?.passport_issue_date ? new Date(citizen.passport_issue_date).toLocaleDateString() : undefined} />
            <InfoItem label="Кем выдан паспорт" value={citizen?.passport_issued_by} />
            <InfoItem label="ИНН" value={citizen?.tax_id} />
            <InfoItem label="Номер социального страхования" value={citizen?.social_security_number} />
            <InfoItem label="Номер медицинской страховки" value={citizen?.medical_insurance_number} />
          </Section>

          <Section title="Финансы">
            <InfoItem label="Банковские реквизиты" value={citizen?.bank_details} />
            <InfoItem label="Кредитный рейтинг" value={citizen?.credit_score} />
          </Section>

          <Section title="Социальная информация">
            <InfoItem label="Судимость" value={citizen?.criminal_record !== undefined ? (citizen.criminal_record ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Политические взгляды" value={citizen?.political_views} />
            <InfoItem label="Религиозные убеждения" value={citizen?.religious_beliefs} />
            <InfoItem label="Членство в организациях" value={citizen?.organization_memberships?.join(', ')} />
          </Section>

          <Section title="Социальные сети и онлайн-присутствие">
            <InfoItem label="Социальные сети" value={citizen?.social_media_links?.join(', ')} />
            <InfoItem label="Никнейм" value={citizen?.nickname} />
            <InfoItem label="Личный сайт" value={citizen?.personal_website} />
            <InfoItem label="Блог" value={citizen?.blog_url} />
            <InfoItem label="YouTube канал" value={citizen?.youtube_channel} />
            <InfoItem label="Spotify плейлист" value={citizen?.spotify_playlist} />
          </Section>

          <Section title="Предпочтения">
            <InfoItem label="Любимая музыка" value={citizen?.favorite_music?.join(', ')} />
            <InfoItem label="Любимые фильмы" value={citizen?.favorite_movies?.join(', ')} />
            <InfoItem label="Любимые книги" value={citizen?.favorite_books?.join(', ')} />
            <InfoItem label="Любимая еда" value={citizen?.favorite_foods?.join(', ')} />
            <InfoItem label="Диетические предпочтения" value={citizen?.dietary_preferences} />
          </Section>

          <Section title="Достижения">
            <InfoItem label="Спортивные достижения" value={citizen?.sports_achievements} />
            <InfoItem label="Награды" value={citizen?.awards?.join(', ')} />
            <InfoItem label="Публикации" value={citizen?.publications?.join(', ')} />
            <InfoItem label="Патенты" value={citizen?.patents?.join(', ')} />
          </Section>

          <Section title="Дополнительно">
            <InfoItem label="Волонтерская деятельность" value={citizen?.volunteer_activities} />
            <InfoItem label="Донор крови" value={citizen?.blood_donor !== undefined ? (citizen.blood_donor ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Знак зодиака" value={citizen?.zodiac_sign} />
            <InfoItem label="Домашние животные" value={citizen?.pets?.join(', ')} />
            <InfoItem label="Любимый цвет" value={citizen?.favorite_color} />
            <InfoItem label="Размер кольца" value={citizen?.ring_size} />
            <InfoItem label="Татуировки" value={citizen?.tattoos !== undefined ? (citizen.tattoos ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Пирсинг" value={citizen?.piercings !== undefined ? (citizen.piercings ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Носит очки" value={citizen?.wears_glasses !== undefined ? (citizen.wears_glasses ? 'Да' : 'Нет') : undefined} />
          </Section>

          <Section title="Социальная поддержка">
            <InfoItem label="Группа инвалидности" value={citizen?.disability_group} />
            <InfoItem label="Льготы" value={citizen?.benefits?.join(', ')} />
            <InfoItem label="Номер пенсионного удостоверения" value={citizen?.pension_certificate} />
            <InfoItem label="Дата выхода на пенсию" value={citizen?.retirement_date ? new Date(citizen.retirement_date).toLocaleDateString() : undefined} />
          </Section>

          <Section title="Военный учет">
            <InfoItem label="Военный билет" value={citizen?.military_id} />
          </Section>

          <Section title="Заграничные поездки">
            <InfoItem label="Загранпаспорт" value={citizen?.foreign_passport !== undefined ? (citizen.foreign_passport ? 'Да' : 'Нет') : undefined} />
            <InfoItem label="Визы" value={citizen?.visa?.join(', ')} />
            <InfoItem label="Посещенные страны" value={citizen?.visited_countries?.join(', ')} />
          </Section>

          <Section title="Навыки и увлечения">
            <InfoItem label="Компьютерные навыки" value={citizen?.computer_skills} />
            <InfoItem label="Музыкальные инструменты" value={citizen?.musical_instruments?.join(', ')} />
            <InfoItem label="Спортивные клубы" value={citizen?.sports_clubs?.join(', ')} />
            <InfoItem label="Пройденные курсы" value={citizen?.training_courses?.join(', ')} />
            <InfoItem label="Сертификаты" value={citizen?.certificates?.join(', ')} />
          </Section>

          <Section title="Связи">
            <InfoItem label="Родители" value={citizen?.parents?.join(', ')} />
            <InfoItem label="Супруг(а)" value={citizen?.spouse} />
            <InfoItem label="Дети" value={citizen?.children?.join(', ')} />
            <InfoItem label="Братья/сестры" value={citizen?.siblings?.join(', ')} />
            <InfoItem label="Бабушки/дедушки" value={citizen?.grandparents?.join(', ')} />
            <InfoItem label="Коллеги" value={citizen?.colleagues?.join(', ')} />
            <InfoItem label="Одноклассники" value={citizen?.classmates?.join(', ')} />
            <InfoItem label="Друзья" value={citizen?.friends?.join(', ')} />
            <InfoItem label="Соседи" value={citizen?.neighbors?.join(', ')} />
            <InfoItem label="Научный руководитель" value={citizen?.scientific_advisor} />
            <InfoItem label="Наставник" value={citizen?.mentor} />
            <InfoItem label="Любимый учитель" value={citizen?.favorite_teacher} />
          </Section>

          <Section title="Медицинская информация">
            <InfoItem label="Медицинская карта" value={citizen?.medical_record} />
            <InfoItem label="Прививки" value={citizen?.vaccinations?.join(', ')} />
            <InfoItem label="Группа здоровья" value={citizen?.health_group} />
            <InfoItem label="Дата последней флюорографии" value={citizen?.last_fluorography_date ? new Date(citizen.last_fluorography_date).toLocaleDateString() : undefined} />
            <InfoItem label="Дата последнего медосмотра" value={citizen?.last_medical_exam_date ? new Date(citizen.last_medical_exam_date).toLocaleDateString() : undefined} />
          </Section>

          <Section title="Биометрические данные">
            <InfoItem label="Отпечатки пальцев" value={citizen?.fingerprints} />
            <InfoItem label="Подпись" value={citizen?.signature} />
            <InfoItem label="Образец почерка" value={citizen?.handwriting_sample} />
            <InfoItem label="Образец голоса" value={citizen?.voice_sample} />
            <InfoItem label="Видео-презентация" value={citizen?.video_presentation} />
          </Section>

          <Section title="Идентификация">
            <InfoItem label="QR-код" value={citizen?.qr_code} />
            <InfoItem label="Штрих-код" value={citizen?.barcode} />
          </Section>

          <Section title="Личное">
            <InfoItem label="Любимое место" value={citizen?.favorite_place} />
            <InfoItem label="Мечта" value={citizen?.dream} />
            <InfoItem label="Жизненное кредо" value={citizen?.life_credo} />
            <InfoItem label="Девиз" value={citizen?.motto} />
            <InfoItem label="Суперспособность" value={citizen?.superpower} />
            <InfoItem label="Страхи" value={citizen?.fears?.join(', ')} />
            <InfoItem label="Фобии" value={citizen?.phobias?.join(', ')} />
            <InfoItem label="Вредные привычки" value={citizen?.bad_habits?.join(', ')} />
            <InfoItem label="Режим сна" value={citizen?.sleep_schedule} />
            <InfoItem label="Предпочитаемый тип отдыха" value={citizen?.preferred_vacation_type} />
            <InfoItem label="Любимый праздник" value={citizen?.favorite_holiday} />
            <InfoItem label="Размер головного убора" value={citizen?.hat_size} />
            <InfoItem label="Любимая шутка" value={citizen?.favorite_joke} />
            <InfoItem label="Любимая цитата" value={citizen?.favorite_quote} />
            <InfoItem label="Кумир" value={citizen?.idol} />
            <InfoItem label="Мотивация" value={citizen?.motivation} />
            <InfoItem label="Цели на год" value={citizen?.yearly_goals?.join(', ')} />
            <InfoItem label="Достижения" value={citizen?.achievements?.join(', ')} />
            <InfoItem label="Неудачи" value={citizen?.failures?.join(', ')} />
            <InfoItem label="Планы на будущее" value={citizen?.future_plans} />
            <InfoItem label="Семейное древо" value={citizen?.family_tree} />
            <InfoItem label="Личный герб" value={citizen?.personal_coat_of_arms} />
            <InfoItem label="Любимый супергерой" value={citizen?.favorite_superhero} />
            <InfoItem label="Любимая игра" value={citizen?.favorite_game} />
            <InfoItem label="Любимый вид спорта" value={citizen?.favorite_sport} />
            <InfoItem label="Предпочитаемый стиль одежды" value={citizen?.preferred_clothing_style} />
          </Section>
        </Box>
      </Box>
    </Container>
  );
}

export default CitizenDetails;