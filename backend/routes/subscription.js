const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

// Import subscription controller
const {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionPlans,
  updateSubscription,
  cancelSubscription
} = require('../controllers/subscriptionController');

// Create checkout session
router.post('/subscription/create-checkout-session', protect, createCheckoutSession);

// Get subscription plans
router.get('/subscription/plans', getSubscriptionPlans);

// Handle webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Get user's subscription status
router.get('/subscription/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+stripeCustomerId +stripeSubscriptionId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let subscriptionStatus = {
      isSubscribed: user.isSubscribed || false,
      subscription: user.subscription || 'free',
      subscriptionDate: user.subscriptionDate || null
    };

    // If user has a Stripe subscription, get latest status from Stripe
    if (user.stripeSubscriptionId && stripe) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        subscriptionStatus.stripeStatus = subscription.status;
        subscriptionStatus.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      } catch (stripeError) {
        console.error('Error fetching Stripe subscription:', stripeError);
      }
    }

    res.json(subscriptionStatus);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update subscription
router.put('/subscription/update', protect, updateSubscription);

// Cancel subscription
router.post('/subscription/cancel', protect, cancelSubscription);

// Handle subscription success
router.get('/subscription/session', protect, async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      success: true,
      session: {
        status: session.status,
        customerEmail: session.customer_email,
        subscriptionId: session.subscription
      }
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ message: 'Error retrieving session details' });
  }
});

module.exports = router;
