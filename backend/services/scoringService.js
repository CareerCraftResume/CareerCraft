const ResumeAI = require('../../src/ai/ResumeAI').default;
const atsService = require('./atsService');
const nlpService = require('./nlpService');

// Initialize ResumeAI instance
const resumeAI = new ResumeAI();

// Cache for analysis results
const analysisCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Scoring criteria and weights
const SCORING_CRITERIA = {
    content: {
        weight: 0.35,
        subcriteria: {
            impact_statements: { weight: 0.3 },
            achievements: { weight: 0.3 },
            skills_relevance: { weight: 0.2 },
            experience_description: { weight: 0.2 }
        }
    },
    ats_optimization: {
        weight: 0.25,
        subcriteria: {
            keyword_usage: { weight: 0.4 },
            keyword_placement: { weight: 0.3 },
            format_compatibility: { weight: 0.3 }
        }
    },
    structure: {
        weight: 0.20,
        subcriteria: {
            organization: { weight: 0.3 },
            section_flow: { weight: 0.3 },
            readability: { weight: 0.2 },
            consistency: { weight: 0.2 }
        }
    },
    language: {
        weight: 0.20,
        subcriteria: {
            clarity: { weight: 0.3 },
            professionalism: { weight: 0.3 },
            grammar: { weight: 0.2 },
            action_verbs: { weight: 0.2 }
        }
    }
};

// Impact verbs by category
const IMPACT_VERBS = {
    leadership: [
        'Led', 'Managed', 'Directed', 'Supervised', 'Coordinated',
        'Orchestrated', 'Spearheaded', 'Guided', 'Mentored'
    ],
    achievement: [
        'Achieved', 'Exceeded', 'Improved', 'Increased', 'Reduced',
        'Optimized', 'Enhanced', 'Accelerated', 'Maximized'
    ],
    technical: [
        'Developed', 'Implemented', 'Engineered', 'Architected', 'Designed',
        'Programmed', 'Deployed', 'Integrated', 'Automated'
    ],
    innovation: [
        'Innovated', 'Created', 'Pioneered', 'Initiated', 'Established',
        'Launched', 'Introduced', 'Transformed', 'Revolutionized'
    ]
};

class ScoringService {
    constructor() {
        this.cache = analysisCache;
        this.resumeAI = resumeAI;
    }

    // Input validation helper
    _validateInput(resumeData) {
        if (!resumeData || typeof resumeData !== 'object') {
            throw new Error('Invalid resume data format');
        }
        if (!Array.isArray(resumeData.experience)) {
            throw new Error('Resume must contain experience array');
        }
    }

    // Cache helper
    _getCacheKey(resumeData, jobDescription, jobTitle) {
        return `${JSON.stringify(resumeData)}_${jobDescription}_${jobTitle}`;
    }

