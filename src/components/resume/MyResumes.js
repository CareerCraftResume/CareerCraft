import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  CircularProgress,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as DuplicateIcon,
  Download as DownloadIcon,
  Description as ResumeIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const MyResumes = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchResumes();
  }, [currentUser, navigate]);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user data and token
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !storedUser) {
        throw new Error('Please log in to view your resumes');
      }

      // Get user ID
      const userId = storedUser._id || storedUser.id;
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      console.log('Fetching resumes for user:', userId);

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: {
          userId: userId // Add userId as a query parameter
        }
      };

      // Make API call to get resumes for specific user
      const response = await axios.get(`${API_BASE_URL}/api/resumes/user/${userId}`, config);
      console.log('Resume response:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setResumes(response.data);
        if (response.data.length === 0) {
          console.log('No resumes found for user:', userId);
        }
      } else if (response.data && response.data.resumes) {
        setResumes(response.data.resumes);
        if (response.data.resumes.length === 0) {
          console.log('No resumes found for user:', userId);
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      let errorMessage = 'Failed to fetch your resumes';
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'No resumes found. Create a new resume to get started!';
        } else {
          errorMessage = error.response.data?.message || 'Server error occurred';
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/resume/new');
  };

  const handleEdit = (resumeId) => {
    navigate(`/resume/edit/${resumeId}`);
  };

  const handleDuplicate = async (resumeId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(`${API_BASE_URL}/api/resumes/${resumeId}/duplicate`, {}, config);
      if (response.data && response.data._id) {
        setSuccess('Resume duplicated successfully');
        fetchResumes();
      } else {
        throw new Error('Failed to duplicate resume');
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
      setError(error.response?.data?.message || error.message || 'Failed to duplicate resume');
    }
  };

  const handleDownload = async (resumeId) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/resumes/${resumeId}/download`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccess('Resume downloaded successfully');
    } catch (error) {
      console.error('Error downloading resume:', error);
      setError(error.response?.data?.message || error.message || 'Failed to download resume');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResume) return;
    
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.delete(`${API_BASE_URL}/api/resumes/${selectedResume._id}`, config);
      setSuccess('Resume deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedResume(null);
      fetchResumes();
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError(error.response?.data?.message || error.message || 'Failed to delete resume');
    }
  };

  const handleRename = async () => {
    if (!selectedResume || !newName.trim()) return;
    
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      await axios.patch(`${API_BASE_URL}/api/resumes/${selectedResume._id}`, {
        title: newName.trim()
      }, config);

      setSuccess('Resume renamed successfully');
      setRenameDialogOpen(false);
      setSelectedResume(null);
      setNewName('');
      fetchResumes();
    } catch (error) {
      console.error('Error renaming resume:', error);
      setError(error.response?.data?.message || error.message || 'Failed to rename resume');
    }
  };

  const renderResumes = () => {
    if (resumes.length === 0) {
      return (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary">
            You haven't created any resumes yet. Click "Create New Resume" to get started!
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {resumes.map((resume) => (
          <Grid item xs={12} sm={6} md={4} key={resume._id}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <ResumeIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="h2" noWrap>
                    {resume.title || 'Untitled Resume'}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Last modified: {new Date(resume.updatedAt).toLocaleDateString()}
                </Typography>
                {resume.basics && (
                  <Box mt={1}>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {resume.basics.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {resume.basics.email}
                    </Typography>
                  </Box>
                )}
              </CardContent>
              <CardActions>
                <Tooltip title="Edit">
                  <IconButton onClick={() => handleEdit(resume._id)} size="small">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate">
                  <IconButton onClick={() => handleDuplicate(resume._id)} size="small">
                    <DuplicateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download PDF">
                  <IconButton onClick={() => handleDownload(resume._id)} size="small">
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    onClick={() => {
                      setSelectedResume(resume);
                      setDeleteDialogOpen(true);
                    }}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1">
            My Resumes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Create New Resume
          </Button>
        </Box>

        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          renderResumes()
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedResume?.title || 'this resume'}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
        <DialogTitle>Rename Resume</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRename} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyResumes;
