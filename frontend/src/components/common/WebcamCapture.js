import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import Webcam from 'react-webcam';
import { PhotoCamera, Refresh } from '@mui/icons-material';

const WebcamCapture = ({ onImageCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(true);

  // Check if camera is available
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasCamera(videoDevices.length > 0);
        if (videoDevices.length === 0) {
          setError('No camera detected. Please connect a camera to capture your photo.');
        }
      } catch (err) {
        console.error('Error checking camera:', err);
        setError('Unable to access camera. Please ensure you have granted camera permissions.');
        setHasCamera(false);
      }
    };
    
    checkCamera();
  }, []);

  // Function to capture image from webcam
  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      try {
        setLoading(true);
        setError(null);
        
        // Capture image from webcam
        const imageSrc = webcamRef.current.getScreenshot();
        
        if (imageSrc) {
          console.log("Image captured successfully:", imageSrc.substring(0, 50) + "...");
          setCapturedImage(imageSrc);
          setLoading(false);
        } else {
          console.error("Failed to capture image - no image data returned");
          setError('Failed to capture image. Please try again.');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error capturing image:', error);
        setError('Failed to capture image. Please ensure your camera is working properly.');
        setLoading(false);
      }
    } else {
      console.error("Webcam reference is not available");
      setError('Webcam is not initialized. Please refresh the page and try again.');
    }
  }, [webcamRef]);

  // Function to reset captured image
  const resetImage = () => {
    setCapturedImage(null);
    setError(null);
  };

  // Function to confirm and use the captured image
  const confirmImage = () => {
    if (capturedImage && onImageCapture) {
      onImageCapture(capturedImage);
    } else {
      setError('No image captured. Please capture an image first.');
    }
  };

  // Function to handle webcam errors
  const handleWebcamError = (error) => {
    console.error('Webcam error:', error);
    setError('Failed to access camera. Please ensure you have granted camera permissions and that your camera is working properly.');
    setHasCamera(false);
  };

  // If no camera is available, show a fallback option
  if (!hasCamera) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Camera Not Available
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error || 'No camera detected. You can use a default avatar or try again later.'}
        </Alert>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Capture Profile Photo
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 2 }}>
        {!capturedImage ? (
          // Webcam view for capturing
          <Box sx={{ position: 'relative', width: '100%', height: 'auto' }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 640,
                height: 480,
                facingMode: "user",
              }}
              onUserMediaError={handleWebcamError}
              style={{ width: '100%', borderRadius: '8px' }}
              mirrored={true}
            />
            
            {loading && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px'
                }}
              >
                <CircularProgress color="primary" />
              </Box>
            )}
          </Box>
        ) : (
          // Display captured image
          <Box sx={{ width: '100%', height: 'auto' }}>
            <img
              src={capturedImage}
              alt="Captured"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>
        )}
      </Box>
      
      <Grid container spacing={2} justifyContent="center">
        {!capturedImage ? (
          // Button to capture image
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PhotoCamera />}
              onClick={captureImage}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Capture Photo'}
            </Button>
          </Grid>
        ) : (
          // Buttons for captured image
          <>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Refresh />}
                onClick={resetImage}
              >
                Retake
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={confirmImage}
              >
                Use This Photo
              </Button>
            </Grid>
          </>
        )}
        
        {onClose && (
          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default WebcamCapture; 