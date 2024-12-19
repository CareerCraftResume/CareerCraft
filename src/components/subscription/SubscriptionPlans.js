import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Create 1 Resume',
      'Basic Templates',
      'PDF Export',
      'Basic Resume Analysis',
      'Standard Support'
    ],
    buttonText: 'Current Plan',
    priceId: null
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 20.00,
    features: [
      'Unlimited Resumes',
      'All Premium Templates',
      'Multiple Export Formats',
      'Advanced AI Analysis',
      'Cover Letter Generator',
      'Priority Support',
      'Custom Branding',
      'ATS Optimization'
    ],
    buttonText: 'Upgrade Now',
    priceId: process.env.REACT_APP_STRIPE_PRICE_ID
  }
];

const SubscriptionPlans = () => {
  const theme = useTheme();
  const { subscription } = useSubscription();
  const { currentUser } = useAuth();

  const handleUpgrade = async (priceId) => {
    if (!priceId) return; // Free plan or already subscribed
    
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create checkout session
      const response = await axios.post(
        'https://careercraft-00c938b04bb3.herokuapp.com/api/subscription/create-checkout-session',
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom>
          Choose Your Plan
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Select the perfect plan for your resume building needs
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.id} xs={12} sm={6} md={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[10],
                },
                ...(plan.id === 'premium' && {
                  border: `2px solid ${theme.palette.primary.main}`,
                }),
              }}
            >
              {plan.id === 'premium' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: -30,
                    transform: 'rotate(45deg)',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    padding: '5px 40px',
                  }}
                >
                  Popular
                </Box>
              )}
              <CardHeader
                title={plan.name}
                titleTypographyProps={{ align: 'center', variant: 'h4' }}
                sx={{
                  backgroundColor: theme.palette.grey[50],
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'baseline',
                    mb: 2,
                  }}
                >
                  <Typography component="h2" variant="h3" color="textPrimary">
                    ${plan.price}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    /month
                  </Typography>
                </Box>
                <List>
                  {plan.features.map((feature) => (
                    <ListItem key={feature} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
                <Button
                  fullWidth
                  variant={plan.id === 'premium' ? 'contained' : 'outlined'}
                  color="primary"
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={() => handleUpgrade(plan.priceId)}
                  disabled={
                    (plan.id === 'free' && subscription === 'free') ||
                    (plan.id === 'premium' && subscription === 'premium')
                  }
                >
                  {subscription === plan.id ? 'Current Plan' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPlans;
