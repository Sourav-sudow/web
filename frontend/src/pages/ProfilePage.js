import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Dialog,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School,
  Person,
  Email,
  Phone,
  Badge,
  Class,
  PhotoCamera,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import WebcamCapture from '../components/common/WebcamCapture';
import api from '../services/api';

const ProfilePage = ({ user, setUser }) => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [webcamOpen, setWebcamOpen] = useState(false);

  useEffect(() => {
    // Simulate loading profile data
    const timer = setTimeout(() => {
      try {
        // Check if user exists
        if (!user) {
          setError('User data not available. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Determine if user is a teacher
        const isTeacher = user?.role === 'teacher';
        
        // First, try to get the user-specific profile data
        const profileKey = `profile_${user.email}`;
        let userProfileData = null;
        
        try {
          const storedUserProfile = localStorage.getItem(profileKey);
          if (storedUserProfile) {
            userProfileData = JSON.parse(storedUserProfile);
            console.log('Found user-specific profile data:', userProfileData);
          }
        } catch (e) {
          console.error('Error parsing user-specific profile data:', e);
        }
        
        // If no user-specific data, check the general profileData storage
        if (!userProfileData) {
          const storedProfileData = localStorage.getItem('profileData');
          if (storedProfileData) {
            try {
              const parsedProfileData = JSON.parse(storedProfileData);
              // Only use this data if it belongs to the current user
              if (parsedProfileData.email === user.email || 
                  parsedProfileData.userId === user.id) {
                userProfileData = parsedProfileData;
                console.log('Found general profile data:', userProfileData);
              }
            } catch (e) {
              console.error('Error parsing stored profile data:', e);
            }
          }
        }
        
        // Check if we have a stored profile image
        const storedProfileImage = localStorage.getItem(`profileImage_${user.id}`);
        
        console.log("User data:", user);
        console.log("User profile data:", userProfileData);
        console.log("Stored profile image:", storedProfileImage);
        console.log("User profile image:", user.profile_image);
        
        // Create profile data based on user information, prioritizing the most recent data
        const mockProfileData = {
          id: user.id || 1,
          firstName: userProfileData?.firstName || user.first_name || user.name?.split(' ')[0] || 'Sourav',
          lastName: userProfileData?.lastName || user.last_name || (user.name?.split(' ').length > 1 ? user.name.split(' ')[1] : 'Kumar'),
          email: userProfileData?.email || user.email || 'sourav.kumar@example.com',
          phone: userProfileData?.phone || user.phone || '123-456-7890',
          role: isTeacher ? 'Teacher' : 'Student',
          department: userProfileData?.department || user.department || 'Computer Science',
          joinDate: user.join_date || '2023-01-15',
          profileImage: userProfileData?.profileImage || storedProfileImage || user.profile_image || `https://randomuser.me/api/portraits/${isTeacher ? 'men' : 'women'}/32.jpg`,
          ...(isTeacher ? {
            // Teacher specific fields
            employeeId: user.employee_id || 'TCH-2023-001',
            subjects: user.subjects || ['Mathematics 101', 'Advanced Calculus', 'Linear Algebra'],
            totalStudents: user.total_students || 1,
            totalClasses: user.total_classes || 4,
          } : {
            // Student specific fields
            studentId: user.student_id || 'STU-2023-001',
            rollNumber: user.roll_number || 'CS-2023-042',
            semester: userProfileData?.semester || user.semester || 5,
            courses: user.courses || ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
            attendancePercentage: user.attendance_percentage || 92,
          }),
        };
        
        setProfileData(mockProfileData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleOpenWebcam = () => {
    setWebcamOpen(true);
  };

  const handleCloseWebcam = () => {
    setWebcamOpen(false);
  };

  const handleImageCapture = (imageSrc) => {
    console.log("Image captured:", imageSrc.substring(0, 50) + "...");
    
    // Update profile data with new image
    setProfileData({
      ...profileData,
      profileImage: imageSrc,
    });
    
    // Store the image in localStorage
    if (user && user.id) {
      localStorage.setItem(`profileImage_${user.id}`, imageSrc);
      
      // Also update the user object in memory
      const updatedUser = {
        ...user,
        profile_image: imageSrc
      };
      setUser(updatedUser);
      
      // Update the user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update managed students list if this is a student
      if (user.role === 'student') {
        try {
          const managedStudentsJSON = localStorage.getItem('managedStudents');
          if (managedStudentsJSON) {
            const managedStudents = JSON.parse(managedStudentsJSON);
            const updatedStudents = managedStudents.map(student => {
              if (student.email === profileData.email) {
                return {
                  ...student,
                  profileImage: imageSrc,
                };
              }
              return student;
            });
            localStorage.setItem('managedStudents', JSON.stringify(updatedStudents));
          }
        } catch (error) {
          console.error('Error updating managed students:', error);
        }
      }
    }
    
    // Close webcam dialog
    setWebcamOpen(false);
    toast.success('Profile photo updated successfully!');
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    
    try {
      // Prepare the profile data to send to the API
      const profileToSave = {
        userId: user.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        semester: profileData.semester,
        profileImage: profileData.profileImage,
        role: user.role,
      };
      
      // First try to use the API
      try {
        // Make API call to update profile
        const response = await api.put('/auth/profile', profileToSave);
        
        // If API call is successful, update the local user object
        if (response.data && response.data.user) {
          // Update the App.js state via props
          setUser(response.data.user);
          
          toast.success('Profile updated successfully!');
          setEditing(false);
          setSaveLoading(false);
          return;
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // If API call fails, fall back to localStorage
        console.log('Falling back to localStorage for profile update');
      }
      
      // Fallback to localStorage if API call fails
      // Create a unique key for this user's profile data
      const profileKey = `profile_${user.email}`;
      
      // Add timestamp for tracking updates
      profileToSave.lastUpdated = new Date().toISOString();
      
      // Save to "database" (localStorage)
      localStorage.setItem(profileKey, JSON.stringify(profileToSave));
      
      // Also update the general profileData storage for backward compatibility
      localStorage.setItem('profileData', JSON.stringify(profileToSave));
      
      // Update the current user object
      const updatedUser = {
        ...user,
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        phone: profileData.phone,
        department: profileData.department,
        profile_image: profileData.profileImage,
        // Add timestamp to user object to track when it was last updated
        last_updated: new Date().toISOString()
      };
      
      // Update the App.js state via props
      setUser(updatedUser);
      
      // Update the user in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update registered users list if this user exists there
      try {
        const registeredUsersJSON = localStorage.getItem('registeredUsers');
        if (registeredUsersJSON) {
          const registeredUsers = JSON.parse(registeredUsersJSON);
          const updatedUsers = registeredUsers.map(registeredUser => {
            if (registeredUser.email === profileData.email || 
                registeredUser.email === user.email) {
              return {
                ...registeredUser,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                name: `${profileData.firstName} ${profileData.lastName}`,
                email: profileData.email,
                phone: profileData.phone,
                department: profileData.department,
                profileImage: profileData.profileImage,
              };
            }
            return registeredUser;
          });
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        }
      } catch (error) {
        console.error('Error updating registered users:', error);
      }
      
      // Update managed students list if this is a student
      if (user.role === 'student') {
        try {
          const managedStudentsJSON = localStorage.getItem('managedStudents');
          if (managedStudentsJSON) {
            const managedStudents = JSON.parse(managedStudentsJSON);
            const updatedStudents = managedStudents.map(student => {
              if (student.email === profileData.email || 
                  student.email === user.email) {
                return {
                  ...student,
                  firstName: profileData.firstName,
                  lastName: profileData.lastName,
                  phone: profileData.phone,
                  department: profileData.department,
                  semester: parseInt(profileData.semester, 10),
                  profileImage: profileData.profileImage,
                };
              }
              return student;
            });
            localStorage.setItem('managedStudents', JSON.stringify(updatedStudents));
          }
        } catch (error) {
          console.error('Error updating managed students:', error);
        }
      }
      
      toast.success('Profile updated successfully!');
      setEditing(false);
      setSaveLoading(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset any changes by reloading the profile data
    setLoading(true);
    
    // Simulate API call to get the original data
    setTimeout(() => {
      try {
        // Check if user exists
        if (!user) {
          setError('User data not available. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Determine if user is a teacher
        const isTeacher = user?.role === 'teacher';
        
        // Check if we have stored profile data for this user
        const storedProfileData = localStorage.getItem('profileData');
        let parsedProfileData = null;
        
        if (storedProfileData) {
          try {
            const parsed = JSON.parse(storedProfileData);
            if (parsed.userId === user.id) {
              parsedProfileData = parsed;
            }
          } catch (e) {
            console.error('Error parsing stored profile data:', e);
          }
        }
        
        // Check if we have a stored profile image
        const storedProfileImage = localStorage.getItem(`profileImage_${user.id}`);
        
        // Create profile data based on user information
        const mockProfileData = {
          id: user.id || 1,
          firstName: parsedProfileData?.firstName || user.first_name || user.name?.split(' ')[0] || 'Sourav',
          lastName: parsedProfileData?.lastName || user.last_name || (user.name?.split(' ').length > 1 ? user.name.split(' ')[1] : 'Kumar'),
          email: parsedProfileData?.email || user.email || 'sourav.kumar@example.com',
          phone: parsedProfileData?.phone || user.phone || '123-456-7890',
          role: isTeacher ? 'Teacher' : 'Student',
          department: parsedProfileData?.department || user.department || 'Computer Science',
          joinDate: user.join_date || '2023-01-15',
          profileImage: storedProfileImage || user.profile_image || `https://randomuser.me/api/portraits/${isTeacher ? 'men' : 'women'}/32.jpg`,
          ...(isTeacher ? {
            // Teacher specific fields
            employeeId: user.employee_id || 'TCH-2023-001',
            subjects: user.subjects || ['Mathematics 101', 'Advanced Calculus', 'Linear Algebra'],
            totalStudents: user.total_students || 1,
            totalClasses: user.total_classes || 4,
          } : {
            // Student specific fields
            studentId: user.student_id || 'STU-2023-001',
            rollNumber: user.roll_number || 'CS-2023-042',
            semester: parsedProfileData?.semester || user.semester || 5,
            courses: user.courses || ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
            attendancePercentage: user.attendance_percentage || 92,
          }),
        };
        
        setProfileData(mockProfileData);
        setEditing(false);
        setLoading(false);
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data. Please try again.');
        setLoading(false);
      }
    }, 500);
  };

  if (loading && !profileData) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const isTeacher = profileData?.role === 'Teacher';

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={profileData.profileImage}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  sx={{ width: 80, height: 80, mr: 2 }}
                />
                {editing && (
                  <IconButton 
                    color="primary" 
                    aria-label="upload picture" 
                    component="span"
                    onClick={handleOpenWebcam}
                    sx={{ 
                      position: 'absolute', 
                      bottom: -5, 
                      right: 10, 
                      backgroundColor: 'white',
                      boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      }
                    }}
                    size="small"
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Box>
                <Typography variant="h5">
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {profileData.role} • {profileData.department}
                </Typography>
                <Chip 
                  icon={isTeacher ? <School /> : <Person />} 
                  label={isTeacher ? 'Faculty Member' : 'Student'} 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
            
            {!editing ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
            ) : (
              <Box>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveProfile}
                  sx={{ mr: 1 }}
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={saveLoading}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    disabled={!editing}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Person color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    disabled={!editing}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Person color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Email color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Phone color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="department"
                    value={profileData.department}
                    onChange={handleInputChange}
                    disabled={!editing}
                    margin="normal"
                    InputProps={{
                      startAdornment: <School color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={isTeacher ? "Employee ID" : "Student ID"}
                    name={isTeacher ? "employeeId" : "studentId"}
                    value={isTeacher ? profileData.employeeId : profileData.studentId}
                    disabled={true} // ID fields should not be editable
                    margin="normal"
                    InputProps={{
                      startAdornment: <Badge color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                {isTeacher ? 'Teaching Information' : 'Academic Information'}
              </Typography>
              
              {isTeacher ? (
                // Teacher specific information
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Subjects Teaching
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profileData.subjects.map((subject, index) => (
                            <Chip 
                              key={index} 
                              label={subject} 
                              icon={<Class />} 
                              variant="outlined" 
                              color="primary"
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h3" align="center" color="primary">
                              {profileData.totalClasses}
                            </Typography>
                            <Typography variant="body2" align="center">
                              Classes
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h3" align="center" color="secondary">
                              {profileData.totalStudents}
                            </Typography>
                            <Typography variant="body2" align="center">
                              Students
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                // Student specific information
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Roll Number"
                      name="rollNumber"
                      value={profileData.rollNumber}
                      disabled={true}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Semester"
                      name="semester"
                      value={profileData.semester}
                      onChange={handleInputChange}
                      disabled={!editing}
                      margin="normal"
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Enrolled Courses
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {profileData.courses.map((course, index) => (
                            <Chip 
                              key={index} 
                              label={course} 
                              icon={<Class />} 
                              variant="outlined" 
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Attendance Rate
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h3" color={profileData.attendancePercentage >= 75 ? "success.main" : "error.main"}>
                            {profileData.attendancePercentage}%
                          </Typography>
                          <Box sx={{ ml: 2 }}>
                            <Chip 
                              label={profileData.attendancePercentage >= 75 ? "Good Standing" : "Needs Improvement"} 
                              color={profileData.attendancePercentage >= 75 ? "success" : "error"} 
                            />
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
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

export default ProfilePage; 