    async evaluateResume(resumeData, jobDescription = '', jobTitle = '') {
        try {
            this._validateInput(resumeData);
            
            const cacheKey = this._getCacheKey(resumeData, jobDescription, jobTitle);
            const cachedResult = this.cache.get(cacheKey);
            
            if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
                return cachedResult.data;
            }

            // Use our custom AI for analysis
            const aiAnalysis = await this.resumeAI.analyzeResume(resumeData);
            const contentScore = await this.resumeAI.calculateContentScore(resumeData);
            
            // Get ATS score if job details are provided
            const atsScore = jobDescription ? 
                await atsService.scoreResume(this._convertResumeToText(resumeData), jobDescription, jobTitle) : 
                null;

            const scores = {
                content: contentScore,
                ats: atsScore ? atsScore.score : null,
                structure: aiAnalysis.structureScore,
                language: aiAnalysis.languageScore
            };

            const result = {
                scores,
                analysis: aiAnalysis,
                suggestions: await this.resumeAI.generateSuggestions(resumeData),
                industry: await this.resumeAI.determineIndustry(resumeData)
            };

            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        } catch (error) {
            console.error('Error in evaluateResume:', error);
            throw new Error(`Failed to evaluate resume: ${error.message}`);
        }
    }

    // Get ATS score using atsService
    async _getATSScore(resumeData, jobDescription, jobTitle) {
        const resumeText = this._convertResumeToText(resumeData);
        const atsResult = await atsService.scoreResume(
            resumeText,
            jobDescription,
            jobTitle
        );
        return atsResult.score / 100; // Convert to 0-1 scale
    }

    // Evaluate content quality
    async _evaluateContent(resumeData) {
        try {
            const prompt = `
                Analyze the following resume content for quality and impact:
                ${JSON.stringify(resumeData)}
                
                Evaluate and score (0-1) these aspects:
                1. Impact Statements (use of metrics, results)
                2. Achievements (significance, relevance)
                3. Skills Relevance (alignment with career goals)
                4. Experience Descriptions (clarity, depth)
                
                Return a JSON object with scores and specific feedback for each aspect.
            `;

            const response = await this.resumeAI.analyzeContent(resumeData);

            return response;
        } catch (error) {
            console.error('Error evaluating content:', error);
            throw error;
        }
    }

    // Evaluate resume structure
    async _evaluateStructure(resumeData) {
        try {
            const prompt = `
                Analyze the structure of this resume:
                ${JSON.stringify(resumeData)}
                
                Evaluate and score (0-1) these aspects:
                1. Organization (logical flow, hierarchy)
                2. Section Flow (transitions, grouping)
                3. Readability (spacing, formatting)
                4. Consistency (style, format)
                
                Return a JSON object with scores and specific feedback for each aspect.
            `;

            const response = await this.resumeAI.analyzeStructure(resumeData);

            return response;
        } catch (error) {
            console.error('Error evaluating structure:', error);
            throw error;
        }
    }

    // Evaluate language quality
    async _evaluateLanguage(resumeData) {
        try {
            const resumeText = this._convertResumeToText(resumeData);
            const nlpAnalysis = await nlpService.analyzeText(resumeText);

            const prompt = `
                Analyze the language quality of this resume:
                ${resumeText}
                
                NLP Analysis Results:
                ${JSON.stringify(nlpAnalysis)}
                
                Evaluate and score (0-1) these aspects:
                1. Clarity (clear, concise writing)
                2. Professionalism (tone, style)
                3. Grammar (correctness)
                4. Action Verbs (strength, variety)
                
                Return a JSON object with scores and specific feedback for each aspect.
            `;

            const response = await this.resumeAI.analyzeLanguage(resumeData);

            return response;
        } catch (error) {
            console.error('Error evaluating language:', error);
            throw error;
        }
    }

    // Calculate overall score
    _calculateOverallScore(scores) {
        const sections = {};
        let overall = 0;
        const detailed = {};

        // Calculate weighted scores for each main category
        for (const [category, categoryData] of Object.entries(SCORING_CRITERIA)) {
            if (!scores[category]) continue;

            let categoryScore = 0;
            const categoryDetails = {};

            // Calculate subcriteria scores
            for (const [subcriterion, subData] of Object.entries(categoryData.subcriteria)) {
                const score = scores[category][subcriterion] || 0;
                categoryScore += score * subData.weight;
                categoryDetails[subcriterion] = score;
            }

            sections[category] = categoryScore;
            detailed[category] = categoryDetails;
            overall += categoryScore * categoryData.weight;
        }

        return {
            overall,
            sections,
            detailed
        };
    }

    // Generate improvement suggestions
    async _generateImprovements(scores, resumeData, jobDescription) {
        try {
            const prompt = `
                Based on the resume analysis, generate specific improvements:
                Scores: ${JSON.stringify(scores)}
                Resume: ${JSON.stringify(resumeData)}
                Job Description: ${jobDescription || 'Not provided'}
                
                Generate:
                1. Critical improvements (must-fix issues)
                2. Recommended improvements (nice-to-have)
                3. Section-specific suggestions
                4. Quick wins (easy improvements with high impact)
                
                Return a JSON object with categorized improvements and specific examples.
            `;

            const response = await this.resumeAI.generateSuggestions(resumeData);

            return response;
        } catch (error) {
            console.error('Error generating improvements:', error);
            throw error;
        }
    }

    // Convert resume data to text format
    _convertResumeToText(resumeData) {
        // Implementation depends on resume data structure
        let text = '';
        
        // Add basic information
        if (resumeData.basics) {
            const basics = resumeData.basics;
            text += `${basics.name}\n`;
            text += `${basics.email} | ${basics.phone}\n`;
            if (basics.summary) text += `\nSummary:\n${basics.summary}\n`;
        }

        // Add experience
        if (resumeData.experience) {
            text += '\nExperience:\n';
            resumeData.experience.forEach(exp => {
                text += `${exp.title} at ${exp.company}\n`;
                text += `${exp.startDate} - ${exp.endDate}\n`;
                if (exp.highlights) {
                    exp.highlights.forEach(highlight => {
                        text += `• ${highlight}\n`;
                    });
                }
            });
        }

        // Add education
        if (resumeData.education) {
            text += '\nEducation:\n';
            resumeData.education.forEach(edu => {
                text += `${edu.degree} in ${edu.field}\n`;
                text += `${edu.institution}\n`;
            });
        }

        // Add skills
        if (resumeData.skills) {
            text += '\nSkills:\n';
            resumeData.skills.forEach(skill => {
                text += `${skill.name}: ${skill.keywords.join(', ')}\n`;
            });
        }

        return text;
    }

    // Get impact verb suggestions
    getImpactVerbSuggestions(category) {
        return IMPACT_VERBS[category] || [];
    }

    // Get all impact verbs
    getAllImpactVerbs() {
        return IMPACT_VERBS;
    }
}

module.exports = new ScoringService();
