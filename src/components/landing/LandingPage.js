import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  Stack,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Brush as BrushIcon,
} from '@mui/icons-material';
import Logo from '../common/Logo';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: 2,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    }}
  >
    <Stack spacing={2} alignItems="center" textAlign="center">
      <Box
        sx={{
          p: 2,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon fontSize="large" />
      </Box>
      <Typography variant="h6" component="h3" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {description}
      </Typography>
    </Stack>
  </Paper>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      // Redirect based on user role
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const features = [
    {
      icon: PsychologyIcon,
      title: 'AI-Powered',
      description: 'Smart suggestions and auto-completion powered by advanced AI to create perfect resumes.',
    },
    {
      icon: SpeedIcon,
      title: 'Quick & Easy',
      description: 'Create professional resumes in minutes with our intuitive builder interface.',
    },
    {
      icon: BrushIcon,
      title: 'Beautiful Templates',
      description: 'Choose from a variety of modern, ATS-friendly resume templates.',
    },
    {
      icon: DescriptionIcon,
      title: 'ATS Optimized',
      description: 'Ensure your resume passes Applicant Tracking Systems with our optimized formats.',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: 4,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Logo size="medium" />
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4F46E5 30%, #DB2777 90%)',
                },
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Box>

        {/* Hero Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: 'linear-gradient(45deg, #6366F1, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Craft Your Perfect Resume with AI
              </Typography>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, fontWeight: 500 }}
              >
                Create professional, ATS-friendly resumes in minutes with our AI-powered builder
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #6366F1 30%, #EC4899 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #4F46E5 30%, #DB2777 90%)',
                  },
                }}
              >
                Start Building For Free
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-image.png"
                alt="Resume Builder Preview"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Typography
            variant="h2"
            align="center"
            sx={{
              mb: 8,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
            }}
          >
            Why Choose CareerCraft?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
