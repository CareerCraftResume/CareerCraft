const Template = require('../models/Template');

// Default templates
const defaultTemplates = [
    {
        name: 'Modern Professional',
        description: 'A clean and modern template perfect for tech professionals',
        thumbnail: '/templates/modern-professional.png',
        layout: 'two-column',
        color_scheme: {
            primary: '#2c3e50',
            secondary: '#34495e',
            accent: '#3498db',
            text: '#2c3e50',
            background: '#ffffff'
        },
        fonts: {
            heading: 'Roboto',
            body: 'Open Sans'
        },
        sections: ['basics', 'experience', 'education', 'skills', 'projects'],
        customCSS: `
            .resume-header { border-bottom: 2px solid var(--primary-color); }
            .section-title { color: var(--accent-color); }
        `
    },
    {
        name: 'Minimal Clean',
        description: 'A minimalist design focusing on content clarity',
        thumbnail: '/templates/minimal-clean.png',
        layout: 'single-column',
        color_scheme: {
            primary: '#000000',
            secondary: '#333333',
            accent: '#666666',
            text: '#000000',
            background: '#ffffff'
        },
        fonts: {
            heading: 'Helvetica',
            body: 'Arial'
        },
        sections: ['basics', 'experience', 'education', 'skills'],
        customCSS: `
            .section { margin-bottom: 1.5rem; }
            .section-title { font-weight: 600; }
        `
    },
    {
        name: 'Creative Portfolio',
        description: 'A creative template ideal for designers and artists',
        thumbnail: '/templates/creative-portfolio.png',
        layout: 'creative',
        color_scheme: {
            primary: '#ff6b6b',
            secondary: '#4ecdc4',
            accent: '#45b7af',
            text: '#2c3e50',
            background: '#f7f7f7'
        },
        fonts: {
            heading: 'Montserrat',
            body: 'Lato'
        },
        sections: ['basics', 'experience', 'education', 'skills', 'projects', 'awards'],
        customCSS: `
            .resume-container { background: linear-gradient(to bottom right, var(--primary-color), var(--secondary-color)); }
            .section { backdrop-filter: blur(10px); }
        `,
        premium: true
    }
];

// Role-specific template customizations
const ROLE_TEMPLATES = {
    software_engineering: {
        layout_preferences: ['two-column', 'modern'],
        color_schemes: [
            {
                primary: '#2c3e50',
                secondary: '#34495e',
                accent: '#3498db',
                text: '#2c3e50',
                background: '#ffffff'
            },
            {
                primary: '#1a237e',
                secondary: '#283593',
                accent: '#5c6bc0',
                text: '#212121',
                background: '#fafafa'
            }
        ],
        section_order: ['basics', 'skills', 'experience', 'projects', 'education'],
        emphasis: {
            skills: 'technical',
            projects: true,
            certifications: true
        }
    },
    data_science: {
        layout_preferences: ['modern', 'technical'],
        color_schemes: [
            {
                primary: '#004d40',
                secondary: '#00695c',
                accent: '#00897b',
                text: '#212121',
                background: '#ffffff'
            },
            {
                primary: '#0d47a1',
                secondary: '#1565c0',
                accent: '#1976d2',
                text: '#212121',
                background: '#fafafa'
            }
        ],
        section_order: ['basics', 'skills', 'experience', 'education', 'publications'],
        emphasis: {
            skills: 'analytical',
            research: true,
            publications: true
        }
    },
    product_management: {
        layout_preferences: ['executive', 'modern'],
        color_schemes: [
            {
                primary: '#37474f',
                secondary: '#455a64',
                accent: '#607d8b',
                text: '#212121',
                background: '#ffffff'
            },
            {
                primary: '#006064',
                secondary: '#00838f',
                accent: '#0097a7',
                text: '#212121',
                background: '#fafafa'
            }
        ],
        section_order: ['basics', 'experience', 'achievements', 'skills', 'education'],
        emphasis: {
            leadership: true,
            achievements: true,
            metrics: true
        }
    }
};

class TemplateService {
    constructor() {
        // Lazy load jobRoleService to avoid circular dependency
        this.getJobRoleService = () => {
            if (!this._jobRoleService) {
                this._jobRoleService = require('./jobRoleService');
            }
            return this._jobRoleService;
        };
    }

