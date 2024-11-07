import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Dashboard as DashboardIcon, Person as PersonIcon, Info as InfoIcon } from '@mui/icons-material';

const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const navigationItems = [
    { icon: <DashboardIcon />, text: 'Дашборд', path: '/' },
    { icon: <PersonIcon />, text: 'Граждане', path: '/citizens' },
    { icon: <InfoIcon />, text: 'Документация', path: '/documentation' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <Box
      component="nav"
      sx={{
        width: isMobile ? '100%' : 60,
        height: isMobile ? 'auto' : '100vh',
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        left: 0,
        bottom: isMobile ? 0 : 'auto',
        top: isMobile ? 'auto' : 0,
        zIndex: 1200,
        transition: 'width 0.3s ease',
        display: 'flex',
        justifyContent: isMobile ? 'space-around' : 'flex-start',
        alignItems: isMobile ? 'center' : 'flex-start',
        flexDirection: isMobile ? 'row' : 'column',
        paddingTop: isMobile ? 0 : 2,
        borderRadius: isMobile ? `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0` : 0,
      }}
    >
      <List sx={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: isMobile ? 'row' : 'column',
        alignItems: isMobile ? 'center' : 'center',
        justifyContent: isMobile ? 'space-around' : 'flex-start',
      }}>
        {navigationItems.map((item, index) => (
          <ListItem
            key={index}
            component={Link}
            to={item.path}
            sx={{
              justifyContent: 'center',
              px: isMobile ? 2 : 1,
              py: isMobile ? 1.5 : 2,
              color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.primary,
              width: 'auto',
              backgroundColor: isActive(item.path) ? theme.palette.background.highlight : 'transparent',
              borderRadius: theme.shape.borderRadius,
            }}
          >
            <Tooltip title={item.text} placement={isMobile ? "top" : "right"} arrow={!isMobile}>
              <ListItemIcon 
                sx={{ 
                  minWidth: 0, 
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Navigation;