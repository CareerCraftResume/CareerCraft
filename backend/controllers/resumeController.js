const Resume = require('../models/Resume');
const User = require('../models/User');
const aiService = require('../services/aiService');
const asyncHandler = require('express-async-handler');

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
exports.createResume = asyncHandler(async (req, res) => {
    // Start a session for transaction
    const session = await Resume.startSession();
    session.startTransaction();

    try {
        // Create the resume
        const resume = await Resume.create([{
            ...req.body,
            user: req.user.id
        }], { session });

        // Get the user and add resume to their list
        const user = await User.findById(req.user.id);
        await user.addResume(resume[0]._id);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(resume[0]);
    } catch (error) {
        // If anything fails, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
exports.getResumes = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
        .populate({
            path: 'resumes',
            select: 'title basics updatedAt templateId'
        });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user.resumes);
});

// @desc    Get a single resume
// @route   GET /api/resumes/:id
// @access  Private
exports.getResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    res.json(resume);
});

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
exports.updateResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true, runValidators: true }
    );
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    res.json(resume);
});

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = asyncHandler(async (req, res) => {
    const session = await Resume.startSession();
    session.startTransaction();

    try {
        // Delete the resume
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        }).session(session);

        if (!resume) {
            res.status(404);
            throw new Error('Resume not found');
        }

        // Remove resume from user's list
        const user = await User.findById(req.user.id);
        await user.removeResume(req.params.id);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        // If anything fails, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// @desc    Duplicate a resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
exports.duplicateResume = asyncHandler(async (req, res) => {
    const session = await Resume.startSession();
    session.startTransaction();

    try {
        // Find the original resume
        const originalResume = await Resume.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!originalResume) {
            res.status(404);
            throw new Error('Resume not found');
        }

        // Create a new resume with the same data
        const resumeData = originalResume.toObject();
        delete resumeData._id;
        resumeData.title = `${resumeData.title} (Copy)`;

        const newResume = await Resume.create([{
            ...resumeData,
            user: req.user.id
        }], { session });

        // Add the new resume to user's list
        const user = await User.findById(req.user.id);
        await user.addResume(newResume[0]._id);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(newResume[0]);
    } catch (error) {
        // If anything fails, abort the transaction
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
});

// @desc    Analyze a resume
// @route   GET /api/resumes/:id/analyze
// @access  Private
exports.analyzeResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    const analysis = await aiService.analyzeResume(resume);
    res.json(analysis);
});

// @desc    Improve resume content with NLP
// @route   GET /api/resumes/:id/improve
// @access  Private
exports.improveContent = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    const improvements = await aiService.improveContent(resume);
    res.json(improvements);
});

// @desc    Get design recommendations
// @route   GET /api/resumes/:id/design
// @access  Private
exports.getDesignRecommendations = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    const recommendations = await aiService.getDesignRecommendations(
        resume,
        req.query.currentTemplate
    );
    res.json(recommendations);
});

// @desc    Optimize keywords for a job description
// @route   POST /api/resumes/:id/keywords
// @access  Private
exports.optimizeKeywords = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    if (!req.body.jobDescription) {
        res.status(400);
        throw new Error('Job description is required');
    }
    
    const optimization = await aiService.optimizeKeywords(resume, req.body.jobDescription);
    res.json(optimization);
});

// @desc    Get tailored suggestions for a job
// @route   POST /api/resumes/:id/tailor
// @access  Private
exports.getTailoredSuggestions = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    if (!req.body.jobDescription) {
        res.status(400);
        throw new Error('Job description is required');
    }
    
    const suggestions = await aiService.getTailoredSuggestions(resume, req.body.jobDescription);
    res.json(suggestions);
});

// @desc    Export resume as PDF
// @route   GET /api/resumes/:id/export/pdf
// @access  Private
exports.exportPDF = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    }).lean();
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }

    try {
        // Send resume data for client-side PDF generation
        res.json({
            success: true,
            data: resume
        });
    } catch (error) {
        console.error('PDF Export Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting PDF',
            error: error.message
        });
    }
});

// @desc    Export resume as Word document
// @route   GET /api/resumes/:id/export/word
// @access  Private
exports.exportWord = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user.id
    }).lean();
    
    if (!resume) {
        res.status(404);
        throw new Error('Resume not found');
    }
    
    try {
        // Send resume data for client-side Word generation
        res.json({
            success: true,
            data: resume
        });
    } catch (error) {
        console.error('Word Export Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting Word document',
            error: error.message
        });
    }
});

// @desc    Generate a new resume
// @route   POST /api/resumes/generate
// @access  Private
exports.generateResume = asyncHandler(async (req, res) => {
    // For now, just return a message
    // TODO: Implement resume generation
    res.json({
        message: 'Resume generation functionality coming soon'
    });
});
