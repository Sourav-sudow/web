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
} from '@mui/material';
import {
  Assignment,
  AssignmentTurnedIn,
  AssignmentLate,
  EventBusy,
  BarChart,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
// import { getAttendanceStats, getSubjects } from '../../services/attendance.service';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StudentDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState(null);
  
  // Load attendance stats and subjects on component mount
  useEffect(() => {
    // Simulate API call with mock data
    const timer = setTimeout(() => {
      try {
        // Check if this is a new user account
        const isNewUser = user.isNewUser || (user.registeredAt && 
          new Date(user.registeredAt).getTime() > Date.now() - 24 * 60 * 60 * 1000); // Registered in the last 24 hours
        
        console.log('Is new user:', isNewUser);
        
        // Mock subjects data
        const mockSubjects = [
          { id: 1, name: 'Mathematics', code: 'MATH101', attendance_percentage: isNewUser ? 0 : 85 },
          { id: 2, name: 'Physics', code: 'PHYS101', attendance_percentage: isNewUser ? 0 : 92 },
          { id: 3, name: 'Computer Science', code: 'CS101', attendance_percentage: isNewUser ? 0 : 78 },
          { id: 4, name: 'Chemistry', code: 'CHEM101', attendance_percentage: isNewUser ? 0 : 88 },
        ];
        
        // Mock stats data - set to 0 for new users
        const mockStats = {
          total_classes: isNewUser ? 0 : 45,
          present: isNewUser ? 0 : 38,
          absent: isNewUser ? 0 : 5,
          late: isNewUser ? 0 : 2,
          attendance_percentage: isNewUser ? 0 : 84,
          subjects: mockSubjects,
          recent_attendance: isNewUser ? [] : [
            { 
              id: 1, 
              date: '2023-03-15', 
              subject: 'Mathematics', 
              code: 'MATH101', 
              status: 'present', 
              time: '09:00 AM' 
            },
            { 
              id: 2, 
              date: '2023-03-14', 
              subject: 'Physics', 
              code: 'PHYS101', 
              status: 'present', 
              time: '11:00 AM' 
            },
            { 
              id: 3, 
              date: '2023-03-13', 
              subject: 'Computer Science', 
              code: 'CS101', 
              status: 'absent', 
              time: '02:00 PM' 
            },
            { 
              id: 4, 
              date: '2023-03-12', 
              subject: 'Chemistry', 
              code: 'CHEM101', 
              status: 'late', 
              time: '10:30 AM' 
            },
          ]
        };
        
        setSubjects(mockSubjects);
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
  
  // Prepare pie chart data
  const getPieChartData = () => {
    // If all values are 0, show a placeholder chart
    if (stats.present === 0 && stats.late === 0 && stats.absent === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#e0e0e0'],
            borderColor: ['#bdbdbd'],
            borderWidth: 1,
          },
        ],
      };
    }
    
    return {
      labels: ['Present', 'Late', 'Absent'],
      datasets: [
        {
          data: [stats.present, stats.late, stats.absent],
          backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
          borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
          borderWidth: 1,
        },
      ],
    };
  };
  
  // Prepare bar chart data
  const getBarChartData = () => {
    // If no subjects have attendance data, show placeholder
    const hasAttendanceData = stats.subjects.some(subject => subject.attendance_percentage > 0);
    
    if (!hasAttendanceData) {
      return {
        labels: ['No Data Available'],
        datasets: [
          {
            label: 'Attendance Percentage',
            data: [0],
            backgroundColor: 'rgba(224, 224, 224, 0.5)',
            borderColor: 'rgba(189, 189, 189, 1)',
            borderWidth: 1,
          },
        ],
      };
    }
    
    return {
      labels: stats.subjects.map((subject) => subject.code),
      datasets: [
        {
          label: 'Attendance Percentage',
          data: stats.subjects.map((subject) => subject.attendance_percentage),
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
        text: 'Attendance by Subject',
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
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user.first_name}!
      </Typography>
      
      {stats.total_classes === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Welcome to your new account!</AlertTitle>
          <Typography variant="body2">
            You don't have any attendance data yet. As you attend classes, your attendance statistics will appear here.
          </Typography>
        </Alert>
      ) : (
        <Typography variant="body1" color="text.secondary" paragraph>
          Here's your attendance overview for the current semester.
        </Typography>
      )}
      
      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/attendance"
              variant="contained"
              fullWidth
              startIcon={<AssignmentTurnedIn />}
              sx={{ py: 1.5 }}
            >
              Mark Attendance
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
        </Grid>
      </Box>
      
      {/* Stats Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Attendance Statistics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Classes
                </Typography>
                <Assignment color="primary" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {stats.total_classes}
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
                  Present
                </Typography>
                <AssignmentTurnedIn color="success" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }} color="success.main">
                {stats.present}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classes attended
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Absent
                </Typography>
                <EventBusy color="error" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }} color="error.main">
                {stats.absent}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classes missed
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Attendance
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
                Overall rate
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
                Attendance Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {stats.total_classes > 0 ? (
                  <Pie data={getPieChartData()} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No attendance data available
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom align="center">
                Subject-wise Attendance
              </Typography>
              <Box sx={{ height: 300 }}>
                {stats.subjects.length > 0 ? (
                  <Bar data={getBarChartData()} options={barChartOptions} />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      No subject data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Recent Attendance */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Attendance
        </Typography>
        
        <Paper>
          <List>
            {stats.recent_attendance.map((record, index) => (
              <React.Fragment key={record.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{record.subject}</Typography>
                        <Box
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            bgcolor:
                              record.status === 'present'
                                ? 'success.light'
                                : record.status === 'late'
                                ? 'warning.light'
                                : 'error.light',
                            color:
                              record.status === 'present'
                                ? 'success.dark'
                                : record.status === 'late'
                                ? 'warning.dark'
                                : 'error.dark',
                          }}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {record.date} at {record.time}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
            
            {stats.recent_attendance.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No recent attendance records"
                  secondary="Your attendance history will appear here"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
      
      {/* Subject List */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Subjects
        </Typography>
        
        <Paper>
          <List>
            {stats.subjects.map((subject, index) => (
              <React.Fragment key={subject.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={subject.name}
                    secondary={`Code: ${subject.code}`}
                  />
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      bgcolor:
                        subject.attendance_percentage >= 75
                          ? 'success.light'
                          : 'error.light',
                      color:
                        subject.attendance_percentage >= 75
                          ? 'success.dark'
                          : 'error.dark',
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {subject.attendance_percentage}%
                    </Typography>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))}
            
            {stats.subjects.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No subjects found"
                  secondary="Your enrolled subjects will appear here"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
