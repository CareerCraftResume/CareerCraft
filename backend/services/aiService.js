class AIResumeAnalyzer {
    constructor() {
        // Initialize without external dependencies for now
        this.analyzer = {
            analyzeResume: (resume) => {
                return {
                    score: 85,
                    suggestions: [
                        {
                            section: 'summary',
                            suggestion: 'Consider adding more quantifiable achievements'
                        },
                        {
                            section: 'experience',
                            suggestion: 'Add more specific technical skills used in each role'
                        }
                    ],
                    keywords: ['leadership', 'development', 'management'],
                    missingKeywords: ['agile', 'scrum', 'cloud'],
                    strengthScore: 80,
                    experienceScore: 85,
                    educationScore: 90,
                    skillsScore: 85
                };
            }
        };
    }

    async analyzeResume(resume) {
        try {
            // Convert resume to the format expected by analyzer
            const formattedResume = this._formatResumeForAnalysis(resume);
            
            // Get analysis from our system
            const analysis = this.analyzer.analyzeResume(formattedResume);
            
            // Enhance the analysis with backend-specific features
            return {
                ...analysis,
                aiSuggestions: this._getEnhancedSuggestions(analysis, resume)
            };
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw error;
        }
    }

    async improveContent(resume) {
        try {
            const analysis = await this.analyzeResume(resume);
            
            return {
                improvements: {
                    experience: this._improveExperienceContent(resume.experience, analysis),
                    skills: this._improveSkillsContent(resume.skills, analysis),
                    summary: this._improveSummaryContent(resume.summary, analysis)
                },
                analysis: analysis
            };
        } catch (error) {
            console.error('Error in improveContent:', error);
            throw new Error('Failed to improve resume content');
        }
    }

    _formatResumeForAnalysis(resume) {
        // Format the resume data for analysis
        return {
            summary: resume.summary || '',
            experience: resume.experience || [],
            education: resume.education || [],
            skills: resume.skills || [],
            projects: resume.projects || []
        };
    }

    _getEnhancedSuggestions(analysis, resume) {
        const suggestions = [];

        // Add suggestions based on missing sections
        if (!resume.summary) {
            suggestions.push({
                type: 'missing_section',
                section: 'summary',
                message: 'Adding a professional summary can help highlight your key qualifications'
            });
        }

        if (!resume.experience || resume.experience.length === 0) {
            suggestions.push({
                type: 'missing_section',
                section: 'experience',
                message: 'Include your work experience to demonstrate your professional background'
            });
        }

        // Add suggestions for improving existing content
        if (analysis.strengthScore < 70) {
            suggestions.push({
                type: 'content_improvement',
                section: 'general',
                message: 'Consider adding more quantifiable achievements and specific examples'
            });
        }

        return suggestions;
    }

    _improveExperienceContent(experience, analysis) {
        return experience.map(exp => ({
            ...exp,
            suggestions: this._generateBulletSuggestions(exp, analysis)
        }));
    }

    _improveSkillsContent(skills, analysis) {
        const currentSkills = new Set(skills || []);
        return {
            current: Array.from(currentSkills),
            suggested: (analysis.skillSuggestions || [])
                .filter(skill => !currentSkills.has(skill))
        };
    }

    _improveSummaryContent(summary, analysis) {
        return {
            current: summary || '',
            suggestions: analysis.recommendations
                .filter(rec => rec.type === 'summary')
                .map(rec => rec.message)
        };
    }

    _generateBulletSuggestions(experience, analysis) {
        const bullets = experience.bullets || [];
        return bullets.map(bullet => {
            const suggestions = [];
            
            // Add action verb if missing
            if (!/^[A-Z][a-z]+ed|^[A-Z][a-z]+d|^[A-Z][a-z]+ing/.test(bullet)) {
                suggestions.push(`Start with a strong action verb`);
            }
            
            // Suggest adding metrics
            if (!/\d+%|\d+x|\$\d+|\d+ percent/i.test(bullet)) {
                suggestions.push(`Add specific metrics or quantifiable results`);
            }
            
            return {
                original: bullet,
                suggestions: suggestions
            };
        });
    }
}

module.exports = new AIResumeAnalyzer();
