import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register } from '../../services/auth.service';
import { toast } from 'react-toastify';

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    student_id: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    if (!formData.student_id) {
      newErrors.student_id = 'Student ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Remove confirm_password before sending to API
    const { confirm_password, ...registerData } = formData;
    
    try {
      const user = await register(registerData);
      setUser(user);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.error) {
        toast.error(error.error);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      
      // Set field-specific errors if available
      if (error.errors) {
        setErrors(error.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box className="form-container">
      <Typography variant="h4" component="h1" className="form-title">
        Register
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Student ID"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              error={!!errors.student_id}
              helperText={errors.student_id}
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirm_password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={handleChange}
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
              disabled={loading}
            />
          </Grid>
        </Grid>
        
        <Box className="form-actions" sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ minWidth: '120px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Register'}
          </Button>
          
          <Typography variant="body2">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login">
              Login
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
