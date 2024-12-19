const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String, // URL to template preview image
        required: true
    },
    layout: {
        type: String,
        required: true,
        enum: ['single-column', 'two-column', 'minimal', 'professional', 'creative']
    },
    color_scheme: {
        primary: String,
        secondary: String,
        accent: String,
        text: String,
        background: String
    },
    fonts: {
        heading: String,
        body: String
    },
    sections: {
        type: [String],
        default: ['basics', 'experience', 'education', 'skills']
    },
    customCSS: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    premium: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Template', templateSchema);
