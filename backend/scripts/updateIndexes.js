const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updateIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection;
    const usersCollection = db.collection('users');

    // Drop existing indexes (except _id)
    const existingIndexes = await usersCollection.indexes();
    for (const index of existingIndexes) {
      if (index.name !== '_id_') {
        await usersCollection.dropIndex(index.name);
      }
    }

    // Create new indexes
    await usersCollection.createIndexes([
      // Text search index for name and email
      { 
        key: { firstName: 'text', lastName: 'text', email: 'text' },
        name: 'text_search_index'
      },
      
      // Role-based queries
      { 
        key: { role: 1 },
        name: 'role_index'
      },
      
      // Subscription-related indexes
      { 
        key: { subscription: 1, subscriptionDate: -1 },
        name: 'subscription_date_index'
      },
      {
        key: { isSubscribed: 1 },
        name: 'subscription_status_index'
      },
      {
        key: { stripeCustomerId: 1 },
        name: 'stripe_customer_index'
      },
      {
        key: { stripeSubscriptionId: 1 },
        name: 'stripe_subscription_index'
      },
      
      // Creation date index
      { 
        key: { createdAt: -1 },
        name: 'creation_date_index'
      },
      
      // Resumes array index
      { 
        key: { 'resumes': 1 },
        name: 'resumes_index'
      },
      
      // Password reset index
      {
        key: { resetPasswordToken: 1, resetPasswordExpire: 1 },
        name: 'password_reset_index'
      },
      
      // Compound indexes for common queries
      {
        key: { email: 1, role: 1 },
        name: 'email_role_index'
      },
      {
        key: { subscription: 1, isSubscribed: 1, subscriptionDate: -1 },
        name: 'subscription_status_compound_index'
      }
    ]);

    console.log('Indexes updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating indexes:', error);
    process.exit(1);
  }
}

updateIndexes();
