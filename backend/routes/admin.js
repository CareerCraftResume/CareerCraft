const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Resume = require('../models/Resume');
const Subscription = require('../models/Subscription');
const Settings = require('../models/Settings');
const { validateObjectId } = require('../middleware/validation');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// Debug endpoint
router.get('/debug', (req, res) => {
    console.log('Current user:', req.user);
    res.json({
        message: 'Debug endpoint reached',
        user: req.user
    });
});

// Get all users with pagination and filtering
router.get('/users', asyncHandler(async (req, res) => {
    console.log('GET /users request received');
    console.log('Query params:', req.query);
    console.log('Current user:', req.user);
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const query = {};
    
    // Add filters if provided
    if (req.query.role) query.role = req.query.role;
    if (req.query.search) {
        query.$or = [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    console.log('MongoDB query:', query);

    const total = await User.countDocuments(query);
    const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .lean();

    console.log('Found users:', users.length);

    res.json({
        success: true,
        count: users.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: users
    });
}));

// Get user by ID
router.get('/users/:id', validateObjectId, asyncHandler(async (req, res) => {
    console.log('GET /users/:id request received');
    console.log('User ID:', req.params.id);
    console.log('Current user:', req.user);
    
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('resumes', 'title createdAt updatedAt');

    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }

    console.log('Found user:', user);

    res.json({
        success: true,
        data: user
    });
}));

// Update user
router.put('/users/:id', validateObjectId, asyncHandler(async (req, res) => {
    console.log('PUT /users/:id request received');
    console.log('User ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Current user:', req.user);
    
    const { firstName, lastName, email, role } = req.body;

    // Validate input
    if (!firstName || !lastName || !email) {
        throw new ErrorResponse('Please provide all required fields', 400);
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
    if (existingUser) {
        throw new ErrorResponse('Email already in use', 400);
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { firstName, lastName, email, role },
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }

    console.log('Updated user:', user);

    res.json({
        success: true,
        data: user
    });
}));

// Delete user
router.delete('/users/:id', validateObjectId, asyncHandler(async (req, res) => {
    console.log('DELETE /users/:id request received');
    console.log('User ID:', req.params.id);
    console.log('Current user:', req.user);
    
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ErrorResponse('User not found', 404);
    }

    // Prevent deleting the last admin
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 1 && user.role === 'admin') {
        throw new ErrorResponse('Cannot delete the last admin user', 400);
    }

    await user.remove();
    
    // Delete all associated resumes
    await Resume.deleteMany({ user: req.params.id });

    console.log('User and associated data deleted');

    res.json({
        success: true,
        message: 'User and associated data deleted successfully'
    });
}));

// Get system settings
router.get('/settings', asyncHandler(async (req, res) => {
    console.log('GET /settings request received');
    console.log('Current user:', req.user);
    
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
        console.log('No settings found, creating defaults');
        settings = await Settings.create({
            maxResumesPerUser: 5,
            enableAIFeatures: true,
            enableNotifications: true,
            maintenanceMode: false,
            allowedFileTypes: ['pdf', 'doc', 'docx'],
            maxFileSize: 5 * 1024 * 1024, // 5MB
            defaultUserRole: 'user',
            sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
        });
    }

    console.log('Returning settings:', settings);

    res.json({
        success: true,
        data: settings
    });
}));

// Update system settings
router.put('/settings', asyncHandler(async (req, res) => {
    console.log('PUT /settings request received');
    console.log('Request body:', req.body);
    console.log('Current user:', req.user);
    
    const updates = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
        console.log('No settings found, creating new with updates');
        settings = await Settings.create(updates);
    } else {
        console.log('Updating existing settings');
        settings = await Settings.findOneAndUpdate({}, updates, {
            new: true,
            runValidators: true
        });
    }

    console.log('Updated settings:', settings);

    res.json({
        success: true,
        data: settings
    });
}));

