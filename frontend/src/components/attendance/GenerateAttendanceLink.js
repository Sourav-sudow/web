import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  InputAdornment,
  Snackbar,
} from '@mui/material';
import { ContentCopy, Share, Link as LinkIcon } from '@mui/icons-material';
import { generateAttendanceLink } from '../../services/attendance.service';
import { toast } from 'react-toastify';

const GenerateAttendanceLink = ({ classes, onClose, open }) => {
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [duration, setDuration] = useState(60); // Default 60 minutes
  const [generatedLink, setGeneratedLink] = useState(null);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedClass('');
      setDuration(60);
      setGeneratedLink(null);
      setError(null);
    }
  }, [open]);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleGenerateLink = async () => {
    if (!selectedClass) {
      toast.error('Please select a class');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const selectedClassObj = classes.find(cls => cls.code === selectedClass);
      
      const linkData = {
        classCode: selectedClass,
        duration: duration * 60 * 1000, // Convert minutes to milliseconds
        className: selectedClassObj?.name || selectedClass,
        maxUsage: selectedClassObj?.students || 30 // Use class student count or default to 30
      };

      const result = await generateAttendanceLink(linkData);
      setGeneratedLink(result);
      
      // Trigger a refresh of the active links list
      // This is a workaround - in a real app, you might use context or Redux
      window.dispatchEvent(new CustomEvent('attendanceLinksUpdated'));
      
      toast.success('Attendance link generated successfully!');
    } catch (error) {
      console.error('Link generation error:', error);
      setError('Failed to generate attendance link. Please try again.');
      toast.error('Failed to generate attendance link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink.link)
        .then(() => {
          setCopySuccess(true);
          toast.success('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Copy failed:', err);
          toast.error('Failed to copy link');
        });
    }
  };

  const handleShareLink = () => {
    if (generatedLink && navigator.share) {
      navigator.share({
        title: `Attendance for ${generatedLink.classCode}`,
        text: `Please mark your attendance for ${generatedLink.classCode}`,
        url: generatedLink.link
      })
      .then(() => toast.success('Link shared successfully!'))
      .catch(error => {
        console.error('Share failed:', error);
        toast.error('Failed to share link');
      });
    } else {
      handleCopyLink();
    }
  };

  const formatExpiryTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <LinkIcon sx={{ mr: 1 }} />
          Generate Attendance Link
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText paragraph>
          Generate a unique attendance link for your class. Students can use this link to mark their attendance via face recognition.
        </DialogContentText>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="class-select-label">Class</InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              value={selectedClass}
              label="Class"
              onChange={handleClassChange}
              disabled={loading}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.code}>
                  {cls.name} ({cls.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="duration-select-label">Link Duration</InputLabel>
            <Select
              labelId="duration-select-label"
              id="duration-select"
              value={duration}
              label="Link Duration"
              onChange={handleDurationChange}
              disabled={loading}
            >
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={120}>2 hours</MenuItem>
              <MenuItem value={240}>4 hours</MenuItem>
              <MenuItem value={480}>8 hours</MenuItem>
              <MenuItem value={1440}>24 hours</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {generatedLink && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" gutterBottom>
              Attendance Link Generated
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              value={generatedLink.link}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyLink} edge="end">
                      <ContentCopy />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Class: {generatedLink.classCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expires at: {formatExpiryTime(generatedLink.expiresAt)}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Share />}
                onClick={handleShareLink}
                fullWidth
              >
                Share Link
              </Button>
            </Box>
          </Paper>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        {!generatedLink && (
          <Button
            onClick={handleGenerateLink}
            color="primary"
            variant="contained"
            disabled={loading || !selectedClass}
            startIcon={loading ? <CircularProgress size={20} /> : <LinkIcon />}
          >
            {loading ? 'Generating...' : 'Generate Link'}
          </Button>
        )}
      </DialogActions>
      
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Link copied to clipboard!"
      />
    </Dialog>
  );
};

export default GenerateAttendanceLink; 