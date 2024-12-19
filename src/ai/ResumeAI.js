// Custom Resume AI Implementation
import { SkillRecommender } from './SkillRecommender';
import { SUBSCRIPTION_TIERS } from '../contexts/SubscriptionContext';

// TF-IDF (Term Frequency-Inverse Document Frequency) implementation
class TFIDFAnalyzer {
    constructor() {
        this.documents = [];
        this.vocabulary = new Set();
        this.idfScores = {};
    }

    // Calculate term frequency in a document
    calculateTF(document) {
        if (!document || typeof document !== 'string') return {};
        const terms = document.toLowerCase().split(/\s+/);
        const tf = {};
        terms.forEach(term => {
            tf[term] = (tf[term] || 0) + 1;
        });
        return tf;
    }

    // Calculate IDF scores
    calculateIDF() {
        const N = this.documents.length;
        this.vocabulary.forEach(term => {
            const documentCount = this.documents.filter(doc => 
                doc && typeof doc === 'string' && doc.toLowerCase().includes(term)
            ).length;
            this.idfScores[term] = Math.log(N / (1 + documentCount));
        });
    }

    // Add documents to the corpus
    addDocuments(newDocuments) {
        if (!Array.isArray(newDocuments)) return;
        
        newDocuments.forEach(doc => {
            if (!doc || typeof doc !== 'string') return;
            
            this.documents.push(doc);
            doc.toLowerCase().split(/\s+/).forEach(term => {
                this.vocabulary.add(term);
            });
        });
        this.calculateIDF();
    }

    // Get TF-IDF scores for a document
    getTFIDFScores(document) {
        if (!document || typeof document !== 'string') return {};
        
        const tf = this.calculateTF(document);
        const tfidf = {};
        Object.keys(tf).forEach(term => {
            if (this.idfScores[term]) {
                tfidf[term] = tf[term] * this.idfScores[term];
            }
        });
        return tfidf;
    }
}

// Resume Content Analyzer
class ResumeAnalyzer {
    constructor() {
        this.tfidfAnalyzer = new TFIDFAnalyzer();
        this.skillRecommender = new SkillRecommender();
        this.impactWords = new Set([
            'achieved', 'improved', 'developed', 'led', 'managed',
            'created', 'increased', 'decreased', 'optimized', 'implemented'
        ]);
    }

    // Initialize with sample data
    async initialize(sampleResumes) {
        if (!Array.isArray(sampleResumes)) return;

        // Extract text content from sample resumes
        const documents = sampleResumes.map(resume => {
            if (!resume || !resume.experience) return '';
            
            return resume.experience
                .map(exp => `${exp.position} ${exp.company} ${exp.description}`)
                .join(' ');
        }).filter(doc => doc); // Remove empty documents

        this.tfidfAnalyzer.addDocuments(documents);

        // Initialize skill recommender
        sampleResumes.forEach(resume => {
            if (resume && Array.isArray(resume.skills)) {
                this.skillRecommender.addSkillSet(resume.skills);
            }
        });
    }

    // Analyze resume content and provide recommendations
    async analyzeResume(resume) {
        try {
            if (!resume) return {
                contentScore: 0,
                recommendations: [],
                skillSuggestions: []
            };

            const analysis = {
                contentScore: 0,
                recommendations: [],
                skillSuggestions: []
            };

            // Analyze experience descriptions
            if (resume.experience) {
                resume.experience.forEach(exp => {
                    if (!exp || !exp.description) return;
                    
                    const tfidfScores = this.tfidfAnalyzer.getTFIDFScores(exp.description);
                    const impactScore = this.calculateImpactScore(exp.description);
                    
                    analysis.contentScore += this.calculateContentScore(tfidfScores, impactScore);
                    
                    const recommendations = this.generateContentRecommendations(
                        exp.description,
                        tfidfScores,
                        impactScore
                    );
                    analysis.recommendations.push(...recommendations);
                });
            }

            // Get skill recommendations
            if (resume.skills) {
                const currentSkills = resume.skills.map(skill => 
                    typeof skill === 'string' ? skill : skill.name
                );
                
                analysis.skillSuggestions = this.skillRecommender.getRecommendations(
                    currentSkills,
                    resume.experience,
                    resume.education,
                    resume.personal?.summary
                );
            }

            return analysis;
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw new Error('Failed to analyze resume');
        }
    }

    // Calculate impact score based on action verbs and metrics
    calculateImpactScore(text) {
        if (!text || typeof text !== 'string') return 0;
        
        const words = text.toLowerCase().split(/\s+/);
        const impactWordCount = words.filter(word => this.impactWords.has(word)).length;
        const hasMetrics = /\d+%|\d+x|\$\d+|\d+ percent/i.test(text);
        
        return (impactWordCount / words.length) + (hasMetrics ? 0.5 : 0);
    }

