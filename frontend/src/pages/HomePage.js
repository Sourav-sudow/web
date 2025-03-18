import React, { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Link,
} from '@mui/material';
import { 
  Face, 
  Assessment, 
  Fingerprint,
  Security,
  Speed,
  CloudDone,
  KeyboardArrowDown,
} from '@mui/icons-material';

// Import animation library
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const heroRef = useRef(null);
  
  // Initialize animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // Changed to false to allow animations to occur every time element scrolls into view
      easing: 'ease-out',
      mirror: true, // Animations will trigger each time the element comes into view
      offset: 120,
    });
    
    // Refresh AOS when window is resized
    window.addEventListener('resize', () => {
      AOS.refresh();
    });
    
    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, []);
  
  // Parallax effect for hero section
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        const heroElement = heroRef.current;
        const translateY = scrollPosition * 0.4; // Adjust the parallax speed
        
        // Apply parallax effect to hero background
        heroElement.style.backgroundPosition = `center ${translateY}px`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ 
      background: '#121212',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Full-Screen Hero Section with Gradient Background */}
      <Box
        ref={heroRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          background: 'linear-gradient(135deg, #1a237e 0%, #311b92 50%, #0d47a1 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientAnimation 15s ease infinite',
          '@keyframes gradientAnimation': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          overflow: 'hidden',
        }}
      >
        {/* Animated particles */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          {[...Array(20)].map((_, index) => (
            <Box
              key={index}
              sx={{
                position: 'absolute',
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `floatParticle ${Math.random() * 10 + 10}s linear infinite`,
                '@keyframes floatParticle': {
                  '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
                  '50%': { opacity: 0.8 },
                  '100%': { transform: `translateY(-${Math.random() * 1000}px) rotate(360deg)`, opacity: 0 },
                },
              }}
            />
          ))}
        </Box>
        
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} data-aos="fade-right" data-aos-duration="1200">
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  lineHeight: 1.1,
                  mb: 2,
                  textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(90deg, #ffffff 0%, #4fc3f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'textShine 3s ease-in-out infinite alternate',
                  '@keyframes textShine': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '100% 50%' },
                  },
                  backgroundSize: '200% auto',
                }}
              >
                Automatic Attendance System
              </Typography>
              <Typography 
                variant="h5" 
                paragraph
                sx={{ 
                  fontWeight: 500,
                  mb: 3,
                  opacity: 0.95,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  letterSpacing: '0.5px',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  animation: 'fadeInUp 1s ease-out',
                  '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                Using Face Recognition Technology
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  mb: 4,
                  fontSize: '1.25rem',
                  lineHeight: 1.7,
                  maxWidth: '90%',
                  opacity: 0.9,
                  animation: 'fadeInUp 1.2s ease-out',
                }}
              >
                Our system provides a seamless, contactless way to mark attendance using advanced face recognition technology.
                Say goodbye to traditional attendance methods and embrace the future.
              </Typography>
              <Box 
                sx={{ 
                  mt: 5, 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 3,
                  animation: 'fadeInUp 1.4s ease-out',
                }}
              >
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{ 
                    py: 2,
                    px: 6,
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    boxShadow: '0 8px 20px rgba(245, 0, 87, 0.3)',
                    background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
                    borderRadius: '50px',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 12px 25px rgba(245, 0, 87, 0.4)',
                      background: 'linear-gradient(45deg, #f50057 30%, #ff5c8d 90%)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Started
                </Button>
                <Button
                  onClick={scrollToFeatures}
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ 
                    py: 2,
                    px: 6,
                    fontSize: '1.25rem',
                    fontWeight: 500,
                    borderWidth: 2,
                    borderRadius: '50px',
                    backdropFilter: 'blur(5px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      borderWidth: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-4px) scale(1.05)',
                      boxShadow: '0 8px 15px rgba(255, 255, 255, 0.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Learn More
                </Button>
              </Box>
              
              {/* Scroll down indicator */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 8,
                  cursor: 'pointer',
                  animation: 'bounce 2s infinite',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-20px)' },
                    '60%': { transform: 'translateY(-10px)' },
                  },
                }}
                onClick={scrollToFeatures}
              >
                <KeyboardArrowDown sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} data-aos="fade-left" data-aos-duration="1200" data-aos-delay="200">
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <img
                  src="https://limton.com.pk/wp-content/uploads/2021/12/long-range-face-2.jpg"
                  alt="Face Recognition Illustration"
                  style={{
                    width: '100%',
                    maxWidth: '550px',
                    borderRadius: '16px',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                    transform: 'perspective(1000px) rotateY(-5deg)',
                    transition: 'all 0.5s ease',
                  }}
                />
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    backdropFilter: 'blur(5px)',
                    top: '-50px',
                    right: '10%',
                    zIndex: -1,
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    backdropFilter: 'blur(5px)',
                    bottom: '-30px',
                    left: '15%',
                    zIndex: -1,
                    animation: 'float2 8s ease-in-out infinite',
                    '@keyframes float2': {
                      '0%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(20px)' },
                      '100%': { transform: 'translateY(0px)' },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section with Parallax Scrolling Effects */}
      <Box 
        id="features-section" 
        sx={{ 
          py: { xs: 10, md: 14 }, 
          position: 'relative',
          zIndex: 1,
          background: 'rgba(18, 18, 18, 0.7)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }} data-aos="fade-up" data-aos-duration="1000">
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2.25rem', md: '2.75rem' },
                background: 'linear-gradient(45deg, #3f51b5, #4fc3f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Key Features
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.15rem',
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              Our attendance system combines cutting-edge technology with user-friendly interfaces
              to provide the most efficient attendance tracking solution.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              {
                icon: <Face sx={{ fontSize: 45 }} />,
                title: "Face Recognition",
                description: "Advanced face recognition algorithms ensure accurate identification of students and staff.",
                color: "primary",
                delay: 100,
                animation: "fade-right"
              },
              {
                icon: <Security sx={{ fontSize: 45 }} />,
                title: "Liveness Detection",
                description: "Prevent spoofing attempts with our sophisticated liveness detection technology.",
                color: "secondary",
                delay: 200,
                animation: "fade-up"
              },
              {
                icon: <Assessment sx={{ fontSize: 45 }} />,
                title: "Detailed Reports",
                description: "Generate comprehensive attendance reports and analytics with just a few clicks.",
                color: "success",
                delay: 300,
                animation: "fade-left"
              },
              {
                icon: <Speed sx={{ fontSize: 45 }} />,
                title: "Real-time Processing",
                description: "Mark attendance in real-time with our fast and efficient processing system.",
                color: "info",
                delay: 400,
                animation: "fade-right"
              },
              {
                icon: <Fingerprint sx={{ fontSize: 45 }} />,
                title: "Biometric Security",
                description: "Ensure the highest level of security with our advanced biometric verification.",
                color: "warning",
                delay: 500,
                animation: "fade-up"
              },
              {
                icon: <CloudDone sx={{ fontSize: 45 }} />,
                title: "Cloud Integration",
                description: "Access your attendance data from anywhere with our secure cloud storage.",
                color: "error",
                delay: 600,
                animation: "fade-left"
              }
            ].map((feature, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={index} 
                data-aos={feature.animation} 
                data-aos-delay={feature.delay}
                data-aos-duration="800"
                data-aos-anchor-placement="top-bottom"
              >
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    p: 1,
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(16px)',
                    backgroundColor: 'rgba(30, 30, 30, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                      backgroundColor: 'rgba(40, 40, 40, 0.7)',
                    },
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        backgroundColor: `${feature.color}.dark`,
                        color: 'white',
                        mb: 3,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.05rem', flex: 1 }}>
                      {feature.description}
                    </Typography>
                    
                    {/* Decorative element */}
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${theme.palette[feature.color].dark}22, ${theme.palette[feature.color].main}11)`,
                        bottom: '-70px',
                        right: '-70px',
                        zIndex: 0,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action with Parallax Effect */}
      <Box 
        sx={{ 
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(135deg, rgba(245, 0, 87, 0.8) 0%, rgba(245, 0, 87, 0.6) 100%)',
          backdropFilter: 'blur(10px)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
          zIndex: 1,
        }}
        data-aos="fade-up"
        data-aos-duration="1200"
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="1" fill-rule="evenodd"/%3E%3C/svg%3E")',
            animation: 'backgroundMove 30s linear infinite',
          }}
        />
        
        <Container maxWidth="md">
          <Box 
            sx={{ position: 'relative', zIndex: 1 }}
            data-aos="zoom-in"
            data-aos-duration="1000"
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.75rem' },
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Ready to modernize your attendance system?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 6,
                fontWeight: 400,
                opacity: 0.95,
                maxWidth: '800px',
                mx: 'auto',
                fontSize: '1.25rem',
                lineHeight: 1.6,
              }}
            >
              Join hundreds of institutions that have already transformed their attendance process.
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{ 
                py: 2.5,
                px: 8,
                fontSize: '1.25rem',
                fontWeight: 600,
                backgroundColor: 'white',
                color: 'secondary.main',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                background: 'linear-gradient(45deg, #ffffff, #f5f5f5)',
                borderRadius: '50px',
                '&:hover': {
                  backgroundColor: 'white',
                  transform: 'translateY(-5px) scale(1.05)',
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
