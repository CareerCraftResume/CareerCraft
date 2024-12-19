const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    maxResumesPerUser: {
        type: Number,
        default: 5,
        min: 1
    },
    enableAIFeatures: {
        type: Boolean,
        default: true
    },
    enableNotifications: {
        type: Boolean,
        default: true
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    allowedFileTypes: {
        type: [String],
        default: ['pdf', 'doc', 'docx']
    },
    maxFileSize: {
        type: Number,
        default: 5 * 1024 * 1024 // 5MB
    },
    defaultUserRole: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    sessionTimeout: {
        type: Number,
        default: 24 * 60 * 60 * 1000 // 24 hours
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
settingsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Update the updatedAt field on update
settingsSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

module.exports = mongoose.model('Settings', settingsSchema);
