import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Box, Typography, CircularProgress } from '@mui/material';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateSubscriptionStatus } = useSubscription();

  useEffect(() => {
    const handleSubscriptionSuccess = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');

      if (sessionId) {
        try {
          const success = await updateSubscriptionStatus(sessionId);
          if (success) {
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              navigate('/dashboard', { 
                state: { 
                  subscriptionSuccess: true,
                  message: 'Successfully upgraded to Premium!' 
                }
              });
            }, 2000);
          }
        } catch (error) {
          console.error('Error updating subscription:', error);
          navigate('/dashboard', { 
            state: { 
              subscriptionError: true,
              message: 'There was an error processing your subscription. Please contact support.' 
            }
          });
        }
      }
    };

    handleSubscriptionSuccess();
  }, [location, navigate, updateSubscriptionStatus]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h5">
        Processing your subscription...
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Please wait while we confirm your payment
      </Typography>
    </Box>
  );
};

export default SubscriptionSuccess;
