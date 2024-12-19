import React from 'react';
import { Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const StripeCheckout = () => {
  const { currentUser } = useAuth();

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/create-checkout-session`,
        {
          priceId: process.env.REACT_APP_STRIPE_PRICE_ID
        },
        {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        }
      );

      // Redirect to Stripe checkout
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (result.error) {
        console.error('Error:', result.error);
      }
    } catch (error) {
      console.error('Error in payment:', error);
    }
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      onClick={handleCheckout}
      sx={{ mt: 3 }}
    >
      Upgrade to Premium
    </Button>
  );
};

export default StripeCheckout;
