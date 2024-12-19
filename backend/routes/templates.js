const express = require('express');
const router = express.Router();
const {
    getTemplates,
    getFreeTemplates,
    getPremiumTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    applyTemplate,
    getTemplateCSS
} = require('../controllers/templateController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTemplates);
router.get('/free', getFreeTemplates);
router.get('/premium', getPremiumTemplates);
router.get('/:id', getTemplate);

// Protected routes
router.post('/:id/apply', protect, applyTemplate);
router.get('/:id/css', protect, getTemplateCSS);

// Admin routes
router.post('/', protect, authorize('admin'), createTemplate);
router.put('/:id', protect, authorize('admin'), updateTemplate);
router.delete('/:id', protect, authorize('admin'), deleteTemplate);

module.exports = router;
