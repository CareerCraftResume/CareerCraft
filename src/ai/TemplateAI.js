// Dynamic Template Generation System

class TemplateAnalyzer {
    constructor() {
        this.industryPatterns = {
            tech: {
                keywords: ['software', 'developer', 'engineer', 'programming', 'technical'],
                emphasis: ['skills', 'projects', 'technical experience']
            },
            creative: {
                keywords: ['design', 'artist', 'creative', 'portfolio', 'media'],
                emphasis: ['portfolio', 'projects', 'visual skills']
            },
            business: {
                keywords: ['management', 'business', 'sales', 'marketing', 'finance'],
                emphasis: ['experience', 'achievements', 'leadership']
            },
            academic: {
                keywords: ['research', 'professor', 'teaching', 'academic', 'education'],
                emphasis: ['publications', 'research', 'education']
            }
        };

        this.layoutWeights = {
            contentDensity: 0.3,
            experienceLength: 0.25,
            skillCount: 0.2,
            educationLevel: 0.25
        };
    }

    // Analyze resume content to determine optimal layout
    analyzeContent(resume) {
        const industry = this.detectIndustry(resume);
        const contentMetrics = this.calculateContentMetrics(resume);
        const layoutScore = this.calculateLayoutScore(contentMetrics);

        return {
            industry,
            layoutScore,
            recommendedTemplate: this.selectTemplate(industry, layoutScore)
        };
    }

    // Detect industry based on content analysis
    detectIndustry(resume) {
        const allText = this.extractAllText(resume);
        const scores = {};

        // Calculate industry match scores
        Object.entries(this.industryPatterns).forEach(([industry, pattern]) => {
            scores[industry] = pattern.keywords.reduce((score, keyword) => {
                const regex = new RegExp(keyword, 'gi');
                const matches = (allText.match(regex) || []).length;
                return score + matches;
            }, 0);
        });

        // Return industry with highest score
        return Object.entries(scores)
            .sort(([, a], [, b]) => b - a)[0][0];
    }

    // Extract all text from resume for analysis
    extractAllText(resume) {
        const texts = [];

        // Add job titles and descriptions
        if (resume.experience) {
            resume.experience.forEach(exp => {
                texts.push(exp.position);
                texts.push(exp.description);
            });
        }

        // Add skills
        if (resume.skills) {
            texts.push(...resume.skills);
        }

        // Add education
        if (resume.education) {
            resume.education.forEach(edu => {
                texts.push(edu.degree);
                texts.push(edu.field);
            });
        }

        return texts.join(' ').toLowerCase();
    }

    // Calculate metrics for layout decision
    calculateContentMetrics(resume) {
        return {
            contentDensity: this.calculateContentDensity(resume),
            experienceLength: this.calculateExperienceLength(resume),
            skillCount: this.calculateSkillCount(resume),
            educationLevel: this.calculateEducationLevel(resume)
        };
    }

    // Calculate content density score
    calculateContentDensity(resume) {
        const allText = this.extractAllText(resume);
        const words = allText.split(/\s+/).length;
        // Normalize to 0-1 scale, assuming 1000 words as upper limit
        return Math.min(words / 1000, 1);
    }

    // Calculate experience length score
    calculateExperienceLength(resume) {
        if (!resume.experience) return 0;
        // Normalize to 0-1 scale, assuming 10 years as upper limit
        const years = resume.experience.reduce((total, exp) => {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : new Date();
            return total + (end - start) / (1000 * 60 * 60 * 24 * 365);
        }, 0);
        return Math.min(years / 10, 1);
    }

    // Calculate skill count score
    calculateSkillCount(resume) {
        if (!resume.skills) return 0;
        // Normalize to 0-1 scale, assuming 20 skills as upper limit
        return Math.min(resume.skills.length / 20, 1);
    }

    // Calculate education level score
    calculateEducationLevel(resume) {
        if (!resume.education) return 0;
        const degreeWeights = {
            'phd': 1,
            'master': 0.8,
            'bachelor': 0.6,
            'associate': 0.4,
            'certificate': 0.2
        };
        return Math.max(...resume.education.map(edu => {
            const level = Object.keys(degreeWeights).find(degree => 
                edu.degree.toLowerCase().includes(degree)
            );
            return level ? degreeWeights[level] : 0.3;
        }));
    }

    // Calculate overall layout score
    calculateLayoutScore(metrics) {
        return Object.entries(this.layoutWeights).reduce((score, [metric, weight]) => {
            return score + (metrics[metric] * weight);
        }, 0);
    }

