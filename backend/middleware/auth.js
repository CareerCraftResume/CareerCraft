const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ErrorResponse('Not authorized to access this route', 401);
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                throw new ErrorResponse('User not found', 401);
            }

            // Check if user is active
            if (user.status === 'inactive') {
                throw new ErrorResponse('User account is deactivated', 401);
            }

            req.user = user;
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new ErrorResponse('Invalid token', 401);
            } else if (error.name === 'TokenExpiredError') {
                throw new ErrorResponse('Token expired', 401);
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(error.statusCode || 401).json({
            success: false,
            error: error.message || 'Not authorized'
        });
    }
};

// Middleware for checking user roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not found in request'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. User role '${req.user.role}' is not authorized to access this route`
            });
        }

        next();
    };
};
