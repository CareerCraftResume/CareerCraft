const { TFIDFAnalyzer, SkillRecommender } = require('../../src/ai/ResumeAI');
const jobRoleService = require('./jobRoleService');

// Initialize analyzers
const tfidfAnalyzer = new TFIDFAnalyzer();
const skillRecommender = new SkillRecommender();

// Common ATS keywords by category
const ATS_KEYWORDS = {
    technical_skills: {
        software_engineering: [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS',
            'Docker', 'Kubernetes', 'CI/CD', 'Git', 'REST APIs',
            'Microservices', 'SQL', 'NoSQL', 'Cloud Computing'
        ],
        data_science: [
            'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning',
            'TensorFlow', 'PyTorch', 'Data Visualization', 'Statistics',
            'Big Data', 'Hadoop', 'Spark', 'NLP', 'Neural Networks'
        ],
        product_management: [
            'Agile', 'Scrum', 'JIRA', 'Product Strategy', 'Roadmapping',
            'User Stories', 'A/B Testing', 'Analytics', 'SQL', 'Product Metrics',
            'Stakeholder Management', 'Go-to-Market Strategy'
        ]
    },
    soft_skills: [
        'Leadership', 'Communication', 'Problem Solving',
        'Team Collaboration', 'Project Management', 'Time Management',
        'Critical Thinking', 'Adaptability', 'Innovation'
    ],
    certifications: {
        software_engineering: [
            'AWS Certified Developer', 'Microsoft Certified: Azure Developer',
            'Google Cloud Professional Developer', 'Kubernetes Certified',
            'Oracle Certified Professional', 'Certified Scrum Developer'
        ],
        data_science: [
            'AWS Certified Machine Learning', 'Google Data Analytics Professional',
            'IBM Data Science Professional', 'TensorFlow Developer Certificate',
            'Cloudera Certified Associate Data Analyst'
        ],
        product_management: [
            'Product Management Certification (PMC)', 'Certified Scrum Product Owner',
            'Professional Scrum Product Owner', 'Pragmatic Institute Certification'
        ]
    },
    methodologies: {
        software_engineering: [
            'Agile', 'Scrum', 'DevOps', 'TDD', 'CI/CD',
            'Microservices Architecture', 'RESTful Design'
        ],
        data_science: [
            'Machine Learning Pipeline', 'Data Mining', 'Statistical Analysis',
            'A/B Testing', 'Experimental Design'
        ],
        product_management: [
            'Agile Product Development', 'Design Thinking', 'Lean Startup',
            'Customer Development', 'Jobs-to-be-Done'
        ]
    }
};

// Memoization for keyword analysis
const memoizedAnalysis = new Map();
const MEMO_DURATION = 12 * 60 * 60 * 1000; // 12 hours

class ATSService {
    constructor() {
        this.memoCache = memoizedAnalysis;
        this.tfidfAnalyzer = tfidfAnalyzer;
        this.skillRecommender = skillRecommender;
    }

    // Get ATS keyword suggestions based on job description and role
    async getKeywordSuggestions(jobDescription, jobTitle) {
        try {
            // Get role category from job role service
            const roleSuggestions = await jobRoleService.getRoleSuggestions(jobTitle);
            const roleCategory = roleSuggestions?.roleCategory?.name || 'general';

            // Get relevant keywords from ATS_KEYWORDS
            const relevantKeywords = this._getRelevantKeywords(roleCategory);

            return {
                matched: relevantKeywords,
                relevantCertifications: this._getRelevantCertifications(roleCategory),
                methodologies: this._getRelevantMethodologies(roleCategory)
            };
        } catch (error) {
            console.error('Error getting ATS keyword suggestions:', error);
            throw error;
        }
    }

    // Get relevant keywords for a specific role category
    _getRelevantKeywords(roleCategory) {
        const keywords = new Set([
            ...(ATS_KEYWORDS.technical_skills[roleCategory] || []),
            ...ATS_KEYWORDS.soft_skills
        ]);
        return Array.from(keywords);
    }

    // Get relevant certifications for a role category
    _getRelevantCertifications(roleCategory) {
        return ATS_KEYWORDS.certifications[roleCategory] || [];
    }

    // Get relevant methodologies for a role category
    _getRelevantMethodologies(roleCategory) {
        return ATS_KEYWORDS.methodologies[roleCategory] || [];
    }

    _getMemoKey(text, suggestions) {
        return `${text}_${JSON.stringify(suggestions)}`;
    }

    async scoreResume(resumeText, jobDescription, jobTitle) {
        try {
            if (!resumeText || typeof resumeText !== 'string') {
                throw new Error('Invalid resume text format');
            }

            const suggestions = await this.getKeywordSuggestions(jobDescription, jobTitle);
            const memoKey = this._getMemoKey(resumeText, suggestions);
            
            const cachedAnalysis = this.memoCache.get(memoKey);
            if (cachedAnalysis && (Date.now() - cachedAnalysis.timestamp) < MEMO_DURATION) {
                return cachedAnalysis.data;
            }

            // Use TF-IDF to analyze keyword relevance
            this.tfidfAnalyzer.addDocuments([resumeText, jobDescription]);
            const tfidfScores = this.tfidfAnalyzer.getTFIDFScores(resumeText);

            // Analyze keyword presence and calculate scores
            const analysis = this._analyzeKeywordUsage(resumeText, suggestions, tfidfScores);
            const score = this._calculateATSScore(analysis);
            
            // Get skill recommendations
            const currentSkills = analysis
                .filter(k => k.category === 'technical_skills' && k.frequency > 0)
                .map(k => k.keyword);
            const recommendedSkills = await this.skillRecommender.getRecommendations(currentSkills);

            const result = {
                score,
                analysis,
                recommendedSkills,
                keywordSuggestions: suggestions
            };

            this.memoCache.set(memoKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        } catch (error) {
            console.error('Error in scoreResume:', error);
            throw new Error(`Failed to score resume: ${error.message}`);
        }
    }

    _analyzeKeywordUsage(resumeText, suggestions, tfidfScores) {
        const text = resumeText.toLowerCase();
        return suggestions.matched.map(keyword => {
            const term = keyword.toLowerCase();
            const frequency = (text.match(new RegExp(term, 'g')) || []).length;
            const relevance = tfidfScores[term] || 0;

            return {
                keyword,
                frequency,
                relevance,
                category: 'technical_skills',
                importance: 1
            };
        });
    }

    // Calculate overall ATS score
    _calculateATSScore(analysis) {
        const {
            keyword_usage,
            missing_keywords,
            weak_usage
        } = analysis;

        // Calculate base score from keyword usage
        let baseScore = Object.values(keyword_usage).reduce((sum, usage) => {
            return sum + (usage.frequency * 0.4 + 
                         usage.context_quality * 0.4 +
                         usage.placement_effectiveness * 0.2);
        }, 0) / Object.keys(keyword_usage).length;

        // Apply penalties for missing and weak keywords
        const missingPenalty = missing_keywords.length * 0.05;
        const weakPenalty = weak_usage.length * 0.03;

        // Calculate final score (0-100)
        return Math.max(0, Math.min(100, baseScore * 100 - missingPenalty - weakPenalty));
    }
}

module.exports = new ATSService();
