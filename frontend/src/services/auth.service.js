import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Promise with registration response
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Store tokens in localStorage
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { error: 'Registration failed' };
  }
};

/**
 * Login a user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} - Promise with login response
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Store tokens in localStorage
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('refreshToken', refresh_token);
    
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { error: 'Login failed' };
  }
};

/**
 * Logout the current user
 */
export const logout = () => {
  // Get the current user email before clearing data
  try {
    const userJSON = localStorage.getItem('user');
    if (userJSON) {
      const user = JSON.parse(userJSON);
      const userEmail = user.email;
      
      // Clear user-specific profile data
      if (userEmail) {
        localStorage.removeItem(`profile_${userEmail}`);
      }
    }
  } catch (error) {
    console.error('Error clearing user-specific data during logout:', error);
  }
  
  // Clear all authentication and user data
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('profileData');
  
  // Redirect to homepage
  window.location.href = '/';
};

/**
 * Get the current user's profile
 * @returns {Promise} - Promise with user profile
 */
export const getUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    
    const response = await api.get('/auth/profile');
    return response.data.user;
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return null;
    }
    throw error.response?.data || { error: 'Failed to get user profile' };
  }
};

/**
 * Check if user is authenticated
 * @returns {Boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
