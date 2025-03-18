import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import ReportPage from './pages/ReportPage';
import ProfilePage from './pages/ProfilePage';
import ManageStudentsPage from './pages/ManageStudentsPage';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Services
import { getUser } from './services/auth.service';

// Create a theme instance with dark mode
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Montserrat, Roboto, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Montserrat, Roboto, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: 'Montserrat, Roboto, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Montserrat, Roboto, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Poppins, Roboto, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Poppins, Roboto, sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: 'Poppins, Roboto, sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3f51b5 30%, #536dfe 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #303f9f 30%, #3f51b5 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #f50057 30%, #ff4081 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #c51162 30%, #f50057 90%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(30, 30, 30, 0.8)',
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});

function App() {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      // Clear any existing user data when on homepage
      localStorage.removeItem('user');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('token');
      localStorage.removeItem('profileData');
      return null;
    }
    
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  
  // Function to clear all user accounts
  const clearAllAccounts = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('token');
    localStorage.removeItem('profileData');
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('managedStudents');
    localStorage.removeItem('attendanceRecords');
    localStorage.removeItem('teacherAttendanceLinks');
    
    // Clear any profile-specific data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('profile_') || key.startsWith('profileImage_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Reset user state
    setUser(null);
    
    // Redirect to homepage
    window.location.href = '/';
  };

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // First try to get from localStorage (for demo purposes)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }
        
        // If not in localStorage, try to get from API
        const userData = await getUser();
        if (userData) {
          setUser(userData);
          // Store in localStorage for demo purposes
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Protected route component - checks for authentication only
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
  };

  // Teacher route component - ensures only teachers can access
  const TeacherRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'teacher') {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };

  // Student route component - ensures only students can access
  const StudentRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'student') {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };

  // Admin route component
  const AdminRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!user || user.role !== 'admin') return <Navigate to="/dashboard" />;
    return children;
  };

  // Log the current user state for debugging
  console.log('Current user state:', user);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar user={user} setUser={setUser} clearAllAccounts={clearAllAccounts} />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage setUser={setUser} />} />
              <Route path="/register" element={<RegisterPage setUser={setUser} />} />
              <Route path="/dashboard" element={
                <ProtectedRoute user={user}>
                  <DashboardPage user={user} setUser={setUser} />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <StudentRoute>
                  <AttendancePage user={user} />
                </StudentRoute>
              } />
              <Route path="/students" element={
                <TeacherRoute>
                  <ManageStudentsPage user={user} />
                </TeacherRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportPage user={user} />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage user={user} setUser={setUser} />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