// Get analytics data
router.get('/analytics', asyncHandler(async (req, res) => {
    console.log('GET /analytics request received');
    console.log('Current user:', req.user);
    
    try {
        const timeRange = req.query.timeRange || 'week';
        const endDate = new Date();
        let startDate;

        // Calculate start date based on time range
        switch (timeRange) {
            case 'day':
                startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
                break;
            case 'week':
                startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(endDate.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        // Get total users count
        const totalUsers = await User.countDocuments();
        
        // Get new users in time range
        const newUsers = await User.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Get total resumes count
        const totalResumes = await Resume.countDocuments();
        
        // Get new resumes in time range
        const newResumes = await Resume.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Get user registration trend (grouped by day)
        const userRegistrationTrend = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get resume creation trend (grouped by day)
        const resumeCreationTrend = await Resume.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get user role distribution
        const userRoles = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get resume template usage
        const templateUsage = await Resume.aggregate([
            {
                $group: {
                    _id: "$template",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Get average resumes per user
        const avgResumesPerUser = totalUsers > 0 ? (totalResumes / totalUsers).toFixed(2) : 0;

        // Format trend data to ensure continuous dates
        const formattedUserTrend = fillMissingDates(userRegistrationTrend, startDate, endDate);
        const formattedResumeTrend = fillMissingDates(resumeCreationTrend, startDate, endDate);

        console.log('Analytics data:', {
            overview: {
                totalUsers,
                newUsers,
                totalResumes,
                newResumes,
                avgResumesPerUser: parseFloat(avgResumesPerUser)
            },
            trends: {
                userRegistration: formattedUserTrend,
                resumeCreation: formattedResumeTrend
            },
            distribution: {
                userRoles,
                templateUsage
            },
            timeRange
        });

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    newUsers,
                    totalResumes,
                    newResumes,
                    avgResumesPerUser: parseFloat(avgResumesPerUser)
                },
                trends: {
                    userRegistration: formattedUserTrend,
                    resumeCreation: formattedResumeTrend
                },
                distribution: {
                    userRoles,
                    templateUsage
                },
                timeRange
            }
        });

    } catch (error) {
        console.error('Analytics Error:', error);
        throw new ErrorResponse('Error fetching analytics data', 500);
    }
}));

// Helper function to fill missing dates in trend data
function fillMissingDates(data, startDate, endDate) {
    const dates = {};
    const current = new Date(startDate);
    
    // Initialize all dates with 0
    while (current <= endDate) {
        const dateStr = current.toISOString().split('T')[0];
        dates[dateStr] = 0;
        current.setDate(current.getDate() + 1);
    }

    // Fill in actual values
    data.forEach(item => {
        dates[item._id] = item.count;
    });

    // Convert to array format
    return Object.entries(dates).map(([date, count]) => ({
        date,
        count
    }));
}

// Real-time analytics
router.get('/analytics/real-time', asyncHandler(async (req, res) => {
    console.log('GET /analytics/real-time request received');
    console.log('Current user:', req.user);
    
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const [activeUsers, newResumes, recentUpdates] = await Promise.all([
            User.countDocuments({ lastActive: { $gte: last24Hours } }),
            Resume.countDocuments({ createdAt: { $gte: today } }),
            Resume.countDocuments({
                updatedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }
            })
        ]);

        console.log('Real-time analytics data:', {
            activeUsers,
            newResumes,
            recentUpdates,
            timestamp: new Date()
        });

        res.json({
            success: true,
            data: {
                activeUsers,
                newResumes,
                recentUpdates,
                timestamp: new Date()
            },
            config: {
                animation: {
                    type: 'counter',
                    duration: 500,
                    easing: 'easeOutBounce'
                },
                refreshInterval: 60000 // Refresh every minute
            }
        });
    } catch (error) {
        console.error('Real-time Analytics Error:', error);
        throw new ErrorResponse('Error fetching real-time analytics', 500);
    }
}));

