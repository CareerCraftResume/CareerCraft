const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  id: String,
  name: String,
  content: Object,
  lastModified: Date
});

const resumeVersionSchema = new mongoose.Schema({
  id: String,
  name: String,
  content: Object,
  createdAt: Date
});

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  email: String,
  photoURL: String,
  savedTemplates: [templateSchema],
  resumeVersions: [resumeVersionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

profileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
