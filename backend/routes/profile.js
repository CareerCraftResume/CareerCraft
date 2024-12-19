const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

// Get user profile
router.get('/:userId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/:userId', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      profile = new Profile({
        userId: req.params.userId,
        ...req.body
      });
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save template
router.post('/:userId/templates', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const template = {
      id: Date.now().toString(),
      ...req.body,
      lastModified: new Date()
    };

    profile.savedTemplates.push(template);
    await profile.save();
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save resume version
router.post('/:userId/versions', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const version = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };

    profile.resumeVersions.push(version);
    await profile.save();
    res.json(version);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete template
router.delete('/:userId/templates/:templateId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.savedTemplates = profile.savedTemplates.filter(
      template => template.id !== req.params.templateId
    );
    await profile.save();
    res.json({ message: 'Template deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resume version
router.delete('/:userId/versions/:versionId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.resumeVersions = profile.resumeVersions.filter(
      version => version.id !== req.params.versionId
    );
    await profile.save();
    res.json({ message: 'Version deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