    // Calculate overall content score
    calculateContentScore(tfidfScores, impactScore) {
        if (Object.keys(tfidfScores).length === 0) return 0;
        
        const avgTFIDF = Object.values(tfidfScores).reduce((a, b) => a + b, 0) / 
                        Math.max(1, Object.values(tfidfScores).length);
        return (avgTFIDF * 0.6) + (impactScore * 0.4);
    }

    // Generate specific content recommendations
    generateContentRecommendations(text, tfidfScores, impactScore) {
        if (!text || typeof text !== 'string') return [];
        
        const recommendations = [];

        // Check for impact words
        if (impactScore < 0.1) {
            recommendations.push({
                type: 'impact',
                message: 'Consider adding more action verbs to strengthen your descriptions'
            });
        }

        // Check for metrics
        if (!/\d+%|\d+x|\$\d+|\d+ percent/i.test(text)) {
            recommendations.push({
                type: 'metrics',
                message: 'Add specific metrics or quantifiable achievements to your descriptions'
            });
        }

        // Check content uniqueness
        const uniqueTerms = Object.entries(tfidfScores)
            .filter(([_, score]) => score > 0.1)
            .length;
        if (uniqueTerms < 5) {
            recommendations.push({
                type: 'uniqueness',
                message: 'Your description could be more specific to stand out'
            });
        }

        return recommendations;
    }
}

class ResumeAI {
    constructor(subscriptionTier = SUBSCRIPTION_TIERS.FREE) {
        this.subscriptionTier = subscriptionTier;
        this.error = null;
        this.initialized = false;
        this.resumeAnalyzer = new ResumeAnalyzer();
    }

    setSubscriptionTier(tier) {
        this.subscriptionTier = tier;
    }

    checkSubscription() {
        if (this.subscriptionTier === SUBSCRIPTION_TIERS.FREE) {
            this.error = 'This feature is only available for premium users. Please upgrade your subscription to access AI features.';
            return false;
        }
        return true;
    }

    async initialize() {
        if (this.initialized) return;
        
        this.initialized = true;
    }

    async analyzeResume(resumeData) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            const analysis = await this.resumeAnalyzer.analyzeResume(resumeData);
            
            // Apply subscription-based limitations and features
            if (this.subscriptionTier === SUBSCRIPTION_TIERS.FREE) {
                // Limit skill suggestions
                if (analysis.skillSuggestions.length > 5) {
                    analysis.skillSuggestions = analysis.skillSuggestions.slice(0, 5);
                }
                
                // Limit recommendations
                if (analysis.recommendations.length > 3) {
                    analysis.recommendations = analysis.recommendations.slice(0, 3);
                }
                
                // Add upgrade message
                analysis.recommendations.push({
                    type: 'upgrade',
                    message: 'Upgrade to Premium for more detailed recommendations and advanced AI analysis'
                });
            } else {
                // Premium features
                analysis.industryInsights = this.generateIndustryInsights(resumeData);
                analysis.keywordOptimization = this.optimizeKeywords(resumeData);
                analysis.competitiveAnalysis = this.analyzeCompetitivePosition(resumeData);
                analysis.careerPathSuggestions = this.suggestCareerPaths(resumeData);
            }