    // Initialize default templates if they don't exist
    async initializeDefaultTemplates() {
        try {
            const existingCount = await Template.countDocuments();
            if (existingCount === 0) {
                console.log('Initializing default templates...');
                await Template.insertMany(defaultTemplates);
                console.log('Default templates created successfully');
            }
        } catch (error) {
            console.error('Error initializing default templates:', error);
            throw error;
        }
    }

    // Get all templates
    async getAllTemplates(includeInactive = false) {
        try {
            const query = includeInactive ? {} : { isActive: true };
            return await Template.find(query).sort({ name: 1 });
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    }

    // Get template by ID
    async getTemplateById(id) {
        try {
            return await Template.findById(id);
        } catch (error) {
            console.error('Error fetching template:', error);
            throw error;
        }
    }

    // Get free templates
    async getFreeTemplates() {
        try {
            return await Template.find({ premium: false, isActive: true }).sort({ name: 1 });
        } catch (error) {
            console.error('Error fetching free templates:', error);
            throw error;
        }
    }

    // Get premium templates
    async getPremiumTemplates() {
        try {
            return await Template.find({ premium: true, isActive: true }).sort({ name: 1 });
        } catch (error) {
            console.error('Error fetching premium templates:', error);
            throw error;
        }
    }

    // Create new template
    async createTemplate(templateData) {
        try {
            return await Template.create(templateData);
        } catch (error) {
            console.error('Error creating template:', error);
            throw error;
        }
    }

    // Update template
    async updateTemplate(id, templateData) {
        try {
            return await Template.findByIdAndUpdate(id, templateData, {
                new: true,
                runValidators: true
            });
        } catch (error) {
            console.error('Error updating template:', error);
            throw error;
        }
    }

    // Delete template
    async deleteTemplate(id) {
        try {
            return await Template.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error deleting template:', error);
            throw error;
        }
    }

    // Apply template to resume data
    applyTemplate(resumeData, template) {
        // Deep clone the resume data to avoid modifying the original
        const formattedResume = JSON.parse(JSON.stringify(resumeData));

        // Apply template sections order
        formattedResume.sections = template.sections;

        // Apply template styling
        formattedResume.styling = {
            layout: template.layout,
            colorScheme: template.color_scheme,
            fonts: template.fonts,
            customCSS: template.customCSS
        };

        return formattedResume;
    }

    // Generate CSS for template
    generateTemplateCSS(template) {
        const { color_scheme, fonts } = template;
        
        return `
            :root {
                --primary-color: ${color_scheme.primary};
                --secondary-color: ${color_scheme.secondary};
                --accent-color: ${color_scheme.accent};
                --text-color: ${color_scheme.text};
                --background-color: ${color_scheme.background};
                --heading-font: ${fonts.heading}, sans-serif;
                --body-font: ${fonts.body}, sans-serif;
            }

            body {
                font-family: var(--body-font);
                color: var(--text-color);
                background-color: var(--background-color);
            }

            h1, h2, h3, h4, h5, h6 {
                font-family: var(--heading-font);
                color: var(--primary-color);
            }

            ${template.customCSS}
        `;
    }

    // Get role-specific template recommendations
    async getRoleTemplates(jobTitle) {
        try {
            const jobRoleService = this.getJobRoleService();
            const roleSuggestions = await jobRoleService.getRoleSuggestions(jobTitle);
            const roleCategory = roleSuggestions?.roleCategory?.name || 'general';
            
            // Get all templates
            const allTemplates = await this.getAllTemplates();
            
            // Get role-specific customizations
            const roleCustomization = ROLE_TEMPLATES[roleCategory] || this._getDefaultCustomization();
            
            // Score and sort templates
            const scoredTemplates = allTemplates.map(template => ({
                ...template.toObject(),
                score: this._calculateTemplateScore(template, roleCustomization),
                customization: this._generateCustomization(template, roleCustomization)
            })).sort((a, b) => b.score - a.score);
            
            return scoredTemplates;
        } catch (error) {
            console.error('Error getting role templates:', error);
            throw error;
        }
    }

    // Calculate template score based on role preferences
    _calculateTemplateScore(template, roleCustomization) {
        let score = 0;
        
        // Layout score
        if (roleCustomization.layout_preferences.includes(template.layout)) {
            score += 2;
        }
        
        // Sections score
        const preferredSections = new Set(roleCustomization.section_order);
        const matchingSections = template.sections.filter(section => 
            preferredSections.has(section)
        );
        score += matchingSections.length / template.sections.length;
        
        // Color scheme score
        const colorMatch = roleCustomization.color_schemes.some(scheme =>
            this._compareColorSchemes(scheme, template.color_scheme)
        );
        if (colorMatch) score += 1;
        
        return score;
    }

    // Compare color schemes for similarity
    _compareColorSchemes(scheme1, scheme2) {
        const colors1 = Object.values(scheme1);
        const colors2 = Object.values(scheme2);
        
        // Convert colors to RGB and calculate similarity
        const similarity = colors1.reduce((sum, color1, index) => {
            const rgb1 = this._hexToRgb(color1);
            const rgb2 = this._hexToRgb(colors2[index]);
            return sum + this._calculateColorSimilarity(rgb1, rgb2);
        }, 0) / colors1.length;
        
        return similarity > 0.8; // 80% similarity threshold
    }

    // Convert hex color to RGB
    _hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Calculate color similarity (0-1)
    _calculateColorSimilarity(rgb1, rgb2) {
        if (!rgb1 || !rgb2) return 0;
        
        const rDiff = Math.abs(rgb1.r - rgb2.r) / 255;
        const gDiff = Math.abs(rgb1.g - rgb2.g) / 255;
        const bDiff = Math.abs(rgb1.b - rgb2.b) / 255;
        
        return 1 - ((rDiff + gDiff + bDiff) / 3);
    }

    // Generate role-specific customization for a template
    _generateCustomization(template, roleCustomization) {
        return {
            sections: this._customizeSections(template.sections, roleCustomization),
            styling: this._customizeStyling(template, roleCustomization),
            emphasis: roleCustomization.emphasis
        };
    }

    // Customize section order and visibility
    _customizeSections(templateSections, roleCustomization) {
        const orderedSections = roleCustomization.section_order.filter(section =>
            templateSections.includes(section)
        );
        
        // Add any template sections that weren't in role customization
        templateSections.forEach(section => {
            if (!orderedSections.includes(section)) {
                orderedSections.push(section);
            }
        });
        
        return orderedSections;
    }

    // Customize template styling based on role
    _customizeStyling(template, roleCustomization) {
        // Find the best matching color scheme
        const bestColorScheme = roleCustomization.color_schemes.reduce((best, scheme) => {
            const similarity = this._compareColorSchemes(scheme, template.color_scheme);
            return similarity > best.similarity ? { scheme, similarity } : best;
        }, { scheme: roleCustomization.color_schemes[0], similarity: 0 }).scheme;

        return {
            layout: roleCustomization.layout_preferences.includes(template.layout)
                ? template.layout
                : roleCustomization.layout_preferences[0],
            color_scheme: bestColorScheme,
            fonts: template.fonts,
            customCSS: this._generateRoleSpecificCSS(template.customCSS, roleCustomization)
        };
    }

    // Generate role-specific CSS customizations
    _generateRoleSpecificCSS(baseCSS, roleCustomization) {
        let css = baseCSS || '';
        
        // Add role-specific CSS modifications
        if (roleCustomization.emphasis.skills === 'technical') {
            css += `
                .skills-section { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
                .skill-category { border: 1px solid var(--accent-color); padding: 1rem; }
            `;
        }
        
        if (roleCustomization.emphasis.projects) {
            css += `
                .projects-section { display: grid; gap: 1.5rem; }
                .project-card { border-left: 3px solid var(--accent-color); padding-left: 1rem; }
            `;
        }
        
        if (roleCustomization.emphasis.leadership) {
            css += `
                .experience-section .role-title { font-size: 1.2em; color: var(--primary-color); }
                .achievements-list { margin-top: 1rem; font-style: italic; }
            `;
        }
        
        return css;
    }

    // Get default customization for unknown roles
    _getDefaultCustomization() {
        return {
            layout_preferences: ['modern', 'classic'],
            color_schemes: [
                {
                    primary: '#2c3e50',
                    secondary: '#34495e',
                    accent: '#3498db',
                    text: '#2c3e50',
                    background: '#ffffff'
                }
            ],
            section_order: ['basics', 'experience', 'education', 'skills'],
            emphasis: {
                skills: 'balanced',
                experience: true
            }
        };
    }
}

module.exports = new TemplateService();
