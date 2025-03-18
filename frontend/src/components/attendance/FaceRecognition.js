import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  AlertTitle,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
// import { loadModels, detectFace, recognizeFace, verifyLivenessBlink } from '../../services/face.service';
// import { markAttendance } from '../../services/attendance.service';
// import { getSubjects } from '../../services/attendance.service';
import FingerprintAuthentication from './FingerprintAuthentication';

const FaceRecognition = ({ user, classCode }) => {
  const webcamRef = useRef(null);
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [faceRecognized, setFaceRecognized] = useState(false);
  const [livenessVerified, setLivenessVerified] = useState(false);
  const [fingerprintVerified, setFingerprintVerified] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [error, setError] = useState(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  const steps = ['Select Subject', 'Face Detection', 'Face Recognition', 'Liveness Detection', 'Fingerprint Verification', 'Mark Attendance'];
  
  // Get token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  // Load mock subjects on component mount and validate token if present
  useEffect(() => {
    const initialize = async () => {
      try {
        // Simulate loading delay
        setTimeout(() => {
          // Mock subjects data
          const mockSubjects = [
            { id: 1, name: 'Mathematics', code: 'MATH101' },
            { id: 2, name: 'Advanced Calculus', code: 'MATH201' },
            { id: 3, name: 'Linear Algebra', code: 'MATH301' },
            { id: 4, name: 'Statistics', code: 'MATH401' },
          ];
          
          setSubjects(mockSubjects);
          
          // If classCode is provided, find and select the corresponding subject
          if (classCode) {
            const matchingSubject = mockSubjects.find(subject => subject.code === classCode);
            if (matchingSubject) {
              setSelectedSubject(matchingSubject.id);
              
              // If token is provided, validate it
              if (token) {
                // In a real app, this would call the backend to validate the token
                // For now, we'll simulate it with a mock validation
                
                // Simulate token validation (always valid in this mock)
                setIsTokenValid(true);
                toast.info(`Attendance link for ${matchingSubject.name} (${matchingSubject.code}) is valid`);
                
                // Skip the subject selection step if token is valid
                setActiveStep(1);
              } else {
                toast.info(`Subject ${matchingSubject.name} (${matchingSubject.code}) selected automatically`);
              }
            }
          }
          
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Initialization error:', error);
        setError('Failed to initialize. Please refresh the page and try again.');
        setLoading(false);
      }
    };
    
    initialize();
  }, [classCode, token]);
  
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };
  
  const handleNext = () => {
    if (activeStep === 0 && !selectedSubject) {
      toast.error('Please select a subject');
      return;
    }
    
    // Execute step-specific actions before advancing to next step
    if (activeStep === 0) {
      // After subject selection, proceed to face detection
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 1) {
      // After face detection, capture image for recognition
      simulateFaceDetection();
      if (faceDetected) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else if (activeStep === 2) {
      // After face recognition, start liveness detection
      simulateFaceRecognition();
      if (faceRecognized) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else if (activeStep === 3) {
      // After liveness detection, proceed to fingerprint verification
      simulateLivenessDetection();
      if (livenessVerified) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else if (activeStep === 4) {
      // After fingerprint verification, mark attendance
      if (fingerprintVerified) {
        setActiveStep((prevStep) => prevStep + 1);
      } else {
        toast.error('Please complete fingerprint verification first');
      }
    } else if (activeStep === 5) {
      // Mark attendance and complete the process
      simulateMarkAttendance();
      if (attendanceMarked) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      // Default case - just advance to next step
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setCapturedImage(null);
    setFaceDetected(false);
    setFaceRecognized(false);
    setLivenessVerified(false);
    setFingerprintVerified(false);
    setAttendanceMarked(false);
    setError(null);
  };
  
  const simulateFaceDetection = () => {
    if (webcamRef.current) {
      try {
        // Capture image from webcam instead of using a static image
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        
        // Simulate face detection with 90% success rate
        const success = Math.random() < 0.9;
        
        if (success) {
          setFaceDetected(true);
          toast.success('Face detected successfully!');
        } else {
          setFaceDetected(false);
          setError('No face detected. Please ensure your face is clearly visible.');
          setActiveStep(1); // Stay on the current step
        }
      } catch (error) {
        console.error('Face detection error:', error);
        setError('Failed to detect face. Please ensure your face is clearly visible.');
      }
    }
  };
  
  const simulateFaceRecognition = () => {
    try {
      // Simulate face recognition with 90% success rate
      const success = Math.random() < 0.9;
      
      if (success) {
        setFaceRecognized(true);
        toast.success('Face recognized successfully!');
      } else {
        setFaceRecognized(false);
        setError('Face not recognized. Please ensure you have registered your face.');
        setActiveStep(2); // Stay on the current step
      }
    } catch (error) {
      console.error('Face recognition error:', error);
      setError('Failed to recognize face. Please try again.');
    }
  };
  
  const simulateLivenessDetection = () => {
    try {
      // Simulate liveness detection with 90% success rate
      const success = Math.random() < 0.9;
      
      if (success) {
        setLivenessVerified(true);
        toast.success('Liveness verified successfully!');
      } else {
        setLivenessVerified(false);
        setError('Liveness verification failed. Please try again and ensure you blink naturally.');
        setActiveStep(3); // Stay on the current step
      }
    } catch (error) {
      console.error('Liveness verification error:', error);
      setError('Failed to verify liveness. Please try again.');
    }
  };
  
  // Add a handler for fingerprint verification success
  const handleFingerprintSuccess = () => {
    setFingerprintVerified(true);
    toast.success('Fingerprint verification successful!');
  };

  // Add a handler for fingerprint verification error
  const handleFingerprintError = (errorMessage) => {
    setFingerprintVerified(false);
    setError(errorMessage || 'Fingerprint verification failed. Please try again.');
  };
  
  // Modify the simulateMarkAttendance function to include fingerprint verification
  const simulateMarkAttendance = () => {
    try {
      // Check if fingerprint is verified
      if (!fingerprintVerified) {
        setError('Fingerprint verification is required before marking attendance.');
        return;
      }
      
      // Always succeed in marking attendance for demo purposes
      setAttendanceMarked(true);
      
      // Get the selected subject name and code
      const selectedSubjectObj = subjects.find(s => s.id === selectedSubject);
      const subjectInfo = selectedSubjectObj ? `${selectedSubjectObj.name} (${selectedSubjectObj.code})` : 'Unknown Subject';
      
      // Store attendance record in localStorage
      try {
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        
        // Create new attendance record
        const newRecord = {
          id: Date.now(),
          studentId: user?.id || 1,
          studentName: user?.name || 'John Doe',
          subjectId: selectedSubject,
          subjectName: selectedSubjectObj?.name || 'Unknown Subject',
          subjectCode: selectedSubjectObj?.code || 'UNKNOWN',
          timestamp: new Date().toISOString(),
          verificationMethod: 'Face Recognition + Fingerprint',
          status: 'Present'
        };
        
        // Add to records
        attendanceRecords.push(newRecord);
        
        // Save back to localStorage
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        
        console.log('Attendance record saved:', newRecord);
      } catch (storageError) {
        console.error('Error saving attendance record:', storageError);
      }
      
      toast.success(`Attendance marked successfully for ${subjectInfo}!`);
    } catch (error) {
      console.error('Attendance marking error:', error);
      setError('Failed to mark attendance. Please try again.');
      setActiveStep(5); // Stay on the current step
    }
  };
  
  // Modify the handleFinish function to include fingerprint verification
  const handleFinish = () => {
    // Check if fingerprint is verified
    if (!fingerprintVerified) {
      setError('Fingerprint verification is required before marking attendance.');
      return;
    }
    
    // Mark attendance directly
    try {
      // Always succeed in marking attendance for demo purposes
      setAttendanceMarked(true);
      
      // Get the selected subject name and code
      const selectedSubjectObj = subjects.find(s => s.id === selectedSubject);
      const subjectInfo = selectedSubjectObj ? `${selectedSubjectObj.name} (${selectedSubjectObj.code})` : 'Unknown Subject';
      
      // Store attendance record in localStorage
      try {
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
        
        // Create new attendance record
        const newRecord = {
          id: Date.now(),
          studentId: user?.id || 1,
          studentName: user?.name || 'John Doe',
          subjectId: selectedSubject,
          subjectName: selectedSubjectObj?.name || 'Unknown Subject',
          subjectCode: selectedSubjectObj?.code || 'UNKNOWN',
          timestamp: new Date().toISOString(),
          verificationMethod: 'Face Recognition + Fingerprint',
          status: 'Present'
        };
        
        // Add to records
        attendanceRecords.push(newRecord);
        
        // Save back to localStorage
        localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
        
        console.log('Attendance record saved:', newRecord);
      } catch (storageError) {
        console.error('Error saving attendance record:', storageError);
      }
      
      toast.success(`Attendance marked successfully for ${subjectInfo}!`);
      
      // Reset the form
      handleReset();
    } catch (error) {
      console.error('Attendance marking error:', error);
      setError('Failed to mark attendance. Please try again.');
    }
  };
  
  // Modify the getStepContent function to include fingerprint verification
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="subject-select-label">Subject</InputLabel>
              <Select
                labelId="subject-select-label"
                id="subject-select"
                value={selectedSubject}
                label="Subject"
                onChange={handleSubjectChange}
                disabled={isTokenValid}
              >
                <MenuItem value="">
                  <em>Select a subject</em>
                </MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Position your face in the camera
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 500, mb: 2 }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 500,
                  height: 375,
                  facingMode: "user"
                }}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={simulateFaceDetection}
              disabled={faceDetected}
            >
              Detect Face
            </Button>
            {faceDetected && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Face detected successfully!
              </Alert>
            )}
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Recognizing your face
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 500, mb: 2 }}>
              {capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              ) : (
                <Paper
                  sx={{
                    width: '100%',
                    height: 375,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No image captured
                  </Typography>
                </Paper>
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={simulateFaceRecognition}
              disabled={faceRecognized || !faceDetected}
            >
              Recognize Face
            </Button>
            {faceRecognized && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Face recognized successfully!
              </Alert>
            )}
          </Box>
        );
      case 3:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle1" gutterBottom>
              Liveness Detection - Please blink naturally
            </Typography>
            <Box sx={{ width: '100%', maxWidth: 500, mb: 2 }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 500,
                  height: 375,
                  facingMode: "user"
                }}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={simulateLivenessDetection}
              disabled={livenessVerified || !faceRecognized}
            >
              Verify Liveness
            </Button>
            {livenessVerified && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Liveness verified successfully!
              </Alert>
            )}
          </Box>
        );
      case 4:
        return (
          <Box sx={{ mt: 2 }}>
            <FingerprintAuthentication 
              user={user}
              onSuccess={handleFingerprintSuccess}
              onError={handleFingerprintError}
            />
          </Box>
        );
      case 5:
        return (
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Verification Complete
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Face Recognition
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Status:</Typography>
                    <Chip 
                      label={faceRecognized ? "Verified" : "Not Verified"} 
                      color={faceRecognized ? "success" : "error"} 
                      size="small" 
                    />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Fingerprint Verification
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Status:</Typography>
                    <Chip 
                      label={fingerprintVerified ? "Verified" : "Not Verified"} 
                      color={fingerprintVerified ? "success" : "error"} 
                      size="small" 
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            <Typography variant="body1" gutterBottom align="center">
              All verification steps completed. Ready to mark attendance.
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              onClick={simulateMarkAttendance}
              disabled={attendanceMarked || !fingerprintVerified}
              sx={{ mt: 2 }}
            >
              Mark Attendance
            </Button>
            
            {attendanceMarked && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <AlertTitle>Success</AlertTitle>
                Attendance marked successfully!
              </Alert>
            )}
          </Box>
        );
      default:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography>Unknown step</Typography>
          </Box>
        );
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && activeStep === 0) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        <AlertTitle>Error</AlertTitle>
        {error}
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" color="error" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Box>
      </Alert>
    );
  }
  
  return (
    <Paper sx={{ p: 3 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} disabled={isTokenValid && index === 0}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 4, mb: 2 }}>
        {activeStep === steps.length ? (
          // Final step - attendance marked
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Success</AlertTitle>
              Your attendance has been marked successfully!
            </Alert>
            
            <Typography variant="body1" paragraph>
              Subject: {subjects.find(s => s.id === selectedSubject)?.name || 'Unknown'}
            </Typography>
            
            <Typography variant="body1" paragraph>
              Date: {new Date().toLocaleDateString()}
            </Typography>
            
            <Typography variant="body1" paragraph>
              Time: {new Date().toLocaleTimeString()}
            </Typography>
            
            <Button onClick={handleReset} variant="contained" color="primary">
              Mark Another Attendance
            </Button>
          </Box>
        ) : (
          // Process steps
          <Box>
            {getStepContent(activeStep)}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0 || (isTokenValid && activeStep === 1)}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === 5 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFinish}
                  disabled={!fingerprintVerified}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default FaceRecognition;
