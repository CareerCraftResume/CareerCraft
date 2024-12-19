const express = require('express');
const router = express.Router();
const {
    createResume,
    getResumes,
    getResume,
    updateResume,
    deleteResume,
    analyzeResume,
    improveContent,
    exportPDF,
    exportWord
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

/**
 * @route   POST /api/resumes
 * @desc    Create a new resume
 * @access  Private
 */
router.post('/', createResume);

/**
 * @route   GET /api/resumes
 * @desc    Get all user's resumes
 * @access  Private
 */
router.get('/', getResumes);

/**
 * @route   GET /api/resumes/:id
 * @desc    Get a single resume
 * @access  Private
 */
router.get('/:id', getResume);

/**
 * @route   PUT /api/resumes/:id
 * @desc    Update a resume
 * @access  Private
 */
router.put('/:id', updateResume);

/**
 * @route   DELETE /api/resumes/:id
 * @desc    Delete a resume
 * @access  Private
 */
router.delete('/:id', deleteResume);

/**
 * @route   GET /api/resumes/:id/analyze
 * @desc    Get AI analysis for a resume
 * @access  Private
 */
router.get('/:id/analyze', analyzeResume);

/**
 * @route   GET /api/resumes/:id/improve
 * @desc    Get AI-powered content improvements
 * @access  Private
 */
router.get('/:id/improve', improveContent);

/**
 * @route   GET /api/resumes/:id/export/pdf
 * @desc    Export resume as PDF
 * @access  Private
 */
router.get('/:id/export/pdf', exportPDF);

/**
 * @route   GET /api/resumes/:id/export/word
 * @desc    Export resume as Word document
 * @access  Private
 */
router.get('/:id/export/word', exportWord);

module.exports = router;
