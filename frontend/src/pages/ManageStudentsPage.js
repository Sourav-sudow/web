import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search,
  FilterList,
  PersonAdd,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Email,
  Phone,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ManageStudentsPage = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    semester: '',
    status: '',
  });

  useEffect(() => {
    // Simulate API call to fetch students
    const fetchStudents = async () => {
      try {
        setLoading(true);
        
        // Check if we have stored students in localStorage
        const storedStudents = localStorage.getItem('managedStudents');
        
        if (storedStudents) {
          const parsedStudents = JSON.parse(storedStudents);
          setStudents(parsedStudents);
          setFilteredStudents(parsedStudents);
          setLoading(false);
          return;
        }
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          const mockStudents = [
            {
              id: 1,
              firstName: 'John',
              lastName: 'Smith',
              email: 'john.smith@example.com',
              phone: '123-456-7890',
              studentId: 'STU-2023-001',
              rollNumber: 'CS-2023-042',
              department: 'Computer Science',
              semester: 5,
              courses: ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
              attendancePercentage: 92,
              profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
              status: 'active',
              joinDate: '2023-01-15',
            },
            {
              id: 2,
              firstName: 'Emily',
              lastName: 'Johnson',
              email: 'emily.johnson@example.com',
              phone: '234-567-8901',
              studentId: 'STU-2023-002',
              rollNumber: 'CS-2023-043',
              department: 'Computer Science',
              semester: 5,
              courses: ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
              attendancePercentage: 88,
              profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
              status: 'active',
              joinDate: '2023-01-20',
            },
            {
              id: 3,
              firstName: 'Michael',
              lastName: 'Williams',
              email: 'michael.williams@example.com',
              phone: '345-678-9012',
              studentId: 'STU-2023-003',
              rollNumber: 'CS-2023-044',
              department: 'Computer Science',
              semester: 5,
              courses: ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
              attendancePercentage: 78,
              profileImage: 'https://randomuser.me/api/portraits/men/67.jpg',
              status: 'active',
              joinDate: '2023-01-25',
            },
            {
              id: 4,
              firstName: 'Sophia',
              lastName: 'Brown',
              email: 'sophia.brown@example.com',
              phone: '456-789-0123',
              studentId: 'STU-2023-004',
              rollNumber: 'CS-2023-045',
              department: 'Computer Science',
              semester: 5,
              courses: ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
              attendancePercentage: 95,
              profileImage: 'https://randomuser.me/api/portraits/women/33.jpg',
              status: 'active',
              joinDate: '2023-02-01',
            },
            {
              id: 5,
              firstName: 'Daniel',
              lastName: 'Jones',
              email: 'daniel.jones@example.com',
              phone: '567-890-1234',
              studentId: 'STU-2023-005',
              rollNumber: 'CS-2023-046',
              department: 'Computer Science',
              semester: 5,
              courses: ['Mathematics 101', 'Physics 201', 'Computer Science 301'],
              attendancePercentage: 82,
              profileImage: 'https://randomuser.me/api/portraits/men/94.jpg',
              status: 'inactive',
              joinDate: '2023-02-05',
            },
          ];
          
          // Store in localStorage for persistence
          localStorage.setItem('managedStudents', JSON.stringify(mockStudents));
          
          setStudents(mockStudents);
          setFilteredStudents(mockStudents);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Failed to load students. Please try again.');
        setLoading(false);
      }
    };
    
    fetchStudents();
  }, []);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchTerm, students]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddStudent = () => {
    toast.info('Add student functionality would be implemented here.');
  };

  // Edit student functions
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      department: student.department,
      semester: student.semester,
      status: student.status,
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleEditSubmit = () => {
    if (!selectedStudent) return;
    
    // Update the student in the state
    const updatedStudents = students.map(student => 
      student.id === selectedStudent.id 
        ? { 
            ...student, 
            firstName: editFormData.firstName,
            lastName: editFormData.lastName,
            email: editFormData.email,
            phone: editFormData.phone,
            department: editFormData.department,
            semester: parseInt(editFormData.semester, 10),
            status: editFormData.status,
          } 
        : student
    );
    
    // Update state
    setStudents(updatedStudents);
    setFilteredStudents(
      filteredStudents.map(student => 
        student.id === selectedStudent.id 
          ? { 
              ...student, 
              firstName: editFormData.firstName,
              lastName: editFormData.lastName,
              email: editFormData.email,
              phone: editFormData.phone,
              department: editFormData.department,
              semester: parseInt(editFormData.semester, 10),
              status: editFormData.status,
            } 
          : student
      )
    );
    
    // Update localStorage
    localStorage.setItem('managedStudents', JSON.stringify(updatedStudents));
    
    toast.success('Student information updated successfully');
    handleEditDialogClose();
  };

  // Delete student functions
  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedStudent) return;
    
    // Remove the student from the state
    const updatedStudents = students.filter(student => student.id !== selectedStudent.id);
    
    // Update state
    setStudents(updatedStudents);
    setFilteredStudents(filteredStudents.filter(student => student.id !== selectedStudent.id));
    
    // Update localStorage
    localStorage.setItem('managedStudents', JSON.stringify(updatedStudents));
    
    toast.success('Student deleted successfully');
    handleDeleteDialogClose();
  };

  const handleToggleStatus = (studentId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // Update the student status in the state
    const updatedStudents = students.map(student => 
      student.id === studentId ? { ...student, status: newStatus } : student
    );
    
    // Update state
    setStudents(updatedStudents);
    setFilteredStudents(
      filteredStudents.map(student => 
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
    
    // Update localStorage
    localStorage.setItem('managedStudents', JSON.stringify(updatedStudents));
    
    toast.success(`Student status changed to ${newStatus}`);
  };

  if (loading) {
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

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Students
        </Typography>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h3" component="div" color="primary.main">
                  {students.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h3" component="div" color="success.main">
                  {students.filter(s => s.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h3" component="div" color="error.main">
                  {students.filter(s => s.status === 'inactive').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactive Students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h3" component="div" color="info.main">
                  {students.length > 0 
                    ? Math.round(students.reduce((acc, student) => acc + student.attendancePercentage, 0) / students.length)
                    : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Attendance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Search and Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Search students..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ width: '40%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          
          <Box>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleAddStudent}
              sx={{ mr: 1 }}
            >
              Add Student
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
            >
              Filter
            </Button>
          </Box>
        </Box>
        
        {/* Students Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell>Student</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={student.profileImage}
                          alt={`${student.firstName} ${student.lastName}`}
                          sx={{ mr: 2 }}
                        />
                        <Box>
                          <Typography variant="body1">
                            {student.firstName} {student.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Joined: {new Date(student.joinDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.studentId}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Roll: {student.rollNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {student.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {student.phone}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.department}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Semester: {student.semester}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${student.attendancePercentage}%`}
                        color={student.attendancePercentage >= 75 ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={student.status === 'active' ? 'Active' : 'Inactive'}
                        color={student.status === 'active' ? 'success' : 'error'}
                        size="small"
                        onClick={() => handleToggleStatus(student.id, student.status)}
                        icon={student.status === 'active' ? <CheckCircle /> : <Cancel />}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(student)}
                        sx={{ mr: 1 }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(student)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No students found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Student Information</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={editFormData.firstName}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={editFormData.lastName}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={editFormData.department}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Semester"
                name="semester"
                type="number"
                value={editFormData.semester}
                onChange={handleEditFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={editFormData.status}
                  label="Status"
                  onChange={handleEditFormChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedStudent?.firstName} {selectedStudent?.lastName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageStudentsPage; 