    // Select appropriate template based on analysis
    selectTemplate(industry, layoutScore) {
        // Define template variations
        const templates = {
            minimal: {
                maxScore: 0.3,
                styles: {
                    spacing: 'compact',
                    fontSize: 'small',
                    columns: 1
                }
            },
            balanced: {
                maxScore: 0.6,
                styles: {
                    spacing: 'moderate',
                    fontSize: 'medium',
                    columns: 1
                }
            },
            expanded: {
                maxScore: 1,
                styles: {
                    spacing: 'generous',
                    fontSize: 'large',
                    columns: 2
                }
            }
        };

        // Select base template by layout score
        let baseTemplate;
        for (const [name, template] of Object.entries(templates)) {
            if (layoutScore <= template.maxScore) {
                baseTemplate = { ...template.styles, name };
                break;
            }
        }

        // Customize template based on industry
        return this.customizeTemplateForIndustry(baseTemplate, industry);
    }

    // Customize template based on industry requirements
    customizeTemplateForIndustry(template, industry) {
        const industryCustomizations = {
            tech: {
                accentColor: '#2196F3',
                sectionOrder: ['skills', 'experience', 'projects', 'education'],
                skillsLayout: 'grid'
            },
            creative: {
                accentColor: '#E91E63',
                sectionOrder: ['portfolio', 'experience', 'skills', 'education'],
                skillsLayout: 'tags'
            },
            business: {
                accentColor: '#4CAF50',
                sectionOrder: ['experience', 'achievements', 'skills', 'education'],
                skillsLayout: 'list'
            },
            academic: {
                accentColor: '#9C27B0',
                sectionOrder: ['education', 'publications', 'research', 'teaching'],
                skillsLayout: 'detailed'
            }
        };

        return {
            ...template,
            ...industryCustomizations[industry]
        };
    }

    // Generate final template configuration
    generateTemplateConfig(resume) {
        const analysis = this.analyzeContent(resume);
        const template = this.selectTemplate(analysis.industry, analysis.layoutScore);

        return {
            ...template,
            analysis,
            typography: this.generateTypographyConfig(template),
            spacing: this.generateSpacingConfig(template),
            sections: this.generateSectionConfig(template, resume)
        };
    }

    // Generate typography configuration
    generateTypographyConfig(template) {
        const baseSizes = {
            small: { title: 24, heading: 18, subheading: 16, body: 14 },
            medium: { title: 28, heading: 20, subheading: 18, body: 16 },
            large: { title: 32, heading: 24, subheading: 20, body: 18 }
        };

        return {
            sizes: baseSizes[template.fontSize],
            fontFamily: template.name === 'creative' ? 
                "'Helvetica Neue', sans-serif" : 
                "'Georgia', serif"
        };
    }

    // Generate spacing configuration
    generateSpacingConfig(template) {
        const baseSpacing = {
            compact: { section: 16, item: 8, element: 4 },
            moderate: { section: 24, item: 16, element: 8 },
            generous: { section: 32, item: 24, element: 12 }
        };

        return baseSpacing[template.spacing];
    }

    // Generate section-specific configuration
    generateSectionConfig(template, resume) {
        return template.sectionOrder.map(section => ({
            id: section,
            layout: section === 'skills' ? template.skillsLayout : 'standard',
            visible: Boolean(resume[section] && resume[section].length > 0)
        }));
    }
}

// Dynamic Template Generator
class TemplateGenerator {
    constructor() {
        this.analyzer = new TemplateAnalyzer();
    }

    // Generate complete template configuration
    generateTemplate(resume) {
        const templateConfig = this.analyzer.generateTemplateConfig(resume);
        return this.createTemplateStyles(templateConfig);
    }

    // Create CSS styles based on template configuration
    createTemplateStyles(config) {
        return {
            container: {
                maxWidth: config.columns === 1 ? '800px' : '1000px',
                margin: '0 auto',
                padding: `${config.spacing.section}px`,
                fontFamily: config.typography.fontFamily,
                color: '#333',
            },
            header: {
                marginBottom: `${config.spacing.section}px`,
                borderBottom: `2px solid ${config.accentColor}`,
            },
            section: {
                marginBottom: `${config.spacing.section}px`,
            },
            sectionTitle: {
                fontSize: `${config.typography.sizes.heading}px`,
                color: config.accentColor,
                marginBottom: `${config.spacing.item}px`,
            },
            item: {
                marginBottom: `${config.spacing.item}px`,
            },
            grid: config.columns === 2 ? {
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: `${config.spacing.section}px`,
            } : {},
            skills: {
                display: config.skillsLayout === 'grid' ? 'grid' : 'flex',
                flexWrap: config.skillsLayout === 'tags' ? 'wrap' : 'nowrap',
                gap: `${config.spacing.element}px`,
            },
        };
    }
}

export { TemplateAnalyzer, TemplateGenerator };
