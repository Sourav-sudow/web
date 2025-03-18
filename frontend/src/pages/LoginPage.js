import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { login } from '../services/auth.service';
import { toast } from 'react-toastify';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For demo purposes, we'll use a mock login
      // In a real app, you would call your API
      // const userData = await login(formData.username, formData.password);
      
      // Special case for admin login
      if (formData.username.toLowerCase() === 'admin') {
        const adminUser = {
          id: 999,
          first_name: 'Admin',
          last_name: 'User',
          name: 'Admin User',
          email: 'admin@example.com',
          username: 'admin',
          phone: '999-999-9999',
          role: 'admin',
          department: 'Administration',
          last_login: new Date().toISOString(),
        };
        
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        toast.success(`Welcome back, Admin!`);
        navigate('/dashboard');
        setLoading(false);
        return;
      }
      
      // First, check if the user exists in the registration data (from Excel service)
      let existingUserData = null;
      let profileImage = null;
      let userRole = null;
      
      try {
        // Check registration data from Excel service
        const registrationDataJSON = localStorage.getItem('registrationExcelData');
        if (registrationDataJSON) {
          const registrationData = JSON.parse(registrationDataJSON);
          console.log('Registration data:', registrationData);
          
          // Find user by email or username
          const matchingUser = registrationData.find(user => 
            user.email.toLowerCase() === formData.username.toLowerCase() || 
            user.username?.toLowerCase() === formData.username.toLowerCase()
          );
          
          if (matchingUser) {
            console.log('Found user in registration data:', matchingUser);
            userRole = matchingUser.role;
            
            // Create user data from registration data
            existingUserData = {
              id: matchingUser.id,
              first_name: matchingUser.firstName,
              last_name: matchingUser.lastName,
              name: `${matchingUser.firstName} ${matchingUser.lastName}`,
              email: matchingUser.email,
              username: matchingUser.username || matchingUser.email.split('@')[0],
              phone: matchingUser.phone || '123-456-7890',
              role: matchingUser.role,
              department: matchingUser.department || 'Computer Science',
              semester: matchingUser.semester || '1',
              profile_image: matchingUser.profileImage,
              last_login: new Date().toISOString(),
            };
            
            // Store profile image if available
            if (matchingUser.profileImage) {
              profileImage = matchingUser.profileImage;
            }
          }
        }
      } catch (error) {
        console.error('Error checking registration data:', error);
      }
      
      // If not found in registration data, check registered users
      if (!existingUserData) {
        try {
          const registeredUsersJSON = localStorage.getItem('registeredUsers');
          if (registeredUsersJSON) {
            const registeredUsers = JSON.parse(registeredUsersJSON);
            const matchingUser = registeredUsers.find(user => 
              user.email.toLowerCase() === formData.username.toLowerCase() || 
              user.username?.toLowerCase() === formData.username.toLowerCase()
            );
            
            if (matchingUser) {
              userRole = matchingUser.role;
              console.log('Found registered user with role:', userRole);
              
              // Create user data from registered user
              existingUserData = {
                id: matchingUser.id || Date.now(),
                first_name: matchingUser.firstName,
                last_name: matchingUser.lastName,
                name: `${matchingUser.firstName} ${matchingUser.lastName}`,
                email: matchingUser.email,
                username: matchingUser.username || matchingUser.email.split('@')[0],
                phone: matchingUser.phone || '123-456-7890',
                role: matchingUser.role,
                department: matchingUser.department || 'Computer Science',
                semester: matchingUser.semester || '1',
                profile_image: matchingUser.profileImage,
                last_login: new Date().toISOString(),
              };
              
              // Store profile image if available
              if (matchingUser.profileImage) {
                profileImage = matchingUser.profileImage;
              }
            }
          }
        } catch (error) {
          console.error('Error checking registered users:', error);
        }
      }
      
      // If still not found, check managed students list
      if (!existingUserData) {
        try {
          const managedStudentsJSON = localStorage.getItem('managedStudents');
          if (managedStudentsJSON) {
            const managedStudents = JSON.parse(managedStudentsJSON);
            // Check for username match (treating email as username for backward compatibility)
            const matchingStudent = managedStudents.find(student => 
              student.email.toLowerCase() === formData.username.toLowerCase()
            );
            
            if (matchingStudent) {
              userRole = 'student';
              existingUserData = {
                id: matchingStudent.id || Date.now(),
                first_name: matchingStudent.firstName,
                last_name: matchingStudent.lastName,
                name: `${matchingStudent.firstName} ${matchingStudent.lastName}`,
                email: matchingStudent.email,
                username: formData.username,
                phone: matchingStudent.phone || '123-456-7890',
                role: 'student',
                department: matchingStudent.department || 'Computer Science',
                semester: matchingStudent.semester || '1',
                student_id: matchingStudent.studentId,
                roll_number: matchingStudent.rollNumber,
                attendance_percentage: matchingStudent.attendancePercentage || 0,
                courses: matchingStudent.courses || [],
                profile_image: matchingStudent.profileImage,
              };
              
              // Store profile image separately for the ProfilePage component
              profileImage = matchingStudent.profileImage;
            }
          }
        } catch (error) {
          console.error('Error checking managed students:', error);
        }
      }
      
      // If still no role found, default to student for demo purposes
      if (!userRole) {
        userRole = 'student';
        console.log('No role found, defaulting to student');
      }
      
      // If no existing user found in any storage, create a default one
      if (!existingUserData) {
        // First, check for user-specific profile data
        const profileKey = `profile_${formData.username}`;
        let userProfileData = null;
        
        try {
          const storedUserProfile = localStorage.getItem(profileKey);
          if (storedUserProfile) {
            userProfileData = JSON.parse(storedUserProfile);
            console.log('Found user-specific profile data:', userProfileData);
          }
        } catch (error) {
          console.error('Error checking user-specific profile data:', error);
        }
        
        // If no user-specific data, check the general profileData storage
        if (!userProfileData) {
          try {
            const profileDataJSON = localStorage.getItem('profileData');
            if (profileDataJSON) {
              const parsedProfileData = JSON.parse(profileDataJSON);
              if (parsedProfileData.email === formData.username) {
                userProfileData = parsedProfileData;
                console.log('Found general profile data:', userProfileData);
              }
            }
          } catch (error) {
            console.error('Error checking stored profile data:', error);
          }
        }
        
        // Create default user data, prioritizing the most recent profile data
        existingUserData = {
          id: Date.now(),
          first_name: userProfileData?.firstName || 'John',
          last_name: userProfileData?.lastName || 'Doe',
          name: userProfileData ? `${userProfileData.firstName} ${userProfileData.lastName}` : 'John Doe',
          email: userProfileData?.email || formData.username + '@example.com', // Use stored email if available
          username: formData.username,
          phone: userProfileData?.phone || '123-456-7890',
          role: userProfileData?.role || userRole,
          department: userProfileData?.department || 'Computer Science',
          semester: userProfileData?.semester || 5,
          profile_image: userProfileData?.profileImage || null, // Add profile image from stored data
          last_login: new Date().toISOString(), // Track login time
        };
      }
      
      console.log('Logged in user with role:', existingUserData.role);
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(existingUserData));
      
      // If we have a profile image, store it for the ProfilePage component
      if (profileImage && existingUserData.id) {
        localStorage.setItem(`profileImage_${existingUserData.id}`, profileImage);
      }
      
      // Also ensure we have a user-specific profile entry
      const profileKey = `profile_${existingUserData.email}`;
      const existingProfileData = localStorage.getItem(profileKey);
      
      if (!existingProfileData) {
        // Create a new profile entry for this user
        const newProfileData = {
          userId: existingUserData.id,
          firstName: existingUserData.first_name,
          lastName: existingUserData.last_name,
          email: existingUserData.email,
          phone: existingUserData.phone,
          department: existingUserData.department,
          semester: existingUserData.semester,
          profileImage: existingUserData.profile_image,
          role: existingUserData.role,
          lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(profileKey, JSON.stringify(newProfileData));
      }
      
      setUser(existingUserData);
      toast.success(`Welcome back, ${existingUserData.first_name}!`);
      
      // Redirect based on role
      if (existingUserData.role === 'teacher') {
        navigate('/dashboard');
      } else if (existingUserData.role === 'admin') {
        navigate('/admin');
      } else {
        // Default to student dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Login
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Link component={RouterLink} to="/forgot-password" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
