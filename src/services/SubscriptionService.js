import axios from 'axios';

class SubscriptionService {
    static async updateSubscription(userId, subscriptionData) {
        try {
            const response = await axios.post('/api/subscriptions/update', {
                userId,
                ...subscriptionData
            });
            return response.data;
        } catch (error) {
            console.error('Error updating subscription:', error);
            throw error;
        }
    }

    static async getSubscriptionStatus(userId) {
        try {
            const response = await axios.get(`/api/subscriptions/status/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error getting subscription status:', error);
            throw error;
        }
    }

    static async cancelSubscription(userId) {
        try {
            const response = await axios.post('/api/subscriptions/cancel', { userId });
            return response.data;
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }
    }

    static async checkSubscriptionExpiry(userId) {
        try {
            const response = await axios.get(`/api/subscriptions/check-expiry/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error checking subscription expiry:', error);
            throw error;
        }
    }
}
