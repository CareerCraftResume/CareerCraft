import { db } from '../firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

class SubscriptionManager {
    // Check subscriptions daily
    static async checkSubscriptions() {
        try {
            const today = new Date();
            const usersRef = collection(db, 'users');
            
            // Query for subscribed users
            const subscribedUsersQuery = query(
                usersRef,
                where('isSubscribed', '==', true)
            );

            const querySnapshot = await getDocs(subscribedUsersQuery);
            const batch = writeBatch(db);
            let expiredCount = 0;

            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if (userData.subscriptionDate) {
                    const subscriptionDate = new Date(userData.subscriptionDate);
                    const nextBillingDate = new Date(subscriptionDate);
                    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

                    // Check if subscription has expired and hasn't been updated
                    if (today > nextBillingDate && !userData.subscriptionUpdated) {
                        // Revert to free tier
                        batch.update(doc.ref, {
                            subscription: 'free',
                            isSubscribed: false,
                            subscriptionDate: null,
                            subscriptionUpdated: false,
                            expirationDate: today.toISOString(),
                            lastStatus: 'expired'
                        });
                        expiredCount++;
                    }
                }
            });

            // Commit all changes in one batch
            if (expiredCount > 0) {
                await batch.commit();
                console.log(`Processed ${expiredCount} expired subscriptions`);
            }

            return {
                success: true,
                processedCount: expiredCount
            };
        } catch (error) {
            console.error('Error checking subscriptions:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Update subscription after successful payment
    static async updateSubscription(userId, paymentDetails) {
        try {
            const now = new Date();
            const userRef = doc(db, 'users', userId);

            await setDoc(userRef, {
                subscription: 'premium',
                isSubscribed: true,
                subscriptionDate: now.toISOString(),
                subscriptionUpdated: true,
                lastPaymentDate: now.toISOString(),
                lastPaymentAmount: paymentDetails.amount,
                paymentId: paymentDetails.id,
                lastStatus: 'active'
            }, { merge: true });

            return {
                success: true,
                subscriptionDate: now.toISOString()
            };
        } catch (error) {
            console.error('Error updating subscription:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get subscription status
    static async getSubscriptionStatus(userId) {
        try {
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                return {
                    success: false,
                    error: 'User not found'
                };
            }

            const userData = userDoc.data();
            return {
                success: true,
                isSubscribed: userData.isSubscribed || false,
                subscriptionDate: userData.subscriptionDate || null,
                subscription: userData.subscription || 'free',
                lastPaymentDate: userData.lastPaymentDate || null,
                lastStatus: userData.lastStatus || 'none'
            };
        } catch (error) {
            console.error('Error getting subscription status:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Set up scheduled subscription check
    static setupSubscriptionCheck() {
        // Check subscriptions every day at midnight
        const checkTime = new Date();
        checkTime.setHours(0, 0, 0, 0);
        checkTime.setDate(checkTime.getDate() + 1);

        const timeUntilCheck = checkTime.getTime() - new Date().getTime();

        setTimeout(async () => {
            await this.checkSubscriptions();
            // Set up next check
            this.setupSubscriptionCheck();
        }, timeUntilCheck);
    }
}

// Initialize subscription checking
SubscriptionManager.setupSubscriptionCheck();

export default SubscriptionManager;
