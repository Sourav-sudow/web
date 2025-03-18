import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  CardActions,
  Chip,
} from '@mui/material';
import {
  Assignment,
  AssignmentTurnedIn,
  AssignmentLate,
  EventBusy,
  BarChart,
  People,
  Class,
  PersonAdd,
  Link as LinkIcon,
  ArrowForward,
  CloudDownload,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import GenerateAttendanceLink from '../attendance/GenerateAttendanceLink';
import ActiveAttendanceLinks from '../attendance/ActiveAttendanceLinks';
import { downloadRegistrationExcel, getRegistrationData } from '../../services/excel/excel.service';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const TeacherDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [registrationData, setRegistrationData] = useState([]);
  
  // Load teacher stats and classes on component mount
  useEffect(() => {
    // Simulate API call with mock data
    const timer = setTimeout(() => {
      try {
        // Mock classes data
        const mockClasses = [
          { 
            id: 1, 
            name: 'Mathematics 101', 
            code: 'MATH101', 
            students: 35, 
            attendance_rate: 100,
            schedule: 'Mon, Wed, Fri 9:00 AM'
          },
          { 
            id: 2, 
            name: 'Advanced Calculus', 
            code: 'MATH201', 
            students: 28, 
            attendance_rate: 100,
            schedule: 'Tue, Thu 11:00 AM'
          },
          { 
            id: 3, 
            name: 'Linear Algebra', 
            code: 'MATH301', 
            students: 22, 
            attendance_rate: 100,
            schedule: 'Mon, Wed 2:00 PM'
          },
          { 
            id: 4, 
            name: 'Statistics', 
            code: 'MATH401', 
            students: 30, 
            attendance_rate: 100,
            schedule: 'Fri 1:00 PM'
          },
        ];
        
        // Mock stats data
        const mockStats = {
          total_classes: 4,
          total_students: 1,
          classes_conducted: 12, // Increased for more realistic calculation
          total_present_days: 12, // Updated to match classes_conducted for 100% attendance
          attendance_percentage: 100, // Updated to 100%
          recent_sessions: [
            { 
              id: 1, 
              date: '2023-03-15', 
              class: 'Mathematics 101', 
              code: 'MATH101', 
              students_present: 35, 
              students_total: 35,
              time: '09:00 AM' 
            },
            { 
              id: 2, 
              date: '2023-03-14', 
              class: 'Advanced Calculus', 
              code: 'MATH201', 
              students_present: 28, 
              students_total: 28,
              time: '11:00 AM' 
            },
            { 
              id: 3, 
              date: '2023-03-13', 
              class: 'Linear Algebra', 
              code: 'MATH301', 
              students_present: 22, 
              students_total: 22,
              time: '02:00 PM' 
            },
            { 
              id: 4, 
              date: '2023-03-12', 
              class: 'Statistics', 
              code: 'MATH401', 
              students_present: 30, 
              students_total: 30,
              time: '01:00 PM' 
            },
          ]
        };
        
        // Calculate the correct attendance percentage
        mockStats.attendance_percentage = Math.round((mockStats.total_present_days / mockStats.classes_conducted) * 100);
        
        // Get registration data
        const regData = getRegistrationData();
        
        // Ensure we have the current user in the registration data
        if (user && user.id && user.email) {
          // Check if the current user is already in the registration data
          const userExists = regData.some(item => 
            item.id === user.id || item.email === user.email
          );
          
          // If not, add them to the registration data
          if (!userExists && user.role === 'teacher') {
            const userData = {
              id: user.id,
              firstName: user.first_name || user.firstName,
              lastName: user.last_name || user.lastName,
              email: user.email,
              role: user.role,
              registeredAt: new Date().toISOString()
            };
            regData.push(userData);
          }
        }
        
        setRegistrationData(regData);
        
        // Update total students count based on registration data
        if (regData.length > 0) {
          const studentCount = regData.filter(user => user.role === 'student').length;
          if (studentCount > 0) {
            mockStats.total_students = studentCount;
          }
        }
        
        setClasses(mockClasses);
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Data fetching error:', error);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  const handleOpenLinkDialog = () => {
    setOpenLinkDialog(true);
  };

  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
  };
  
  const handleDownloadExcel = () => {
    try {
      const success = downloadRegistrationExcel();
      if (success) {
        toast.success('Registration data downloaded successfully');
      } else {
        toast.error('Failed to download registration data');
      }
    } catch (error) {
      console.error('Error downloading registration data:', error);
      toast.error('Failed to download registration data');
    }
  };
  
  // Prepare pie chart data
  const getPieChartData = () => {
    return {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          data: [stats.attendance_percentage, 100 - stats.attendance_percentage],
          backgroundColor: ['#4caf50', '#f44336'],
          borderColor: ['#388e3c', '#d32f2f'],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Prepare bar chart data
  const getBarChartData = () => {
    return {
      labels: classes.map((cls) => cls.code),
      datasets: [
        {
          label: 'Attendance Rate',
          data: classes.map((cls) => cls.attendance_rate),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Bar chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance by Class',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)',
        },
      },
    },
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box>
      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<LinkIcon />}
              sx={{ py: 1.5 }}
              onClick={handleOpenLinkDialog}
            >
              Generate Attendance Link
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/reports"
              variant="outlined"
              fullWidth
              startIcon={<BarChart />}
              sx={{ py: 1.5 }}
            >
              View Reports
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/students"
              variant="outlined"
              fullWidth
              startIcon={<People />}
              sx={{ py: 1.5 }}
            >
              Manage Students
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<CloudDownload />}
              sx={{ py: 1.5 }}
              onClick={handleDownloadExcel}
            >
              Download Registration Data
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Registration Data Summary */}
      {registrationData.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Registration Data Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {registrationData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Registrations
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {registrationData.filter(user => user.role === 'student').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Students
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {registrationData.filter(user => user.role === 'teacher').length > 0 
                      ? registrationData.filter(user => user.role === 'teacher').length 
                      : 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Teachers
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<CloudDownload />}
                    onClick={handleDownloadExcel}
                  >
                    Download Excel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Active Attendance Links */}
      <Box sx={{ mb: 4 }}>
        <ActiveAttendanceLinks classes={classes} user={user} />
      </Box>
      
      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Teaching Statistics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Classes
                </Typography>
                <Class color="primary" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {stats.total_classes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Courses assigned
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Students
                </Typography>
                <People color="info" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }} color="info.main">
                {stats.total_students}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Across all classes
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Classes Conducted
                </Typography>
                <Assignment color="success" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }} color="success.main">
                {stats.classes_conducted}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This semester
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Avg. Attendance
                </Typography>
                <BarChart color={stats.attendance_percentage >= 75 ? "success" : "error"} />
              </Box>
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ mt: 2 }}
                color={stats.attendance_percentage >= 75 ? 'success.main' : 'error.main'}
              >
                {stats.attendance_percentage}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.total_present_days} days / {stats.classes_conducted} classes
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Charts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Overview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom align="center">
                Overall Attendance
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {stats.classes_conducted > 0 ? (
                  <Pie data={getPieChartData()} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No attendance data available
                  </Typography>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
                Based on {stats.total_present_days} days present out of {stats.classes_conducted} classes conducted
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom align="center">
                Class-wise Attendance
              </Typography>
              <Box sx={{ height: 300 }}>
                {classes.length > 0 ? (
                  <Bar data={getBarChartData()} options={barChartOptions} />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      No class data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Recent Sessions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Sessions
        </Typography>
        
        <Paper>
          <List>
            <ListItem sx={{ bgcolor: 'rgba(76, 175, 80, 0.08)' }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1">Mathematics 101</Typography>
                    <Box
                      sx={{
                        ml: 1,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        display: 'inline-block',
                        bgcolor: 'primary.light',
                        color: 'primary.dark',
                      }}
                    >
                      MATH101
                    </Box>
                    <Chip 
                      label="Today" 
                      size="small" 
                      color="success" 
                      sx={{ ml: 1, fontWeight: 'bold' }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 1 of 35 students present (3%)
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
      
      {/* Recent Attendance Records */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Attendance Records
        </Typography>
        
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              Students who recently marked attendance
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<BarChart />}
              component={RouterLink}
              to="/reports"
            >
              View Full Report
            </Button>
          </Box>
          
          {/* Attendance records */}
          <Box sx={{ overflowX: 'auto' }}>
            <Box sx={{ minWidth: 650 }}>
              <Box sx={{ display: 'flex', fontWeight: 'bold', p: 1, borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                <Box sx={{ width: '50px' }}></Box>
                <Box sx={{ flex: 2 }}>Student</Box>
                <Box sx={{ flex: 1 }}>Class</Box>
                <Box sx={{ flex: 1 }}>Date</Box>
                <Box sx={{ flex: 1 }}>Time</Box>
                <Box sx={{ flex: 1 }}>Status</Box>
              </Box>
              
              {/* Single attendance record - the most recent one */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  p: 1, 
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  bgcolor: 'rgba(76, 175, 80, 0.08)',
                  '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.12)' }
                }}
              >
                <Box sx={{ width: '50px' }}>
                  <Box
                    component="img"
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="John Smith"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
                <Box sx={{ flex: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    John Smith
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Student ID: 100001
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    Mathematics 101
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    MATH101
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  <Typography variant="caption" color="success.main">
                    Just now
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Chip 
                    label="Present" 
                    size="small" 
                    color="success" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
              
              {/* Empty state message */}
              <Box sx={{ p: 2, display: 'none' }}>
                <Typography variant="body2" color="text.secondary" align="center">
                  No attendance records found for today.
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              component={RouterLink}
              to="/reports"
              endIcon={<ArrowForward />}
            >
              View All Attendance Records
            </Button>
          </Box>
        </Paper>
      </Box>
      
      {/* Classes */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your Classes
        </Typography>
        
        <Grid container spacing={3}>
          {classes.map((cls) => (
            <Grid item xs={12} sm={6} md={3} key={cls.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    {cls.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Code: {cls.code}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Schedule: {cls.schedule}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">
                      <People fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {cls.students} Students
                    </Typography>
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor:
                          cls.attendance_rate >= 75
                            ? 'success.light'
                            : 'error.light',
                        color:
                          cls.attendance_rate >= 75
                            ? 'success.dark'
                            : 'error.dark',
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {cls.attendance_rate}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    component={RouterLink}
                    to={`/reports?class=${cls.code}`}
                    size="small" 
                    startIcon={<BarChart />}
                    fullWidth
                  >
                    View Report
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          
          {classes.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="info">
                <AlertTitle>No Classes Found</AlertTitle>
                You don't have any classes assigned yet. Contact the administrator to get classes assigned to you.
              </Alert>
            </Grid>
          )}
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 3, bgcolor: 'action.hover' }}>
              <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom align="center">
                Request New Class
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                Need to add a new class to your schedule?
              </Typography>
              <Button variant="outlined" startIcon={<Class />}>
                Request Class
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Attendance Link Dialog */}
      <GenerateAttendanceLink 
        open={openLinkDialog} 
        onClose={handleCloseLinkDialog} 
        classes={classes} 
      />
    </Box>
  );
};

export default TeacherDashboard; 