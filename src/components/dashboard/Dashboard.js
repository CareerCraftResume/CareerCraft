import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
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
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import Logo from '../common/Logo';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { subscription, features } = useSubscription();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleCreateResume = () => {
    navigate('/create-resume');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                Welcome back, {currentUser?.displayName || 'User'}!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/subscription"
                startIcon={<StarIcon />}
              >
                {subscription === 'premium' ? 'Manage Subscription' : 'Upgrade to Premium'}
              </Button>
            </Box>
            <Typography variant="body1" color="text.secondary">
              Your current plan: <strong>{subscription === 'premium' ? 'Premium' : 'Free'}</strong>
            </Typography>
          </Paper>
        </Grid>

        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Logo size="medium" />
            <Box>
              <Button
                variant="outlined"
                onClick={handleViewProfile}
                startIcon={<PersonIcon />}
                sx={{ mr: 2 }}
              >
                Profile
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Action Cards */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Create New Resume
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start building your professional resume with our easy-to-use builder.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="large"
                startIcon={<AddIcon />}
                onClick={handleCreateResume}
                color="primary"
              >
                Create Resume
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                My Resumes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and edit your existing resumes.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="large"
                startIcon={<DescriptionIcon />}
                onClick={() => navigate('/my-resumes')}
                color="primary"
              >
                View Resumes
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
