const nlpService = require('./nlpService');
const { TFIDFAnalyzer } = require('../../src/ai/ResumeAI');

// Job role categories and their common skills/requirements
const JOB_ROLES = {
    software_engineering: {
        titles: [
            'software engineer', 'software developer', 'full stack developer',
            'backend developer', 'frontend developer', 'devops engineer',
            'mobile developer', 'systems engineer', 'cloud engineer'
        ],
        core_skills: {
            technical: [
                'algorithms', 'data structures', 'git', 'apis',
                'databases', 'testing', 'debugging', 'system design'
            ],
            languages: [
                'javascript', 'python', 'java', 'c++',
                'typescript', 'sql', 'html', 'css'
            ],
            frameworks: [
                'react', 'node.js', 'angular', 'vue',
                'django', 'spring', 'express', 'docker'
            ]
        }
    },
    data_science: {
        titles: [
            'data scientist', 'machine learning engineer', 'ai engineer',
            'data analyst', 'research scientist', 'quantitative analyst',
            'ml ops engineer', 'data engineer'
        ],
        core_skills: {
            technical: [
                'machine learning', 'deep learning', 'statistics',
                'data analysis', 'data visualization', 'big data',
                'feature engineering', 'model deployment'
            ],
            languages: [
                'python', 'r', 'sql', 'scala', 'julia'
            ],
            frameworks: [
                'tensorflow', 'pytorch', 'scikit-learn', 'pandas',
                'numpy', 'keras', 'spark', 'hadoop'
            ]
        }
    },
    product_management: {
        titles: [
            'product manager', 'product owner', 'technical product manager',
            'program manager', 'project manager', 'scrum master'
        ],
        core_skills: {
            technical: [
                'product strategy', 'roadmap planning', 'market analysis',
                'user stories', 'product metrics', 'a/b testing',
                'competitive analysis', 'product lifecycle'
            ],
            tools: [
                'jira', 'confluence', 'trello', 'asana', 'tableau',
                'google analytics', 'mixpanel', 'figma'
            ],
            methodologies: [
                'agile', 'scrum', 'kanban', 'lean', 'waterfall',
                'design thinking', 'user-centered design'
            ]
        }
    }
};

// Initialize TF-IDF analyzer
const tfidfAnalyzer = new TFIDFAnalyzer();

// Cache for role suggestions
const roleCache = new Map();
const ROLE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class JobRoleService {
    constructor() {
        this.cache = roleCache;
        this.tfidfAnalyzer = tfidfAnalyzer;
        this._initializeTFIDF();
    }

    _initializeTFIDF() {
        // Add role titles and descriptions to TF-IDF analyzer
        const documents = [];
        for (const [category, data] of Object.entries(JOB_ROLES)) {
            data.titles.forEach(title => {
                documents.push(`${title} ${category.replace('_', ' ')}`);
            });
        }
        this.tfidfAnalyzer.addDocuments(documents);
    }

    _getCacheKey(jobTitle) {
        return jobTitle.toLowerCase().trim();
    }

    async getRoleSuggestions(jobTitle) {
        try {
            if (!jobTitle || typeof jobTitle !== 'string') {
                throw new Error('Invalid job title format');
            }

            const cacheKey = this._getCacheKey(jobTitle);
            const cachedResult = this.cache.get(cacheKey);
            
            if (cachedResult && (Date.now() - cachedResult.timestamp) < ROLE_CACHE_DURATION) {
                return cachedResult.data;
            }

            const roleCategory = await this._findRoleCategory(jobTitle);
            const skills = this._getSkillsForRole(roleCategory);
            const recommendations = this._getRecommendationsForRole(roleCategory);

            const result = {
                category: roleCategory,
                skills,
                recommendations,
                similarTitles: this._getSimilarTitles(roleCategory, jobTitle)
            };

            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });

            return result;
        } catch (error) {
            console.error('Error in getRoleSuggestions:', error);
            throw new Error(`Failed to get role suggestions: ${error.message}`);
        }
    }

    _findRoleCategory(title) {
        const normalizedTitle = title.toLowerCase().trim();
        const titleScores = this.tfidfAnalyzer.getTFIDFScores(normalizedTitle);
        
        let bestMatch = {
            category: null,
            score: 0
        };

        for (const [category, data] of Object.entries(JOB_ROLES)) {
            const categoryScore = this._calculateCategoryScore(titleScores, data.titles, category);
            if (categoryScore > bestMatch.score) {
                bestMatch = { category, score: categoryScore };
            }
        }

        return bestMatch.category || 'other';
    }

    _calculateCategoryScore(titleScores, roleTitles, category) {
        let maxScore = 0;
        const categoryTerms = category.replace('_', ' ').split(' ');

        for (const roleTitle of roleTitles) {
            const terms = [...roleTitle.toLowerCase().split(' '), ...categoryTerms];
            const score = terms.reduce((sum, term) => sum + (titleScores[term] || 0), 0);
            maxScore = Math.max(maxScore, score);
        }

        return maxScore;
    }

    _getSimilarTitles(category, originalTitle) {
        if (!category || !JOB_ROLES[category]) return [];
        
        const titles = JOB_ROLES[category].titles;
        const originalScores = this.tfidfAnalyzer.getTFIDFScores(originalTitle);
        
        return titles
            .filter(title => title.toLowerCase() !== originalTitle.toLowerCase())
            .map(title => ({
                title,
                similarity: this._calculateTitleSimilarity(originalScores, title)
            }))
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5)
            .map(item => item.title);
    }

    _calculateTitleSimilarity(originalScores, compareTitle) {
        const compareScores = this.tfidfAnalyzer.getTFIDFScores(compareTitle);
        const allTerms = new Set([...Object.keys(originalScores), ...Object.keys(compareScores)]);
        
        let similarity = 0;
        allTerms.forEach(term => {
            similarity += Math.min(originalScores[term] || 0, compareScores[term] || 0);
        });
        
        return similarity;
    }

    _getSkillsForRole(roleCategory) {
        const roleData = JOB_ROLES[roleCategory];
        if (!roleData) return [];

        const skills = [];
        for (const [type, typeSkills] of Object.entries(roleData.core_skills)) {
            skills.push(...typeSkills.map(skill => ({
                name: skill,
                type: type,
                importance: this._getSkillTypeWeight(type)
            })));
        }

        return skills;
    }

    _getSkillTypeWeight(skillType) {
        const weights = {
            technical: 0.8,
            languages: 0.9,
            frameworks: 0.7,
            tools: 0.6,
            methodologies: 0.5
        };
        return weights[skillType] || 0.5;
    }

    _getRecommendationsForRole(roleCategory) {
        const roleData = JOB_ROLES[roleCategory];
        if (!roleData) return [];

        return [
            {
                type: 'skill_focus',
                message: `Focus on core ${roleCategory} skills like ${roleData.core_skills.technical.slice(0, 3).join(', ')}`
            },
            {
                type: 'learning_path',
                message: `Consider learning popular frameworks like ${roleData.core_skills.frameworks.slice(0, 3).join(', ')}`
            }
        ];
    }
}

module.exports = new JobRoleService();
