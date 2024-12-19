const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    gpa: { type: Number },
    description: { type: String },
    achievements: [String]
});

const experienceSchema = new mongoose.Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String },
    achievements: [String],
    technologies: [String]
});

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String },
    keywords: [String]
});

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    basics: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
        location: {
            city: String,
            state: String,
            country: String
        },
        summary: String,
        website: String,
        profiles: [{
            network: String,
            username: String,
            url: String
        }]
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    languages: [{
        name: String,
        fluency: String
    }],
    interests: [String],
    references: [{
        name: String,
        reference: String
    }],
    metadata: {
        createdAt: { type: Date, default: Date.now },
        lastModified: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ['draft', 'published'],
            default: 'draft'
        }
    }
}, {
    timestamps: true
});

// Create compound index for user's resumes
resumeSchema.index({ userId: 1, title: 1 });

// Index for full-text search on basic information
resumeSchema.index({
    'basics.name': 'text',
    'basics.email': 'text',
    'basics.summary': 'text',
    title: 'text'
});

// Index for location-based searches
resumeSchema.index({
    'basics.location.city': 1,
    'basics.location.state': 1,
    'basics.location.country': 1
});

// Index for experience fields
resumeSchema.index({
    'experience.company': 1,
    'experience.position': 1,
    'experience.technologies': 1
});

// Index for education fields
resumeSchema.index({
    'education.institution': 1,
    'education.degree': 1,
    'education.field': 1
});

// Index for skills
resumeSchema.index({ 'skills.name': 1, 'skills.keywords': 1 });

// Index for metadata and status
resumeSchema.index({ 
    'metadata.createdAt': 1,
    'metadata.lastModified': 1,
    'metadata.status': 1
});

// Pre-save middleware to update lastModified
resumeSchema.pre('save', function(next) {
    if (this.isModified()) {
        this.metadata.lastModified = new Date();
    }
    next();
});

// Method to search resumes by various criteria
resumeSchema.statics.searchResumes = async function(criteria) {
    const query = {};
    
    if (criteria.userId) {
        query.userId = criteria.userId;
    }
    
    if (criteria.searchText) {
        query.$text = { $search: criteria.searchText };
    }
    
    if (criteria.location) {
        const locationQuery = {};
        if (criteria.location.city) locationQuery['basics.location.city'] = criteria.location.city;
        if (criteria.location.state) locationQuery['basics.location.state'] = criteria.location.state;
        if (criteria.location.country) locationQuery['basics.location.country'] = criteria.location.country;
        Object.assign(query, locationQuery);
    }
    
    if (criteria.skills && criteria.skills.length > 0) {
        query['skills.name'] = { $in: criteria.skills };
    }
    
    if (criteria.status) {
        query['metadata.status'] = criteria.status;
    }
    
    return this.find(query)
        .sort({ 'metadata.lastModified': -1 });
};

module.exports = mongoose.model('Resume', resumeSchema);
