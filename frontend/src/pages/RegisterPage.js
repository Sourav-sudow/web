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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Dialog,
} from '@mui/material';
import { register } from '../services/auth.service';
import { saveRegistrationToExcel } from '../services/excel/excel.service';
import { toast } from 'react-toastify';
import WebcamCapture from '../components/common/WebcamCapture';

const RegisterPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // Additional student fields
    phone: '',
    department: 'Computer Science',
    semester: '1',
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [webcamOpen, setWebcamOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle webcam capture
  const handleOpenWebcam = () => {
    setWebcamOpen(true);
  };

  const handleCloseWebcam = () => {
    setWebcamOpen(false);
  };

  const handleImageCapture = (imageSrc) => {
    setFormData({
      ...formData,
      profileImage: imageSrc,
    });
    setWebcamOpen(false);
    toast.success('Profile photo captured successfully!');
  };

  // Function to add student to the managed students list
  const addStudentToManagedList = (studentData) => {
    try {
      // Get existing managed students or initialize empty array
      const existingStudentsJSON = localStorage.getItem('managedStudents');
      const existingStudents = existingStudentsJSON ? JSON.parse(existingStudentsJSON) : [];
      
      // Generate a new unique ID
      const maxId = existingStudents.length > 0 
        ? Math.max(...existingStudents.map(s => s.id)) 
        : 0;
      
      // Create new student object with required fields
      const newStudent = {
        id: maxId + 1,
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        phone: studentData.phone || '(Not provided)',
        studentId: `STU-${new Date().getFullYear()}-${String(maxId + 1).padStart(3, '0')}`,
        rollNumber: `${studentData.department.substring(0, 2).toUpperCase()}-${new Date().getFullYear()}-${String(maxId + 100).padStart(3, '0')}`,
        department: studentData.department,
        semester: parseInt(studentData.semester, 10),
        courses: ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
        attendancePercentage: 0, // New student starts with 0% attendance
        // Use captured profile image or fallback to random image
        profileImage: studentData.profileImage || 'https://randomuser.me/api/portraits/people/' + Math.floor(Math.random() * 100) + '.jpg',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
        isNewUser: true,
        registeredAt: new Date().toISOString(),
        // Initialize attendance data to 0
        totalClasses: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        // Empty attendance records
        attendanceRecords: []
      };
      
      // Add to the list and save back to localStorage
      existingStudents.push(newStudent);
      localStorage.setItem('managedStudents', JSON.stringify(existingStudents));
      
      console.log('Student added to managed list:', newStudent);
      return true;
    } catch (error) {
      console.error('Error adding student to managed list:', error);
      return false;
    }
  };

  // Function to save registered user credentials
  const saveRegisteredUser = (userData) => {
    try {
      // Get existing registered users or initialize empty array
      const registeredUsersJSON = localStorage.getItem('registeredUsers');
      const registeredUsers = registeredUsersJSON ? JSON.parse(registeredUsersJSON) : [];
      
      // Check if email already exists
      const emailExists = registeredUsers.some(user => 
        user.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (emailExists) {
        throw new Error('Email already registered');
      }
      
      // Generate a new unique ID
      const maxId = registeredUsers.length > 0 
        ? Math.max(...registeredUsers.map(u => u.id)) 
        : 0;
      
      // Create new user object with credentials and role
      const newUser = {
        id: maxId + 1,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.email.split('@')[0], // Create username from email
        password: userData.password, // In a real app, this would be hashed
        role: userData.role,
        profileImage: userData.profileImage,
        registeredAt: new Date().toISOString(),
      };
      
      // Add to the list and save back to localStorage
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      console.log('User registered successfully:', newUser.email);
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      setError(error.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  const handleNext = () => {
    // Validate current step
    if (activeStep === 0) {
      // Validate basic info
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Check if email is already registered
      try {
        const registeredUsersJSON = localStorage.getItem('registeredUsers');
        if (registeredUsersJSON) {
          const registeredUsers = JSON.parse(registeredUsersJSON);
          const emailExists = registeredUsers.some(user => 
            user.email.toLowerCase() === formData.email.toLowerCase()
          );
          
          if (emailExists) {
            setError('This email is already registered. Please use a different email or login.');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking registered users:', error);
      }
    } else if (activeStep === 1) {
      // Validate password
      if (!formData.password || !formData.confirmPassword) {
        setError('Please enter and confirm your password');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    } else if (activeStep === 2 && formData.role === 'student') {
      // For students, validate additional info
      if (!formData.department || !formData.semester) {
        setError('Please complete your student information');
        return;
      }
    }

    setError('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Save registered user credentials
      const registered = saveRegisteredUser(formData);
      
      if (!registered) {
        throw new Error('Registration failed. Please try again.');
      }
      
      // For demo purposes, we'll use a mock registration
      // In a real app, you would call your API
      // const userData = await register(formData);
      
      // Create a unique user ID
      const userId = Date.now();
      
      // Create user data with proper format to match what the app expects
      const userData = {
        id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        username: formData.email.split('@')[0],
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        semester: formData.semester,
        profile_image: formData.profileImage,
        isNewUser: true,
        registeredAt: new Date().toISOString(),
        // For new students, initialize attendance data to 0
        total_classes: 0,
        present: 0,
        absent: 0,
        late: 0,
        attendance_percentage: 0
      };
      
      console.log('Registered user with role:', userData.role);
      
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Store profile image if available
      if (formData.profileImage) {
        localStorage.setItem(`profileImage_${userData.id}`, formData.profileImage);
      }
      
      // Create and store user-specific profile data
      const profileKey = `profile_${userData.email}`;
      const profileData = {
        userId: userData.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        semester: formData.semester,
        profileImage: formData.profileImage,
        role: formData.role,
        isNewUser: true,
        registeredAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(profileKey, JSON.stringify(profileData));
      
      // Also update the general profileData storage for backward compatibility
      localStorage.setItem('profileData', JSON.stringify(profileData));
      
      // If the user is a student, add them to the managed students list
      if (formData.role === 'student') {
        const added = addStudentToManagedList({
          ...formData,
          isNewUser: true,
          registeredAt: new Date().toISOString()
        });
        if (added) {
          toast.success('Your profile has been added to the class roster');
        }
      }
      
      // Clear any existing attendance links for this user
      if (formData.role === 'teacher') {
        localStorage.removeItem('teacherAttendanceLinks');
      }
      
      // Save registration data to Excel
      try {
        await saveRegistrationToExcel({
          ...formData,
          id: userData.id,
          registeredAt: userData.registeredAt,
          isNewUser: true,
          password: formData.password // Explicitly include password
        });
        console.log('Registration data saved to Excel');
      } catch (excelError) {
        console.error('Error saving registration data to Excel:', excelError);
        // Continue with registration even if Excel save fails
      }
      
      setUser(userData);
      toast.success('Registration successful! Welcome to the Attendance System.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Define steps for the registration process
  const steps = [
    {
      label: 'Basic Information',
      description: 'Enter your personal details',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Security',
      description: 'Create your password',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Additional Information',
      description: formData.role === 'student' ? 'Complete your student profile' : 'Complete your teacher profile',
      content: formData.role === 'student' ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                name="department"
                value={formData.department}
                label="Department"
                onChange={handleChange}
              >
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Physics">Physics</MenuItem>
                <MenuItem value="Chemistry">Chemistry</MenuItem>
                <MenuItem value="Biology">Biology</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="semester-label">Semester</InputLabel>
              <Select
                labelId="semester-label"
                id="semester"
                name="semester"
                value={formData.semester}
                label="Semester"
                onChange={handleChange}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <MenuItem key={sem} value={sem.toString()}>
                    {sem}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No additional information required for teachers.
        </Typography>
      ),
    },
    {
      label: 'Profile Photo',
      description: 'Capture your profile photo',
      content: (
        <Grid container spacing={2} direction="column" alignItems="center">
          <Grid item xs={12}>
            {formData.profileImage ? (
              <Box sx={{ textAlign: 'center' }}>
                <img 
                  src={formData.profileImage} 
                  alt="Profile" 
                  style={{ 
                    width: '200px', 
                    height: '200px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '3px solid #3f51b5',
                    marginBottom: '16px'
                  }} 
                />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your profile photo has been captured
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={handleOpenWebcam}
                  sx={{ mt: 1 }}
                >
                  Retake Photo
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: '200px', 
                    height: '200px', 
                    borderRadius: '50%', 
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    border: '3px dashed #bdbdbd'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No Photo
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Please capture your profile photo
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleOpenWebcam}
                  sx={{ mt: 1 }}
                >
                  Capture Photo
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Review & Submit',
      description: 'Review your information and complete registration',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Name:</Typography>
                  <Typography variant="body1">{formData.firstName} {formData.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email:</Typography>
                  <Typography variant="body1">{formData.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Role:</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{formData.role}</Typography>
                </Grid>
                {formData.role === 'student' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Phone:</Typography>
                      <Typography variant="body1">{formData.phone || 'Not provided'}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Department:</Typography>
                      <Typography variant="body1">{formData.department}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">Semester:</Typography>
                      <Typography variant="body1">{formData.semester}</Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Profile Photo:</Typography>
                  {formData.profileImage ? (
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        marginTop: '8px'
                      }} 
                    />
                  ) : (
                    <Typography variant="body2" color="error">
                      No profile photo captured
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create an Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill in your details to register
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="subtitle1">{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  {step.content}
                  <Box sx={{ mb: 2, mt: 3 }}>
                    <div>
                      <Button
                        disabled={index === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={loading}
                        >
                          {loading ? <CircularProgress size={24} /> : 'Complete Registration'}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                        >
                          Next
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      {/* Webcam Capture Dialog */}
      <Dialog 
        open={webcamOpen} 
        onClose={handleCloseWebcam}
        maxWidth="md"
        fullWidth
      >
        <WebcamCapture 
          onImageCapture={handleImageCapture} 
          onClose={handleCloseWebcam} 
        />
      </Dialog>
    </Container>
  );
};

export default RegisterPage;
