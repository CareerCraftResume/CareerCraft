import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DashboardButton = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    // For now, always navigate to dashboard until auth is set up
    navigate('/dashboard');
  };

  return (
    <Box position="fixed" left={24} top={24} zIndex={1000}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleReturn}
        variant="contained"
        sx={{
          mb: 3,
          backgroundColor: (theme) => theme.palette.primary.main,
          color: 'white',
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary.dark,
          },
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default DashboardButton;
