import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  useTheme,
  useMediaQuery,
  Link
} from '@mui/material';

const sections = [
  'Введение',
  'Страницы приложения',
  'Функциональность',
  'Работа с API',
  'База данных и генерация данных',
  'CI/CD и хостинг',
  'Репозитории'
];

export default function Documentation() {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery('(min-width:1920px)');
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const offset = 100; // Adjust this value based on your layout

      let currentSection = '';
      Object.entries(sectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop - offset <= scrollPosition) {
          currentSection = id;
        }
      });

      if (currentSection !== activeSection) {
        console.log('Active section changed:', currentSection);
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial active section

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  const Section = ({ title, children }) => {
    const id = title.toLowerCase().replace(/ /g, '-');
    return (
      <Box 
        ref={el => sectionRefs.current[id] = el} 
        id={id} 
        sx={{ mb: 4, scrollMarginTop: '100px' }}
      >
        <Paper elevation={3} sx={{ p: 3, backgroundColor: 'background.paper' }}>
          <Typography variant="h5" component="h2" gutterBottom color="primary" sx={{ mb: 2 }}>
            {title}
          </Typography>
          {children}
        </Paper>
      </Box>
    );
  };

  const ContentItem = ({ title, items }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom color="text.secondary">
        {title}
      </Typography>
      <List dense>
        {items.map((item, index) => (
          <ListItem key={index} sx={{ pl: 0 }}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const TableOfContents = () => (
    <Box
      sx={{
        position: 'fixed',
        top: theme.spacing(4),
        right: theme.spacing(4),
        width: '250px',
        backgroundColor: 'transparent',
        p: 2,
        borderRadius: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Содержание
      </Typography>
      <List>
        {sections.map((section) => {
          const sectionId = section.toLowerCase().replace(/ /g, '-');
          return (
            <ListItem
              key={sectionId}
              component="a"
              href={`#${sectionId}`}
              onClick={(e) => {
                e.preventDefault();
                console.log('Clicked on section:', sectionId);
                document.getElementById(sectionId)?.scrollIntoView({
                  behavior: 'smooth'
                });
              }}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                opacity: activeSection === sectionId ? 1 : 0.6,
                '&:hover': {
                  opacity: 1,
                },
              }}
            >
              <ListItemText primary={section} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 300, color: 'text.primary', mb: 4 }}>
          Документация
        </Typography>

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: '1 1 auto', mr: isLargeScreen ? 4 : 0 }}>
          <Section title="Введение">
            <Typography variant="body1" paragraph>
              "Гражданский Дашборд" - это веб-приложение для управления и анализа данных о гражданах. Оно предоставляет удобный интерфейс для просмотра статистики и поиска информации о гражданах.
            </Typography>
          </Section>

          <Section title="Страницы приложения">
            <ContentItem 
              title="Главная страница (Дашборд)"
              items={[
                "Средний возраст (мужчины/женщины)",
                "Распределение по полу",
                "Распределение по уровню образования",
                "Распределение по семейному положению",
                "Средняя зарплата",
                "Среднее количество детей",
                "Распределение по гражданству"
              ]}
            />
            <ContentItem 
              title="Список граждан"
              items={["ФИО", "Дата рождения", "Адрес"]}
            />
            <ContentItem 
              title="Детальная информация о гражданине"
              items={[
                "Основная информация", "Семья и личная жизнь", "Образование и карьера",
                "Навыки и интересы", "Физические характеристики", "Здоровье",
                "Дополнительная информация", "Документы", "Финансы",
                "Социальная информация", "Социальные сети и онлайн-присутствие",
                "Предпочтения", "Достижения", "Социальная поддержка", "Военный учет",
                "Заграничные поездки", "Навыки и увлечения", "Связи",
                "Медицинская информация", "Биометрические данные", "Идентификация", "Личное"
              ]}
            />
          </Section>

          <Section title="Функциональность">
            <ContentItem 
              title="Поиск граждан"
              items={["Доступен на странице списка граждан", "Позволяет фильтровать по различным параметрам"]}
            />
            <ContentItem 
              title="Пагинация"
              items={["Используется для навигации по большим спискам данных"]}
            />
            <ContentItem 
              title="Расширенный поиск"
              items={["Позволяет уточнить критерии поиска граждан"]}
            />
          </Section>

          <Section title="Работа с API">
            <Typography variant="body1" paragraph>
              Приложение использует следующие основные API-эндпоинты:
            </Typography>
            <List>
              {[
                "GET /api/citizens/slice/:start/:end - получение среза списка граждан",
                "POST /api/citizens/search - поиск граждан по заданным критериям",
                "GET /api/statistics - получение общей статистики",
                "GET /api/citizens/:id - получение детальной информации о конкретном гражданине"
              ].map((item, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Section>

          <Section title="База данных и генерация данных">
            <Typography variant="body1" paragraph>
              В качестве системы управления базами данных для проекта используется PostgreSQL. PostgreSQL - это мощная, открытая объектно-реляционная система баз данных, которая использует и расширяет язык SQL в сочетании со многими функциями, которые безопасно хранят и масштабируют самые сложные рабочие нагрузки данных.
            </Typography>
            <Typography variant="body1" paragraph>
              Для наполнения базы данных тестовыми данными был разработан специальный скрипт генерации. Этот скрипт создал 100,000 записей пользователей со следующими характеристиками:
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Случайно генерируемые ФИО, соответствующие реальным русским именам и фамилиям" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Случайные даты рождения в диапазоне от 18 до 80 лет" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Случайно выбранные адреса из списка реальных адресов российских городов" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Случайно назначенные уровни образования, семейное положение, зарплаты и другие атрибуты" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Генерация связанных данных, таких как информация о семье, карьере, здоровье и т.д." />
              </ListItem>
            </List>
            <Typography variant="body1" paragraph>
              Скрипт использует библиотеку Faker для генерации реалистичных данных и оптимизирован для быстрой вставки большого количества записей в базу данных PostgreSQL. Это позволяет создать репрезентативный набор данных для тестирования производительности и функциональности приложения в условиях, близких к реальным.
            </Typography>
          </Section>

          <Section title="CI/CD и хостинг">
            <Typography variant="body1" paragraph>
              Для непрерывной интеграции и развертывания (CI/CD) в проекте используется Dokploy. Dokploy - это стабильное и простое в использовании решение для развертывания, разработанное для упрощения процесса управления приложениями. Его можно рассматривать как бесплатную альтернативу самостоятельно размещаемому решению таким платформам, как Heroku, Vercel и Netlify.
            </Typography>
            <Typography variant="body1" paragraph>
              Хостинг приложения осуществляется на платформе timeweb. Timeweb предоставляет надежную инфраструктуру для размещения веб-приложений, обеспечивая высокую доступность и производительность.
            </Typography>
          </Section>

          <Section title="Репозитории">
            <Typography variant="body1" paragraph>
              Ниже представлены ссылки на репозитории проекта:
            </Typography>
            <List>
              {[
                { name: "Фронтенд 'Гражданский Дашборд'", url: "https://github.com/ANODs/citizen-dashboard/tree/main" },
                { name: "Бэкенд 'Гражданский Дашборд'", url: "https://github.com/ANODs/citizen-server" },
              ].map((repo, index) => (
                <ListItem key={index} sx={{ pl: 0 }}>
                  <ListItemText 
                    primary={
                      <Link href={repo.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                        {repo.name}
                      </Link>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Section>
        </Box>
        {isLargeScreen && (
          <TableOfContents />
        )}
      </Box>
    </Container>
  );
}