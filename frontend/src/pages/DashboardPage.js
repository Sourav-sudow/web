import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box, Alert, AlertTitle } from '@mui/material';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import TeacherDashboard from '../components/dashboard/TeacherDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const DashboardPage = ({ user: propUser }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If user is provided as a prop, use it
    if (propUser) {
      setUser(propUser);
      setLoading(false);
      return;
    }

    // Otherwise load user data from localStorage
    const timer = setTimeout(() => {
      try {
        // Try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('Loaded user from localStorage:', parsedUser);
          setUser(parsedUser);
        } else {
          // Fallback to mock data only if no user in localStorage
          console.warn('No user found in localStorage, using mock data');
          const mockUser = {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            role: 'teacher',
          };
          setUser(mockUser);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data. Please try again.');
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [propUser]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    );
  }

  // Handle different name formats from registration vs mock data
  const firstName = user.first_name || user.firstName || (user.name ? user.name.split(' ')[0] : 'User');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Welcome back, {firstName}! Here's your attendance overview.
      </Typography>
      
      {user.role === 'student' && <StudentDashboard user={user} />}
      {user.role === 'teacher' && <TeacherDashboard user={user} />}
      {user.role === 'admin' && <AdminDashboard user={user} />}
      
      {!['student', 'teacher', 'admin'].includes(user.role) && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Unknown User Role</AlertTitle>
          Your user role ({user.role}) is not recognized. Please contact an administrator.
        </Alert>
      )}
    </Container>
  );
};

export default DashboardPage;