// Subscription Management Routes
router.get('/subscriptions', asyncHandler(async (req, res) => {
    console.log('GET /subscriptions request received');
    console.log('Current user:', req.user);
    
    try {
        const subscriptions = await Subscription.find()
            .populate('userId', 'email name')
            .sort({ createdAt: -1 });

        const stats = {
            total: subscriptions.length,
            active: subscriptions.filter(s => s.isActive()).length,
            expired: subscriptions.filter(s => !s.isActive()).length,
            revenue: subscriptions.reduce((total, sub) => {
                return total + sub.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
            }, 0)
        };

        console.log('Subscriptions data:', subscriptions);
        console.log('Subscriptions stats:', stats);

        res.json({ success: true, subscriptions, stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));

router.get('/subscriptions/:userId', asyncHandler(async (req, res) => {
    console.log('GET /subscriptions/:userId request received');
    console.log('User ID:', req.params.userId);
    console.log('Current user:', req.user);
    
    try {
        const subscription = await Subscription.findOne({ userId: req.params.userId })
            .populate('userId', 'email name');
        
        if (!subscription) {
            return res.status(404).json({ success: false, error: 'Subscription not found' });
        }

        console.log('Subscription data:', subscription);

        res.json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));

router.post('/subscriptions/:userId/extend', asyncHandler(async (req, res) => {
    console.log('POST /subscriptions/:userId/extend request received');
    console.log('User ID:', req.params.userId);
    console.log('Request body:', req.body);
    console.log('Current user:', req.user);
    
    try {
        const { months = 1 } = req.body;
        const subscription = await Subscription.findOne({ userId: req.params.userId });
        
        if (!subscription) {
            return res.status(404).json({ success: false, error: 'Subscription not found' });
        }

        const currentEndDate = subscription.subscriptionEndDate || new Date();
        subscription.subscriptionEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + months));
        subscription.isSubscribed = true;
        subscription.subscriptionStatus = 'active';
        subscription.plan = 'premium';

        await subscription.save();

        // Update user's subscription status
        await User.findByIdAndUpdate(req.params.userId, {
            subscriptionStatus: 'premium'
        });

        console.log('Subscription extended:', subscription);

        res.json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));

router.post('/subscriptions/:userId/cancel', asyncHandler(async (req, res) => {
    console.log('POST /subscriptions/:userId/cancel request received');
    console.log('User ID:', req.params.userId);
    console.log('Current user:', req.user);
    
    try {
        const subscription = await Subscription.findOne({ userId: req.params.userId });
        
        if (!subscription) {
            return res.status(404).json({ success: false, error: 'Subscription not found' });
        }

        subscription.isSubscribed = false;
        subscription.subscriptionStatus = 'cancelled';
        subscription.plan = 'free';
        await subscription.save();

        // Update user's subscription status
        await User.findByIdAndUpdate(req.params.userId, {
            subscriptionStatus: 'free'
        });

        console.log('Subscription cancelled:', subscription);

        res.json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));

// Subscription Analytics Routes
router.get('/analytics/subscriptions', asyncHandler(async (req, res) => {
    console.log('GET /analytics/subscriptions request received');
    console.log('Current user:', req.user);
    
    try {
        const timeframe = req.query.timeframe || '30'; // Default to 30 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeframe));

        const subscriptions = await Subscription.find({
            createdAt: { $gte: startDate }
        });

        const analytics = {
            totalSubscriptions: subscriptions.length,
            activeSubscriptions: subscriptions.filter(s => s.isActive()).length,
            revenue: subscriptions.reduce((total, sub) => {
                return total + sub.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
            }, 0),
            conversionRate: await calculateConversionRate(startDate),
            subscriptionsByDay: await getSubscriptionsByDay(startDate),
            churnRate: await calculateChurnRate(startDate)
        };

        console.log('Subscriptions analytics:', analytics);

        res.json({ success: true, analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}));

// Helper functions for analytics
async function calculateConversionRate(startDate) {
    console.log('Calculating conversion rate...');
    
    const totalUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
    const subscribers = await Subscription.countDocuments({
        createdAt: { $gte: startDate },
        isSubscribed: true
    });
    return totalUsers > 0 ? (subscribers / totalUsers) * 100 : 0;
}

async function getSubscriptionsByDay(startDate) {
    console.log('Getting subscriptions by day...');
    
    const subscriptions = await Subscription.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    return subscriptions;
}

async function calculateChurnRate(startDate) {
    console.log('Calculating churn rate...');
    
    const cancelledSubscriptions = await Subscription.countDocuments({
        subscriptionStatus: 'cancelled',
        updatedAt: { $gte: startDate }
    });
    const totalSubscriptions = await Subscription.countDocuments({
        createdAt: { $lte: startDate }
    });
    return totalSubscriptions > 0 ? (cancelledSubscriptions / totalSubscriptions) * 100 : 0;
}

module.exports = router;
