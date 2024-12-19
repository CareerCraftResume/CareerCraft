const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resumes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    subscription: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    subscriptionDate: {
        type: Date,
        default: null
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    stripeSessionId: {
        type: String,
        default: null
    },
    stripeCustomerId: {
        type: String,
        default: null
    },
    stripeSubscriptionId: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for name search
userSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Create index for role-based queries
userSchema.index({ role: 1 });

// Create index for subscription queries
userSchema.index({ subscription: 1, subscriptionDate: -1 });

// Create index for creation date
userSchema.index({ createdAt: -1 });

// Create index on resumes array
userSchema.index({ 'resumes': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Method to add resume to user's resumes array
userSchema.methods.addResume = async function(resumeId) {
    if (!this.resumes.includes(resumeId)) {
        this.resumes.push(resumeId);
        await this.save();
    }
    return this;
};

// Method to remove resume from user's resumes array
userSchema.methods.removeResume = async function(resumeId) {
    this.resumes = this.resumes.filter(id => id.toString() !== resumeId.toString());
    await this.save();
    return this;
};

module.exports = mongoose.model('User', userSchema);
