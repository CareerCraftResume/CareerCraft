const templateService = require('../services/templateService');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
exports.getTemplates = async (req, res) => {
    try {
        const templates = await templateService.getAllTemplates();
        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching templates',
            error: error.message
        });
    }
};

// @desc    Get free templates
// @route   GET /api/templates/free
// @access  Public
exports.getFreeTemplates = async (req, res) => {
    try {
        const templates = await templateService.getFreeTemplates();
        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching free templates',
            error: error.message
        });
    }
};

// @desc    Get premium templates
// @route   GET /api/templates/premium
// @access  Public
exports.getPremiumTemplates = async (req, res) => {
    try {
        const templates = await templateService.getPremiumTemplates();
        res.status(200).json({
            success: true,
            count: templates.length,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching premium templates',
            error: error.message
        });
    }
};

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Public
exports.getTemplate = async (req, res) => {
    try {
        const template = await templateService.getTemplateById(req.params.id);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching template',
            error: error.message
        });
    }
};

// @desc    Create template
// @route   POST /api/templates
// @access  Private/Admin
exports.createTemplate = async (req, res) => {
    try {
        const template = await templateService.createTemplate(req.body);
        res.status(201).json({
            success: true,
            data: template
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating template',
            error: error.message
        });
    }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private/Admin
exports.updateTemplate = async (req, res) => {
    try {
        const template = await templateService.updateTemplate(req.params.id, req.body);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        res.status(200).json({
            success: true,
            data: template
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating template',
            error: error.message
        });
    }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private/Admin
exports.deleteTemplate = async (req, res) => {
    try {
        const template = await templateService.deleteTemplate(req.params.id);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Template deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting template',
            error: error.message
        });
    }
};

// @desc    Apply template to resume
// @route   POST /api/templates/:id/apply
// @access  Private
exports.applyTemplate = async (req, res) => {
    try {
        const template = await templateService.getTemplateById(req.params.id);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        // Check if template is premium and user has access
        if (template.premium && (!req.user || !req.user.isPremium)) {
            return res.status(403).json({
                success: false,
                message: 'Premium subscription required for this template'
            });
        }

        const formattedResume = templateService.applyTemplate(req.body, template);
        
        res.status(200).json({
            success: true,
            data: formattedResume
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error applying template',
            error: error.message
        });
    }
};

// @desc    Get template CSS
// @route   GET /api/templates/:id/css
// @access  Private
exports.getTemplateCSS = async (req, res) => {
    try {
        const template = await templateService.getTemplateById(req.params.id);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        const css = templateService.generateTemplateCSS(template);
        
        res.status(200).json({
            success: true,
            data: css
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating template CSS',
            error: error.message
        });
    }
};
