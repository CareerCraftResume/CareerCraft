import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium'
};

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(SUBSCRIPTION_TIERS.FREE);
  const [subscriptionDate, setSubscriptionDate] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetchSubscriptionStatus();
    }
  }, [currentUser]);

  const fetchSubscriptionStatus = async () => {
    if (!currentUser) return;

    try {
      const response = await axios.get(`/api/users/${currentUser._id}/subscription`);
      const { subscription: userSubscription, subscriptionDate: userSubscriptionDate } = response.data;
      
      setSubscription(userSubscription || SUBSCRIPTION_TIERS.FREE);
      setSubscriptionDate(userSubscriptionDate || null);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setSubscription(SUBSCRIPTION_TIERS.FREE);
      setSubscriptionDate(null);
    }
  };

  const updateSubscriptionStatus = async (sessionId) => {
    if (!currentUser) return false;

    try {
      const now = new Date().toISOString();
      const response = await axios.post(`/api/users/${currentUser._id}/subscription`, {
        subscription: SUBSCRIPTION_TIERS.PREMIUM,
        subscriptionDate: now,
        stripeSessionId: sessionId
      });

      if (response.data.success) {
        setSubscription(SUBSCRIPTION_TIERS.PREMIUM);
        setSubscriptionDate(now);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating subscription status:', error);
      return false;
    }
  };

  const cancelSubscription = async () => {
    if (!currentUser) return false;

    try {
      const response = await axios.delete(`/api/users/${currentUser._id}/subscription`);
      
      if (response.data.success) {
        setSubscription(SUBSCRIPTION_TIERS.FREE);
        setSubscriptionDate(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return false;
    }
  };

  const value = {
    subscription,
    subscriptionDate,
    updateSubscriptionStatus,
    cancelSubscription,
    fetchSubscriptionStatus
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
