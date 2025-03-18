import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
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
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { Download, FilterList, Clear } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const ReportPage = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  
  // Get class code from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const classCode = queryParams.get('class');
  
  const [filters, setFilters] = useState({
    subject: classCode || '',
    startDate: '',
    endDate: '',
    status: '',
  });

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Create a single report for today's Mathematics 101 class
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const mockReports = [
        {
          id: 1,
          date: today,
          subject: 'Mathematics',
          status: 'present',
          time: currentTime,
          classCode: 'MATH101',
        }
      ];
      
      setReports(mockReports);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [classCode]);

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

  const applyFilters = () => {
    setLoading(true);
    // In a real app, you would call your API with the filters
    // For now, we'll just simulate a delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const resetFilters = () => {
    setFilters({
      subject: classCode || '', // Keep the class code if it was provided in the URL
      startDate: '',
      endDate: '',
      status: '',
    });
  };

  const downloadReport = () => {
    // In a real app, you would generate and download a report
    alert('Report download functionality would be implemented here');
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
          Attendance Reports
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {classCode ? 
            `Viewing attendance reports for ${classCode}` : 
            'View and download your attendance reports'}
        </Typography>

        {classCode && (
          <Chip 
            label={`Class: ${classCode}`} 
            color="primary" 
            sx={{ mb: 2 }}
            onDelete={() => {
              // In a real app, you would navigate to the reports page without the class parameter
              window.history.pushState({}, '', '/reports');
              setFilters({...filters, subject: ''});
            }}
          />
        )}

        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={downloadReport}
            >
              Download Report
            </Button>
          </Box>

          {showFilters && (
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="subject-label">Subject/Class</InputLabel>
                    <Select
                      labelId="subject-label"
                      id="subject"
                      name="subject"
                      value={filters.subject}
                      label="Subject/Class"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="MATH101">MATH101 - Mathematics</MenuItem>
                      <MenuItem value="MATH201">MATH201 - Advanced Calculus</MenuItem>
                      <MenuItem value="MATH301">MATH301 - Linear Algebra</MenuItem>
                      <MenuItem value="MATH401">MATH401 - Statistics</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status"
                      name="status"
                      value={filters.status}
                      label="Status"
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    onClick={applyFilters}
                    fullWidth
                  >
                    Apply Filters
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    onClick={resetFilters}
                    startIcon={<Clear />}
                    fullWidth
                  >
                    Reset Filters
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Class/Subject</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length > 0 ? (
                  reports
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>{report.time}</TableCell>
                        <TableCell>{report.classCode} - {report.subject}</TableCell>
                        <TableCell>
                          <Chip 
                            label={report.status} 
                            color={
                              report.status === 'present' ? 'success' : 
                              report.status === 'absent' ? 'error' : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={reports.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default ReportPage;
