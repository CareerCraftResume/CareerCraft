const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function createIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection;
    const usersCollection = db.collection('users');

    // Create indexes for subscription fields
    await usersCollection.createIndexes([
      { key: { isSubscribed: 1 }, name: 'isSubscribed_index' },
      { key: { subscriptionDate: 1 }, name: 'subscriptionDate_index' },
      { key: { subscription: 1 }, name: 'subscription_index' },
      // Compound index for subscription queries
      { 
        key: { 
          isSubscribed: 1, 
          subscriptionDate: 1, 
          subscription: 1 
        }, 
        name: 'subscription_compound_index' 
      }
    ]);

    console.log('Indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating indexes:', error);
    process.exit(1);
  }
}

createIndexes();
