import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Container,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  ExitToApp,
  Person,
  Assignment,
  BarChart,
  Home,
  DeleteForever,
} from '@mui/icons-material';
import { logout } from '../../services/auth.service';
import { toast } from 'react-toastify';

// Updated Navbar component - navigation items only visible when logged in
const Navbar = ({ user, setUser, clearAllAccounts }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElNav(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    // Call the logout service
    logout();
    
    // Clear all user-related data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('token');
    localStorage.removeItem('profileData');
    
    // Reset user state to null
    setUser(null);
    
    // Close the menu
    handleClose();
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Navigate to login page
    navigate('/login');
  };
  
  // Define menu items with auth property to control visibility
  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/', auth: false },
    { text: 'Features', icon: <Assignment />, path: '/#features-section', auth: false },
    { text: 'About', icon: <Person />, path: '/#about-section', auth: false },
    { text: 'Contact', icon: <BarChart />, path: '/#contact-section', auth: false },
  ];
  
  // Filter menu items based on authentication status
  const visibleMenuItems = menuItems.filter(item => !item.auth || (item.auth && user));
  
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div">
          Attendance System
        </Typography>
      </Box>
      <Divider />
      <List>
        {visibleMenuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      {user ? (
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem button component={RouterLink} to="/login">
            <ListItemIcon><Person /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={RouterLink} to="/register">
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary="Register" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  // Get the first letter of the user's name, safely handling undefined values
  const getUserInitial = () => {
    if (user && user.first_name) {
      return user.first_name.charAt(0);
    } else if (user && user.name) {
      return user.name.charAt(0);
    } else if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?'; // Fallback if no name or email is available
  };

  // Handle clear all accounts
  const handleClearAllAccounts = () => {
    if (window.confirm('Are you sure you want to delete all teacher and student accounts? This action cannot be undone.')) {
      clearAllAccounts();
    }
  };

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          backdropFilter: 'blur(10px)',
          background: 'rgba(18, 18, 18, 0.8)',
          color: 'white',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          py: 1,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo and title - desktop */}
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Logo"
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                mr: 1, 
                height: 40,
                boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
                borderRadius: '50%',
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Attendance System
            </Typography>

            {/* Mobile menu icon */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleClose}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {visibleMenuItems.map((item) => (
                  <MenuItem key={item.text} onClick={() => { handleClose(); navigate(item.path); }}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <Typography textAlign="center">{item.text}</Typography>
                  </MenuItem>
                ))}
                
                {user && user.role === 'admin' && (
                  <MenuItem onClick={handleClearAllAccounts}>
                    <ListItemIcon>
                      <DeleteForever color="error" />
                    </ListItemIcon>
                    <Typography textAlign="center" color="error">Clear All Accounts</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>

            {/* Logo and title - mobile */}
            <Box 
              component="img" 
              src="/logo.png" 
              alt="Logo"
              sx={{ 
                display: { xs: 'flex', md: 'none' }, 
                mr: 1, 
                height: 32,
                boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
                borderRadius: '50%',
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Attendance
            </Typography>

            {/* Desktop navigation links */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {visibleMenuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  onClick={handleClose}
                  sx={{ 
                    my: 2, 
                    color: 'white', 
                    display: 'flex',
                    alignItems: 'center',
                    mx: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      textShadow: '0 0 5px rgba(255,255,255,0.7)',
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
              
              {user && user.role === 'admin' && (
                <Button
                  onClick={handleClearAllAccounts}
                  sx={{ 
                    my: 2, 
                    color: 'error.main', 
                    display: 'flex',
                    alignItems: 'center',
                    mx: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      textShadow: '0 0 5px rgba(255,0,0,0.7)',
                    }
                  }}
                  startIcon={<DeleteForever />}
                >
                  Clear All Accounts
                </Button>
              )}
            </Box>

            {/* User authentication buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {user ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    sx={{ 
                      color: 'white',
                      mx: 1,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        textShadow: '0 0 5px rgba(255,255,255,0.7)',
                      }
                    }}
                    startIcon={<Dashboard />}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/profile"
                    sx={{ 
                      color: 'white',
                      mx: 1,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        textShadow: '0 0 5px rgba(255,255,255,0.7)',
                      }
                    }}
                    startIcon={<Person />}
                  >
                    Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    sx={{ 
                      color: 'white',
                      mx: 1,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        textShadow: '0 0 5px rgba(255,255,255,0.7)',
                      }
                    }}
                    startIcon={<ExitToApp />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      color: 'white',
                      mx: 1,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        textShadow: '0 0 5px rgba(255,255,255,0.7)',
                      }
                    }}
                    startIcon={<Person />}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{ 
                      mx: 1,
                      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(255, 105, 135, 0.3)',
                      }
                    }}
                    startIcon={<AccountCircle />}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: '0 16px 16px 0',
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: 'none',
          }
        }}
      >
        <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{
                background: 'linear-gradient(90deg, #ffffff 0%, #4fc3f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700,
              }}
            >
              Attendance System
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <List>
            {visibleMenuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={RouterLink} 
                to={item.path}
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#4fc3f7', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />
          {user ? (
            <List>
              <ListItem 
                button 
                onClick={handleLogout}
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#f44336', minWidth: 40 }}><ExitToApp /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          ) : (
            <List>
              <ListItem 
                button 
                component={RouterLink} 
                to="/login"
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#4fc3f7', minWidth: 40 }}><Person /></ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem 
                button 
                component={RouterLink} 
                to="/register"
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#4fc3f7', minWidth: 40 }}><AccountCircle /></ListItemIcon>
                <ListItemText primary="Register" />
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
