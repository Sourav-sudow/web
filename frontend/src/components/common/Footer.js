import React from 'react';
import { Box, Container, Typography, Link, Divider, Grid, IconButton, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Email, Facebook, Twitter, Instagram, LinkedIn, KeyboardArrowUp } from '@mui/icons-material';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        px: 2,
        mt: 'auto',
        backgroundColor: '#1a237e', // Darker blue for better contrast
        color: 'white',
        position: 'relative',
      }}
      id="contact-section"
    >
      {/* Scroll to top button */}
      <Box
        sx={{
          position: 'absolute',
          top: -25,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <IconButton
          onClick={scrollToTop}
          sx={{
            backgroundColor: 'white',
            color: 'primary.main',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            '&:hover': {
              backgroundColor: 'white',
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <img 
                src="https://limton.com.pk/wp-content/uploads/2021/12/long-range-face-2.jpg" 
                alt="Logo" 
                style={{ height: '40px', width: '40px', borderRadius: '50%', marginRight: '12px', objectFit: 'cover' }} 
              />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, m: 0 }}>
                Attendance System
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.8 }}>
              Our system provides a seamless, contactless way to mark attendance using advanced face recognition technology.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <IconButton 
                color="inherit" 
                aria-label="Facebook" 
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Twitter" 
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="Instagram" 
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                color="inherit" 
                aria-label="LinkedIn" 
                size="small"
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Quick Links
            </Typography>
            <Stack spacing={2}>
              <Link 
                component={RouterLink} 
                to="/" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  display: 'block',
                  '&:hover': {
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink} 
                to="/login" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  display: 'block',
                  '&:hover': {
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Login
              </Link>
              <Link 
                component={RouterLink} 
                to="/register" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  display: 'block',
                  '&:hover': {
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Register
              </Link>
              <Link 
                component={RouterLink} 
                to="/#features-section" 
                color="inherit" 
                underline="hover"
                sx={{ 
                  display: 'block',
                  '&:hover': {
                    transform: 'translateX(5px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Features
              </Link>
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.8 }}>
              Have questions or feedback? Reach out to us.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Email fontSize="small" />
              <Link 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=souravyadav16a@gmail.com" 
                color="inherit" 
                underline="hover"
                sx={{ fontWeight: 500 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                souravyadav16a@gmail.com
              </Link>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 5, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.8, textAlign: { xs: 'center', sm: 'left' } }}>
            &copy; {new Date().getFullYear()} Automatic Attendance System. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 4, mt: { xs: 3, sm: 0 } }}>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
              Privacy Policy
            </Link>
            <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