            return analysis;
        } catch (error) {
            console.error('Error analyzing resume:', error);
            throw new Error('Failed to analyze resume');
        }
    }

    // Premium feature: Generate industry-specific insights
    generateIndustryInsights(resumeData) {
        const industry = this.determineIndustry(resumeData);
        return {
            industry,
            trends: this.getIndustryTrends(industry),
            inDemandSkills: this.getInDemandSkills(industry),
            growthAreas: this.getGrowthAreas(industry)
        };
    }

    // Premium feature: Optimize keywords for ATS systems
    optimizeKeywords(resumeData) {
        const keywords = new Set();
        const missingKeywords = new Set();
        
        // Analyze job titles and descriptions
        if (resumeData.experience) {
            resumeData.experience.forEach(exp => {
                const relevantKeywords = this.extractRelevantKeywords(exp.title, exp.description);
                relevantKeywords.forEach(keyword => keywords.add(keyword));
            });
        }

        // Check for missing important keywords
        const industryKeywords = this.getIndustryKeywords(this.determineIndustry(resumeData));
        industryKeywords.forEach(keyword => {
            if (!keywords.has(keyword)) {
                missingKeywords.add(keyword);
            }
        });

        return {
            currentKeywords: Array.from(keywords),
            missingKeywords: Array.from(missingKeywords),
            atsScore: this.calculateATSScore(keywords, missingKeywords)
        };
    }

    // Premium feature: Analyze competitive position
    analyzeCompetitivePosition(resumeData) {
        const industry = this.determineIndustry(resumeData);
        const experienceLevel = this.calculateExperienceLevel(resumeData);
        
        return {
            marketPosition: this.assessMarketPosition(industry, experienceLevel),
            uniqueStrengths: this.identifyUniqueStrengths(resumeData),
            improvementAreas: this.identifyImprovementAreas(resumeData),
            salaryRange: this.estimateSalaryRange(industry, experienceLevel)
        };
    }

    // Premium feature: Suggest career paths
    suggestCareerPaths(resumeData) {
        const currentRole = this.determineCurrentRole(resumeData);
        const skills = new Set(resumeData.skills?.map(skill => 
            typeof skill === 'string' ? skill : skill.name
        ));
        
        return {
            nextSteps: this.suggestNextCareerSteps(currentRole, skills),
            requiredSkills: this.identifyRequiredSkills(currentRole, skills),
            potentialRoles: this.findPotentialRoles(currentRole, skills),
            educationSuggestions: this.suggestEducation(currentRole, skills)
        };
    }

    // Helper methods for premium features
    getIndustryTrends(industry) {
        // Implement industry trend analysis
        return [
            'Remote work opportunities increasing',
            'Growing demand for digital transformation skills',
            'Emphasis on data-driven decision making',
            'Rising importance of soft skills'
        ];
    }

    getIndustryKeywords(industry) {
        // Return industry-specific keywords
        return [
            'agile', 'scrum', 'cloud computing', 'digital transformation',
            'data analytics', 'project management', 'team leadership'
        ];
    }

    calculateATSScore(keywords, missingKeywords) {
        // Calculate ATS optimization score
        const totalKeywords = keywords.size + missingKeywords.size;
        return Math.round((keywords.size / totalKeywords) * 100);
    }

    assessMarketPosition(industry, experienceLevel) {
        // Assess market position based on industry and experience
        return {
            demandLevel: 'High',
            competitionLevel: 'Medium',
            marketTrends: 'Growing demand in remote positions',
            recommendations: [
                'Focus on cloud certifications',
                'Develop leadership skills',
                'Build portfolio of successful projects'
            ]
        };
    }

    suggestNextCareerSteps(currentRole, skills) {
        // Suggest next career steps based on current role and skills
        return [
            {
                role: 'Senior Software Engineer',
                requirements: ['Leadership experience', 'System design', 'Mentoring'],
                timeframe: '1-2 years'
            },
            {
                role: 'Technical Lead',
                requirements: ['Team management', 'Architecture design', 'Project planning'],
                timeframe: '2-3 years'
            }
        ];
    }

    // Generate content recommendations
    generateContentRecommendations(resumeData) {
        const recommendations = [];

        // Personal section suggestions
        if (!resumeData.personal?.summary) {
            recommendations.push({
                section: 'personal',
                type: 'missing',
                message: 'Add a professional summary to highlight your key strengths'
            });
        }

        // Experience suggestions
        if (!resumeData.experience || resumeData.experience.length === 0) {
            recommendations.push({
                section: 'experience',
                type: 'missing',
                message: 'Add your work experience to showcase your professional background'
            });
        }

        // Education suggestions
        if (!resumeData.education || resumeData.education.length === 0) {
            recommendations.push({
                section: 'education',
                type: 'missing',
                message: 'Include your educational background'
            });
        }

        // Skills suggestions
        if (!resumeData.skills || resumeData.skills.length < 5) {
            recommendations.push({
                section: 'skills',
                type: 'incomplete',
                message: 'Add more relevant skills to strengthen your profile'
            });
        }

        return recommendations;
    }

    // Calculate overall scores
    calculateContentScore(resumeData) {
        let score = 0;
        const sections = ['personal', 'experience', 'education', 'skills'];
        
        sections.forEach(section => {
            if (resumeData[section]) {
                if (Array.isArray(resumeData[section])) {
                    score += resumeData[section].length * 0.25;
                } else if (typeof resumeData[section] === 'object') {
                    score += Object.keys(resumeData[section]).length * 0.25;
                }
            }
        });

        return Math.min(score, 1);
    }

    // Determine industry
    determineIndustry(resumeData) {
        if (!resumeData?.skills) return 'general';

        const techSkills = ['JavaScript', 'Python', 'React', 'Node.js'];
        const dataSkills = ['Data Analysis', 'Machine Learning', 'SQL'];
        const designSkills = ['UI/UX', 'Figma', 'Adobe'];

        const skills = resumeData.skills.map(s => s.toLowerCase());
        
        if (techSkills.some(skill => skills.includes(skill.toLowerCase()))) {
            return 'technology';
        } else if (dataSkills.some(skill => skills.includes(skill.toLowerCase()))) {
            return 'data';
        } else if (designSkills.some(skill => skills.includes(skill.toLowerCase()))) {
            return 'design';
        }
        
        return 'general';
    }

    async generateSuggestions(section, content) {
        if (!this.checkSubscription()) {
            return { error: this.error };
        }
        // Rest of the generateSuggestions function remains the same
    }

    handleAIAssist = async () => {
        if (!this.checkSubscription()) {
            return { error: this.error };
        }
        // Rest of the handleAIAssist function remains the same
    }
}

export default ResumeAI;
