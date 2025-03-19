// frontend/src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Calculate as CalculateIcon,
  EcoOutlined as EcoIcon,
  Person as PersonIcon,
} from '@material-ui/icons';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/' },
    { text: 'Calculator', icon: <CalculateIcon />, link: '/calculator' },
    { text: 'Recommendations', icon: <EcoIcon />, link: '/recommendations' },
    { text: 'Profile', icon: <PersonIcon />, link: '/profile' },
  ];

  const drawer = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.link}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            GreenPrint
          </Link>
        </Typography>
        
        {!isMobile && (
          <div>
            {menuItems.map((item) => (
              <Button 
                key={item.text} 
                color="inherit" 
                component={Link} 
                to={item.link}
                startIcon={item.icon}
              >
                {item.text}
              </Button>
            ))}
          </div>
        )}
        
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
      </Toolbar>
      
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header;