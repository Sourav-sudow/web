import React, { useState, useEffect } from 'react';
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
  Grid,
  Chip,
} from '@mui/material';
import { Fingerprint, CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const FingerprintAuthentication = ({ onSuccess, onError, user }) => {
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [webAuthnSupported, setWebAuthnSupported] = useState(false);
  
  const steps = ['Check Compatibility', 'Scan Fingerprint', 'Verify Identity'];
  
  // Check WebAuthn support on component mount
  useEffect(() => {
    const checkWebAuthnSupport = async () => {
      setLoading(true);
      try {
        // Check if WebAuthn is supported
        if (window.PublicKeyCredential &&
            window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
          
          const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setWebAuthnSupported(available);
          
          if (!available) {
            setError('Your device does not support fingerprint authentication.');
            if (onError) onError('Fingerprint authentication not supported');
          }
        } else {
          setWebAuthnSupported(false);
          setError('Your browser does not support WebAuthn.');
          if (onError) onError('WebAuthn not supported');
        }
      } catch (error) {
        console.error('WebAuthn support check failed:', error);
        setError('Failed to check fingerprint authentication support.');
        if (onError) onError('Failed to check WebAuthn support');
      } finally {
        setLoading(false);
      }
    };
    
    checkWebAuthnSupport();
  }, [onError]);
  
  const startAuthentication = async () => {
    setScanning(true);
    setError(null);
    
    try {
      // Create challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      // Create authentication options
      const options = {
        publicKey: {
          challenge,
          timeout: 60000,
          userVerification: 'required',
          rpId: window.location.hostname,
        }
      };
      
      // Start authentication
      const credential = await navigator.credentials.get(options);
      
      if (credential) {
        setVerified(true);
        setActiveStep(2);
        toast.success('Fingerprint verified successfully!');
        if (onSuccess) onSuccess();
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Fingerprint verification failed. Please try again.');
      if (onError) onError('Authentication failed');
    } finally {
      setScanning(false);
    }
  };
  
  const resetScan = () => {
    setScanning(false);
    setVerified(false);
    setError(null);
    setActiveStep(0);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking Fingerprint Capabilities...
        </Typography>
      </Box>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Fingerprint Authentication
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        {activeStep === 0 && (
          <>
            <Box 
              sx={{ 
                width: 200, 
                height: 200, 
                border: '2px dashed #ccc', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
                backgroundColor: webAuthnSupported ? '#e8f5e9' : '#ffebee'
              }}
            >
              {webAuthnSupported ? (
                <CheckCircle sx={{ fontSize: 100, color: '#4caf50' }} />
              ) : (
                <ErrorIcon sx={{ fontSize: 100, color: '#f44336' }} />
              )}
            </Box>
            <Typography variant="body1" gutterBottom align="center">
              {webAuthnSupported 
                ? 'Your device supports fingerprint authentication'
                : 'Your device does not support fingerprint authentication'}
            </Typography>
            {webAuthnSupported && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => setActiveStep(1)}
                sx={{ mt: 2 }}
              >
                Continue
              </Button>
            )}
          </>
        )}
        
        {activeStep === 1 && (
          <>
            <Box 
              sx={{ 
                width: 200, 
                height: 200, 
                border: '2px solid #2196f3', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
                backgroundColor: '#e3f2fd',
                position: 'relative'
              }}
            >
              <Fingerprint 
                sx={{ 
                  fontSize: 100, 
                  color: scanning ? '#2196f3' : '#757575',
                  animation: scanning ? 'pulse 1.5s infinite' : 'none',
                  '@keyframes pulse': {
                    '0%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                    '100%': { opacity: 1 },
                  }
                }} 
              />
            </Box>
            <Typography variant="body1" gutterBottom align="center">
              {scanning ? 'Scanning fingerprint...' : 'Ready to scan'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={startAuthentication}
              disabled={scanning}
              sx={{ mt: 2 }}
            >
              {scanning ? 'Scanning...' : 'Start Scan'}
            </Button>
          </>
        )}
        
        {activeStep === 2 && (
          <>
            <Box 
              sx={{ 
                width: 200, 
                height: 200, 
                border: '2px solid #4caf50', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
                backgroundColor: '#e8f5e9'
              }}
            >
              {verified ? (
                <CheckCircle sx={{ fontSize: 100, color: '#4caf50' }} />
              ) : (
                <ErrorIcon sx={{ fontSize: 100, color: '#f44336' }} />
              )}
            </Box>
            <Typography variant="body1" gutterBottom align="center">
              {verified ? 'Fingerprint verified successfully!' : 'Fingerprint verification failed!'}
            </Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Grid item>
                <Chip 
                  label={`User: ${user?.name || 'Unknown'}`}
                  color="primary"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`ID: ${user?.id || 'Unknown'}`}
                  color="primary"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Chip 
                  label={`Status: ${verified ? 'Verified' : 'Failed'}`}
                  color={verified ? "success" : "error"}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={resetScan}
              sx={{ mt: 3 }}
            >
              Scan Again
            </Button>
          </>
        )}
      </Box>
      
      <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          Fingerprint Authentication Information:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • This system uses WebAuthn for secure biometric verification.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Your fingerprint data never leaves your device.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • If you experience issues, ensure your browser supports WebAuthn and your device has a fingerprint sensor.
        </Typography>
      </Box>
    </Paper>
  );
};

export default FingerprintAuthentication; 