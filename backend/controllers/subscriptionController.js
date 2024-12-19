const User = require('../models/User');
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  basic: {
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    name: 'Basic Plan',
    features: ['Up to 3 resumes', 'Basic templates', 'Email support']
  },
  premium: {
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    name: 'Premium Plan',
    features: ['Unlimited resumes', 'All templates', 'Priority support', 'AI suggestions']
  }
};

// @desc    Get subscription plans
// @route   GET /api/subscription/plans
// @access  Public
exports.getSubscriptionPlans = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    // Get real-time prices from Stripe
    const prices = await stripe.prices.list({
      active: true,
      limit: 2
    });

    const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => {
      const price = prices.data.find(p => p.id === plan.priceId);
      return {
        ...plan,
        id: key,
        price: price ? price.unit_amount / 100 : null,
        currency: price ? price.currency : 'usd'
      };
    });

    res.json(plans);
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: 'Error fetching subscription plans' });
  }
};

// @desc    Create Stripe checkout session
// @route   POST /api/subscription/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    const { priceId, planId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user already has a subscription, create a change subscription session
    if (user.stripeSubscriptionId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.CLIENT_URL}/account`
      });
      return res.json({ url: session.url });
    }

    // Create new subscription checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        planId: planId
      },
      subscription_data: {
        metadata: {
          userId: user._id.toString(),
          planId: planId
        }
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
};

// @desc    Update subscription
// @route   PUT /api/subscription/update
// @access  Private
exports.updateSubscription = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    const { priceId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !user.stripeSubscriptionId) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Update the subscription
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
      proration_behavior: 'always_invoice',
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ message: 'Error updating subscription' });
  }
};

// @desc    Cancel subscription
// @route   POST /api/subscription/cancel
// @access  Private
exports.cancelSubscription = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.stripeSubscriptionId) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Cancel at period end
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ message: 'Error cancelling subscription' });
  }
};

// @desc    Handle Stripe webhook events
// @route   POST /api/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ message: 'Stripe is not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await handlePaymentFailed(invoice);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ message: 'Error handling webhook' });
  }
};

// Helper functions for webhook handlers
async function handleCheckoutSessionCompleted(session) {
  const user = await User.findById(session.metadata.userId);
  if (!user) return;

  await User.findByIdAndUpdate(session.metadata.userId, {
    isSubscribed: true,
    subscription: session.metadata.planId || 'premium',
    subscriptionDate: new Date(),
    stripeCustomerId: session.customer,
    stripeSubscriptionId: session.subscription
  });
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (!user) return;

  const status = subscription.status === 'active' || subscription.status === 'trialing';
  await user.updateOne({
    isSubscribed: status,
    subscription: status ? 'premium' : 'free'
  });
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (!user) return;

  await user.updateOne({
    isSubscribed: false,
    subscription: 'free',
    subscriptionDate: null,
    stripeSubscriptionId: null
  });
}

async function handlePaymentFailed(invoice) {
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) return;

  // You might want to notify the user about the failed payment
  console.log(`Payment failed for user ${user.email}`);
}
