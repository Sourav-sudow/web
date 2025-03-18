import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  ContentCopy,
  Share,
  Delete,
  Link as LinkIcon,
  Refresh,
  QrCode,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const ActiveAttendanceLinks = ({ classes, user }) => {
  const [loading, setLoading] = useState(true);
  const [activeLinks, setActiveLinks] = useState([]);
  const [error, setError] = useState(null);
  const [openQRDialog, setOpenQRDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second to keep the countdown accurate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Load active links on component mount
  useEffect(() => {
    fetchActiveLinks();
    
    // Add event listener for link updates
    const handleLinksUpdated = () => {
      console.log('Attendance links updated event received');
      fetchActiveLinks();
    };
    
    window.addEventListener('attendanceLinksUpdated', handleLinksUpdated);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('attendanceLinksUpdated', handleLinksUpdated);
    };
  }, [user]);

  // Check for expired links and remove them
  useEffect(() => {
    const checkExpiredLinks = () => {
      const now = new Date();
      const updatedLinks = activeLinks.filter(link => {
        const expiry = new Date(link.expiresAt);
        return expiry > now;
      });
      
      if (updatedLinks.length !== activeLinks.length) {
        setActiveLinks(updatedLinks);
        if (activeLinks.length > 0 && updatedLinks.length === 0) {
          toast.info('All attendance links have expired.');
        }
      }
    };
    
    checkExpiredLinks();
  }, [currentTime, activeLinks]);

  const fetchActiveLinks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is newly registered
      const isNewUser = user && user.isNewUser;
      
      // Simulate API call with mock data
      setTimeout(() => {
        // If user is newly registered, show empty list
        if (isNewUser) {
          setActiveLinks([]);
          setLoading(false);
          setRefreshing(false);
          return;
        }
        
        // Check if user has any stored links in localStorage
        const storedLinks = localStorage.getItem('teacherAttendanceLinks');
        if (storedLinks) {
          try {
            const parsedLinks = JSON.parse(storedLinks);
            
            // Filter out expired links
            const now = new Date();
            const validLinks = parsedLinks.filter(link => {
              const expiry = new Date(link.expiresAt);
              return expiry > now;
            });
            
            console.log('Loaded active links from localStorage:', validLinks);
            setActiveLinks(validLinks);
            setLoading(false);
            setRefreshing(false);
            return;
          } catch (e) {
            console.error('Error parsing stored links:', e);
            // Continue with mock data if parsing fails
          }
        }
        
        // If no stored links or parsing failed, use empty array
        setActiveLinks([]);
        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching active links:', error);
      setError('Failed to load active attendance links. Please try again.');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchActiveLinks();
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Copy failed:', err);
        toast.error('Failed to copy link');
      });
  };

  const handleShareLink = (link, classCode) => {
    if (navigator.share) {
      navigator.share({
        title: `Attendance for ${classCode}`,
        text: `Please mark your attendance for ${classCode}`,
        url: link
      })
      .then(() => toast.success('Link shared successfully!'))
      .catch(error => {
        console.error('Share failed:', error);
        toast.error('Failed to share link');
      });
    } else {
      handleCopyLink(link);
    }
  };

  const handleDeleteLink = (id) => {
    // In a real app, this would call the backend API to delete the link
    // For now, we'll just remove it from the local state
    const updatedLinks = activeLinks.filter(link => link.id !== id);
    setActiveLinks(updatedLinks);
    
    // Update localStorage
    localStorage.setItem('teacherAttendanceLinks', JSON.stringify(updatedLinks));
    
    toast.success('Attendance link deleted successfully!');
  };

  const handleShowQRDialog = (link) => {
    setSelectedLink(link);
    setOpenQRDialog(true);
  };

  const handleCloseQRDialog = () => {
    setOpenQRDialog(false);
  };

  const formatTimeRemaining = (expiryTime) => {
    const expiry = new Date(expiryTime);
    const diffMs = expiry - currentTime;
    
    if (diffMs <= 0) {
      return 'Expired';
    }
    
    // Calculate hours, minutes, and seconds
    const diffSecs = Math.floor(diffMs / 1000);
    const hours = Math.floor(diffSecs / 3600);
    const minutes = Math.floor((diffSecs % 3600) / 60);
    const seconds = diffSecs % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getProgressPercentage = (usageCount, maxUsage) => {
    return (usageCount / maxUsage) * 100;
  };

  const getExpiryColor = (expiryTime) => {
    const expiry = new Date(expiryTime);
    const diffMs = expiry - currentTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins <= 5) {
      return 'error'; // Red for less than 5 minutes
    } else if (diffMins <= 15) {
      return 'warning'; // Orange for less than 15 minutes
    } else {
      return 'secondary'; // Default color
    }
  };

  if (loading && !refreshing) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <LinkIcon sx={{ mr: 1 }} />
          Active Attendance Links
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={refreshing ? <CircularProgress size={20} /> : <Refresh />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>

      {activeLinks.length === 0 ? (
        <Alert severity="info">
          No active attendance links found. Generate a new link to allow students to mark their attendance.
        </Alert>
      ) : (
        <List>
          {activeLinks.map((link, index) => (
            <React.Fragment key={link.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 2,
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="div">
                      {link.className}
                    </Typography>
                    <Chip
                      label={link.classCode}
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                  <Chip
                    label={`Expires in: ${formatTimeRemaining(link.expiresAt)}`}
                    size="small"
                    color={getExpiryColor(link.expiresAt)}
                  />
                </Box>

                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={link.link}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copy Link">
                          <IconButton
                            edge="end"
                            onClick={() => handleCopyLink(link.link)}
                            size="small"
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Usage: {link.usageCount} / {link.maxUsage} students
                  </Typography>
                  <Box sx={{ display: 'flex' }}>
                    <Tooltip title="Show Link Details">
                      <IconButton
                        onClick={() => handleShowQRDialog(link)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <QrCode fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share Link">
                      <IconButton
                        onClick={() => handleShareLink(link.link, link.classCode)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Share fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Link">
                      <IconButton
                        onClick={() => handleDeleteLink(link.id)}
                        size="small"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: '100%',
                    height: 4,
                    bgcolor: 'grey.200',
                    borderRadius: 2,
                    mt: 1,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${getProgressPercentage(link.usageCount, link.maxUsage)}%`,
                      bgcolor: 'primary.main',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}

      {/* Link Details Dialog */}
      <Dialog open={openQRDialog} onClose={handleCloseQRDialog}>
        <DialogTitle>
          Attendance Link Details
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Students can use this link to mark their attendance for {selectedLink?.className} ({selectedLink?.classCode}).
          </DialogContentText>
          
          {selectedLink && (
            <Box sx={{ my: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                value={selectedLink.link}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(selectedLink.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expires: {new Date(selectedLink.expiresAt).toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Usage: {selectedLink.usageCount} of {selectedLink.maxUsage} students ({Math.round((selectedLink.usageCount / selectedLink.maxUsage) * 100)}%)
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 8,
                    bgcolor: 'grey.200',
                    borderRadius: 2,
                    mt: 1,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${getProgressPercentage(selectedLink.usageCount, selectedLink.maxUsage)}%`,
                      bgcolor: 'primary.main',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
          
          <Typography 
            variant="body2" 
            color={selectedLink ? getExpiryColor(selectedLink.expiresAt) + '.main' : 'text.secondary'} 
            align="center"
            sx={{ fontWeight: 'bold' }}
          >
            Expires in: {selectedLink ? formatTimeRemaining(selectedLink.expiresAt) : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQRDialog}>Close</Button>
          {selectedLink && (
            <Button
              onClick={() => {
                handleCopyLink(selectedLink.link);
                handleCloseQRDialog();
              }}
              color="primary"
              startIcon={<ContentCopy />}
            >
              Copy Link
            </Button>
          )}
          {selectedLink && navigator.share && (
            <Button
              onClick={() => {
                handleShareLink(selectedLink.link, selectedLink.classCode);
                handleCloseQRDialog();
              }}
              color="primary"
              startIcon={<Share />}
            >
              Share Link
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ActiveAttendanceLinks; 