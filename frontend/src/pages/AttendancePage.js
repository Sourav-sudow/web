import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert, AlertTitle, TextField, Button, InputAdornment, IconButton, Divider, Chip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentPaste, ArrowForward, Link as LinkIcon, Fingerprint, Security } from '@mui/icons-material';
import FaceRecognition from '../components/attendance/FaceRecognition';
import AttendanceReport from '../components/attendance/AttendanceReport';
import { toast } from 'react-toastify';

const AttendancePage = ({ user }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualLink, setManualLink] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get class code and token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const classCode = queryParams.get('class');
  const token = queryParams.get('token');

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // If class parameter is present, switch to the appropriate tab
    if (classCode) {
      setTabValue(0); // Default to "Mark Attendance" tab when coming from class card or link
    }

    return () => clearTimeout(timer);
  }, [classCode]);

  const handleTabChange = (event, newValue) => {
    // If token is present, don't allow switching tabs
    if (token && newValue !== 0) {
      return;
    }
    setTabValue(newValue);
  };

  const handleManualLinkChange = (event) => {
    setManualLink(event.target.value);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setManualLink(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      toast.error('Failed to read from clipboard');
    }
  };

  const handleSubmitLink = () => {
    if (!manualLink) {
      toast.error('Please enter an attendance link');
      return;
    }

    try {
      // Try to parse the URL
      const url = new URL(manualLink);
      
      // Extract class code and token from the URL
      const params = new URLSearchParams(url.search);
      const linkClassCode = params.get('class');
      const linkToken = params.get('token');
      
      if (!linkClassCode || !linkToken) {
        toast.error('Invalid attendance link format');
        return;
      }
      
      // Navigate to the same page but with the extracted parameters
      navigate(`/attendance?class=${linkClassCode}&token=${linkToken}`);
      
      // Reset the input field
      setManualLink('');
      setShowLinkInput(false);
      
      toast.success('Attendance link applied successfully');
    } catch (error) {
      console.error('Invalid URL:', error);
      toast.error('Invalid URL format');
    }
  };

  const toggleLinkInput = () => {
    setShowLinkInput(!showLinkInput);
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
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance System
        </Typography>
        
        <Paper sx={{ mb: 3, p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Security color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Enhanced Security with Multi-Factor Authentication
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our attendance system now features dual biometric verification with both face recognition and fingerprint authentication. 
            This ensures higher accuracy and prevents unauthorized attendance marking.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip label="Face Recognition" size="small" color="primary" variant="outlined" />
            <Chip label="Fingerprint Verification" size="small" color="secondary" variant="outlined" icon={<Fingerprint />} />
            <Chip label="Enhanced Security" size="small" color="success" variant="outlined" />
          </Box>
        </Paper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Mark Attendance" />
                <Tab label="Attendance Report" />
              </Tabs>
              
              {token && (
                <Box sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                  <Alert severity="info">
                    <AlertTitle>Attendance Link Detected</AlertTitle>
                    You are marking attendance via a shared link. Your attendance will be recorded for this specific session.
                  </Alert>
                </Box>
              )}
              
              {!token && tabValue === 0 && (
                <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Have an attendance link?
                  </Typography>
                  
                  {showLinkInput ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Paste attendance link here"
                        value={manualLink}
                        onChange={handleManualLinkChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={handlePasteFromClipboard}
                                title="Paste from clipboard"
                              >
                                <ContentPaste fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitLink}
                        disabled={!manualLink}
                        sx={{ ml: 1 }}
                        endIcon={<ArrowForward />}
                      >
                        Go
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<LinkIcon />}
                      onClick={toggleLinkInput}
                    >
                      Enter Attendance Link
                    </Button>
                  )}
                </Box>
              )}
            </Paper>
            
            <Box sx={{ mt: 3 }}>
              {tabValue === 0 && (
                <FaceRecognition user={user} classCode={classCode} />
              )}
              
              {tabValue === 1 && (
                <AttendanceReport user={user} />
              )}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default AttendancePage;
