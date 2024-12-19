const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('../models/Template');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const templates = require('../data/templates.json').templates;
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            retryWrites: true,
            w: 'majority'
        });
        console.log('MongoDB Atlas connected for seeding...');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Create admin user
const createAdminUser = async () => {
    try {
        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@resumeai.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            email: 'admin@resumeai.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error.message);
        throw error;
    }
};

// Import templates
const importTemplates = async () => {
    try {
        await Template.deleteMany({}); // Clear existing templates
        await Template.insertMany(templates);
        console.log('Templates imported successfully');
    } catch (error) {
        console.error('Error importing templates:', error.message);
        throw error;
    }
};

// Run the seeding
const seedDB = async () => {
    try {
        await connectDB();
        await createAdminUser();
        await importTemplates();
        console.log('Database seeded successfully');
        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDB();
