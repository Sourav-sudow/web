import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Download, FilterList, Clear, CheckCircle, Face } from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const AttendanceReport = ({ user, classCode }) => {
  const [loading, setLoading] = useState(true);
  const [attendances, setAttendances] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    subject_id: '',
    subject_code: classCode || '',
    start_date: '',
    end_date: '',
    status: '',
  });
  
  // Load mock attendance data and subjects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        setTimeout(() => {
          // Mock subjects data
          const mockSubjects = [
            { id: 1, name: 'Mathematics', code: 'MATH101' },
            { id: 2, name: 'Advanced Calculus', code: 'MATH201' },
            { id: 3, name: 'Linear Algebra', code: 'MATH301' },
            { id: 4, name: 'Statistics', code: 'MATH401' },
          ];
          
          setSubjects(mockSubjects);
          
          // If classCode is provided, find the corresponding subject
          if (classCode) {
            const matchingSubject = mockSubjects.find(subject => subject.code === classCode);
            if (matchingSubject) {
              setFilters(prev => ({
                ...prev,
                subject_id: matchingSubject.id.toString(),
                subject_code: classCode
              }));
              setShowFilters(true); // Show filters when a class is specified
            }
          }
          
          // Generate mock attendance data
          generateMockAttendanceData();
          
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Data fetching error:', error);
        setError('Failed to load attendance data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [classCode]);
  
  const generateMockAttendanceData = () => {
    // Generate random attendance records
    const statuses = ['present', 'absent', 'late'];
    const mockAttendances = [];
    
    // Generate 50 random attendance records
    for (let i = 1; i <= 50; i++) {
      const randomSubjectIndex = Math.floor(Math.random() * 4) + 1;
      const randomStatusIndex = Math.floor(Math.random() * 3);
      
      // Generate a random date within the last 30 days
      const today = new Date();
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const randomDate = new Date(today);
      randomDate.setDate(today.getDate() - randomDaysAgo);
      
      // Generate a random time
      const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
      const minutes = Math.floor(Math.random() * 60);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedTime = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      
      const subjectCodes = ['', 'MATH101', 'MATH201', 'MATH301', 'MATH401'];
      const subjectNames = ['', 'Mathematics', 'Advanced Calculus', 'Linear Algebra', 'Statistics'];
      
      mockAttendances.push({
        id: i,
        subject_id: randomSubjectIndex,
        subject_name: subjectNames[randomSubjectIndex],
        subject_code: subjectCodes[randomSubjectIndex],
        date: randomDate.toISOString().split('T')[0],
        time: formattedTime,
        status: statuses[randomStatusIndex],
        verification_method: 'face',
      });
    }
    
    // If classCode is provided, filter the mock data
    let filteredAttendances = mockAttendances;
    if (classCode) {
      filteredAttendances = mockAttendances.filter(
        attendance => attendance.subject_code === classCode
      );
      toast.info(`Showing attendance records for ${classCode}`);
    }
    
    setAttendances(filteredAttendances);
    setTotalCount(filteredAttendances.length);
  };
  
  const fetchAttendanceReport = () => {
    try {
      setLoading(true);
      
      // Filter the mock data based on filters
      let filteredAttendances = [...attendances];
      
      if (filters.subject_id) {
        filteredAttendances = filteredAttendances.filter(
          (attendance) => attendance.subject_id === parseInt(filters.subject_id)
        );
      }
      
      if (filters.subject_code) {
        filteredAttendances = filteredAttendances.filter(
          (attendance) => attendance.subject_code === filters.subject_code
        );
      }
      
      if (filters.start_date) {
        filteredAttendances = filteredAttendances.filter(
          (attendance) => attendance.date >= filters.start_date
        );
      }
      
      if (filters.end_date) {
        filteredAttendances = filteredAttendances.filter(
          (attendance) => attendance.date <= filters.end_date
        );
      }
      
      if (filters.status) {
        filteredAttendances = filteredAttendances.filter(
          (attendance) => attendance.status === filters.status
        );
      }
      
      setAttendances(filteredAttendances);
      setTotalCount(filteredAttendances.length);
      setLoading(false);
    } catch (error) {
      console.error('Attendance report error:', error);
      setError('Failed to fetch attendance report. Please try again.');
      setLoading(false);
    }
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };
  
  const handleApplyFilters = () => {
    setPage(0);
    fetchAttendanceReport();
  };
  
  const handleResetFilters = () => {
    setFilters({
      subject_id: '',
      subject_code: classCode || '', // Keep the class code if it was provided
      start_date: '',
      end_date: '',
      status: '',
    });
    setPage(0);
    generateMockAttendanceData();
  };
  
  const handleDownloadReport = async () => {
    try {
      // Simulate download delay
      toast.info('Preparing report for download...');
      
      setTimeout(() => {
        toast.success('Report downloaded successfully!');
      }, 1500);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report. Please try again.');
    }
  };
  
  const getStatusChip = (status) => {
    let color = 'default';
    
    switch (status) {
      case 'present':
        color = 'success';
        break;
      case 'absent':
        color = 'error';
        break;
      case 'late':
        color = 'warning';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={color}
        size="small"
      />
    );
  };
  
  // Render verification method chip
  const renderVerificationMethod = (method) => {
    if (method === 'Face Recognition + Fingerprint') {
      return (
        <Chip
          icon={<CheckCircle fontSize="small" />}
          label="Dual Verification"
          color="success"
          size="small"
          sx={{ '& .MuiChip-icon': { color: 'inherit' } }}
        />
      );
    } else if (method === 'Face Recognition') {
      return (
        <Chip
          icon={<Face fontSize="small" />}
          label="Face Only"
          color="primary"
          size="small"
          variant="outlined"
          sx={{ '& .MuiChip-icon': { color: 'inherit' } }}
        />
      );
    } else if (method === 'Manual') {
      return (
        <Chip
          label="Manual"
          color="default"
          size="small"
          variant="outlined"
        />
      );
    } else {
      return (
        <Chip
          label={method}
          color="default"
          size="small"
          variant="outlined"
        />
      );
    }
  };
  
  if (loading && attendances.length === 0) {
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
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {classCode ? `Attendance Report for ${classCode}` : 'Attendance Report'}
        </Typography>
        
        {classCode && (
          <Chip 
            label={`Class: ${classCode}`} 
            color="primary" 
            sx={{ ml: 1 }}
          />
        )}
        
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownloadReport}
        >
          Download
        </Button>
      </Box>
      
      {showFilters && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="subject-filter-label">Subject</InputLabel>
                <Select
                  labelId="subject-filter-label"
                  id="subject-filter"
                  name="subject_id"
                  value={filters.subject_id}
                  label="Subject"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="present">Present</MenuItem>
                  <MenuItem value="absent">Absent</MenuItem>
                  <MenuItem value="late">Late</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                sx={{ mr: 1 }}
              >
                Apply Filters
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && attendances.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <AlertTitle>No Records Found</AlertTitle>
          No attendance records match your criteria. Try adjusting your filters or adding new attendance records.
        </Alert>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verification Method</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((attendance) => (
                    <TableRow key={attendance.id}>
                      <TableCell>{attendance.date}</TableCell>
                      <TableCell>{attendance.time}</TableCell>
                      <TableCell>
                        {attendance.subject_name} ({attendance.subject_code})
                      </TableCell>
                      <TableCell>{getStatusChip(attendance.status)}</TableCell>
                      <TableCell>
                        {renderVerificationMethod(attendance.verification_method)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default AttendanceReport;
