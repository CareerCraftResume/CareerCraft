import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

class StripeService {
    static async createPaymentIntent(amount, currency = 'usd') {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    currency,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }

            const data = await response.json();
            return data.clientSecret;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    static async createSubscription(priceId) {
        try {
            const response = await fetch('/api/create-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create subscription');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    static async cancelSubscription(subscriptionId) {
        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }
    }

    static async getSubscriptionStatus(subscriptionId) {
        try {
            const response = await fetch(`/api/subscription-status/${subscriptionId}`);
            
            if (!response.ok) {
                throw new Error('Failed to get subscription status');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error getting subscription status:', error);
            throw error;
        }
    }
}

export { stripePromise, StripeService };
