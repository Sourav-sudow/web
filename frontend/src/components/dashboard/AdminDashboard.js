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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  People,
  Class,
  Person,
  School,
  BarChart,
  PersonAdd,
  Add,
  Settings,
  Notifications,
  Dashboard,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  
  // Load admin stats on component mount
  useEffect(() => {
    // Simulate API call with mock data
    const timer = setTimeout(() => {
      try {
        // Mock stats data
        const mockStats = {
          total_students: 450,
          total_teachers: 35,
          total_classes: 48,
          total_departments: 8,
          attendance_percentage: 82,
          recent_activities: [
            { 
              id: 1, 
              type: 'registration',
              user: 'John Smith',
              role: 'student',
              date: '2023-03-15',
              time: '09:15 AM',
              details: 'New student registration'
            },
            { 
              id: 2, 
              type: 'attendance',
              user: 'Dr. Emily Johnson',
              role: 'teacher',
              date: '2023-03-15',
              time: '10:30 AM',
              details: 'Marked attendance for Mathematics 101'
            },
            { 
              id: 3, 
              type: 'class',
              user: 'Admin',
              role: 'admin',
              date: '2023-03-14',
              time: '02:45 PM',
              details: 'Added new class: Advanced Physics'
            },
            { 
              id: 4, 
              type: 'system',
              user: 'System',
              role: 'system',
              date: '2023-03-14',
              time: '08:00 AM',
              details: 'Daily attendance report generated'
            },
          ],
          departments: [
            { id: 1, name: 'Computer Science', students: 120, teachers: 10, classes: 12, attendance_rate: 85 },
            { id: 2, name: 'Mathematics', students: 95, teachers: 8, classes: 10, attendance_rate: 88 },
            { id: 3, name: 'Physics', students: 75, teachers: 6, classes: 8, attendance_rate: 79 },
            { id: 4, name: 'Chemistry', students: 80, teachers: 7, classes: 9, attendance_rate: 82 },
            { id: 5, name: 'Biology', students: 85, teachers: 7, classes: 9, attendance_rate: 84 },
          ]
        };
        
        setStats(mockStats);
        setLoading(false);
      } catch (error) {
        console.error('Data fetching error:', error);
        setError('Failed to load dashboard data. Please try again.');
        setLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
      labels: stats.departments.map((dept) => dept.name),
      datasets: [
        {
          label: 'Attendance Rate',
          data: stats.departments.map((dept) => dept.attendance_rate),
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
        text: 'Attendance by Department',
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
              component={RouterLink}
              to="/students"
              variant="contained"
              fullWidth
              startIcon={<People />}
              sx={{ py: 1.5 }}
            >
              Manage Students
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/teachers"
              variant="outlined"
              fullWidth
              startIcon={<School />}
              sx={{ py: 1.5 }}
            >
              Manage Teachers
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              component={RouterLink}
              to="/classes"
              variant="outlined"
              fullWidth
              startIcon={<Class />}
              sx={{ py: 1.5 }}
            >
              Manage Classes
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
          System Statistics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Students
                </Typography>
                <People color="primary" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                {stats.total_students}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enrolled in the system
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Teachers
                </Typography>
                <School color="info" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }} color="info.main">
                {stats.total_teachers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active faculty members
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Classes
                </Typography>
                <Class color="success" />
              </Box>
              <Typography variant="h3" component="div" sx={{ mt: 2 }} color="success.main">
                {stats.total_classes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active courses
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
                System-wide rate
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
                <Pie data={getPieChartData()} />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom align="center">
                Department-wise Attendance
              </Typography>
              <Box sx={{ height: 300 }}>
                {stats.departments.length > 0 ? (
                  <Bar data={getBarChartData()} options={barChartOptions} />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary">
                      No department data available
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Recent Activities */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activities
        </Typography>
        
        <Paper>
          <List>
            {stats.recent_activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1">{activity.details}</Typography>
                        <Box
                          sx={{
                            ml: 1,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            bgcolor: 
                              activity.type === 'registration' ? 'success.light' :
                              activity.type === 'attendance' ? 'primary.light' :
                              activity.type === 'class' ? 'info.light' : 'warning.light',
                            color: 
                              activity.type === 'registration' ? 'success.dark' :
                              activity.type === 'attendance' ? 'primary.dark' :
                              activity.type === 'class' ? 'info.dark' : 'warning.dark',
                          }}
                        >
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        By {activity.user} ({activity.role}) on {activity.date} at {activity.time}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
            
            {stats.recent_activities.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="No recent activities"
                  secondary="Recent system activities will appear here"
                />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
      
      {/* Department Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Department Overview
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Department</TableCell>
                <TableCell align="right">Students</TableCell>
                <TableCell align="right">Teachers</TableCell>
                <TableCell align="right">Classes</TableCell>
                <TableCell align="right">Attendance Rate</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.departments.map((dept) => (
                <TableRow key={dept.id}>
                  <TableCell component="th" scope="row">
                    {dept.name}
                  </TableCell>
                  <TableCell align="right">{dept.students}</TableCell>
                  <TableCell align="right">{dept.teachers}</TableCell>
                  <TableCell align="right">{dept.classes}</TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor:
                          dept.attendance_rate >= 75
                            ? 'success.light'
                            : 'error.light',
                        color:
                          dept.attendance_rate >= 75
                            ? 'success.dark'
                            : 'error.dark',
                      }}
                    >
                      {dept.attendance_rate}%
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" startIcon={<Dashboard />}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Admin Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Administrative Actions
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Add New User
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create new student or teacher accounts in the system
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<PersonAdd />}>
                  Add User
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Create Class
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add a new class and assign teachers
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Add />}>
                  Create Class
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  System Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure system parameters and settings
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Settings />}>
                  Settings
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send announcements to users
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<Notifications />}>
                  Send Notification
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
