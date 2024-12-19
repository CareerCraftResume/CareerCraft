// Skill Recommendation Engine
import { skillEmbeddings, skillCategories, calculateSkillSimilarity, getSimilarSkills } from './SkillEmbeddings';

export class SkillRecommender {
    constructor() {
        this.skillGraph = new Map();
        this.skillFrequency = new Map();
        this.industrySkills = new Map();
        this.roleSkills = new Map();
        this.educationSkills = new Map();
        this.commonTechSkills = new Set([
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
            'SQL', 'NoSQL', 'MongoDB', 'Git', 'AWS', 'Azure', 'Docker', 'Kubernetes',
            'HTML', 'CSS', 'TypeScript', 'REST APIs', 'GraphQL', 'CI/CD'
        ]);
        this.commonSoftSkills = new Set([
            'Communication', 'Leadership', 'Problem Solving', 'Team Management',
            'Project Management', 'Time Management', 'Critical Thinking',
            'Collaboration', 'Adaptability', 'Organization'
        ]);
    }

    // Initialize with industry and role-specific skills
    initialize() {
        // Technology industry skills
        this.industrySkills.set('technology', new Set([
            'Programming', 'Software Development', 'Cloud Computing',
            'DevOps', 'Agile', 'Database Management', 'API Development'
        ]));

        // Common software development skills
        this.roleSkills.set('software developer', new Set([
            'JavaScript', 'Python', 'Java', 'React', 'Node.js',
            'SQL', 'Git', 'REST APIs', 'AWS', 'Docker'
        ]));

        // Education field skills
        this.educationSkills.set('computer science', new Set([
            'Data Structures', 'Algorithms', 'Object-Oriented Programming',
            'Database Systems', 'Operating Systems', 'Software Engineering'
        ]));
    }

    // Get recommendations including similar skills
    getRecommendations(currentSkills, experience, education, summary, limit = 10) {
        const suggestions = [];
        const allSkills = new Set();
        const currentSkillsSet = new Set(currentSkills);

        // Get context-based suggestions
        this._getContextBasedSuggestions(suggestions, allSkills, currentSkillsSet, experience, education, summary);
        
        // Get similar skills based on current skills
        this._getSimilarSkillSuggestions(suggestions, allSkills, currentSkillsSet);

        // Sort by confidence and limit results
        return suggestions
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, limit);
    }

    _getContextBasedSuggestions(suggestions, allSkills, currentSkills, experience, education, summary) {
        // Extract skills from experience descriptions
        if (Array.isArray(experience)) {
            experience.forEach(exp => {
                if (exp.description) {
                    const skills = this.extractSkillsFromText(exp.description);
                    skills.forEach(skill => {
                        if (!currentSkills.has(skill)) {
                            suggestions.push({
                                name: skill,
                                confidence: 90,
                                source: 'experience'
                            });
                            allSkills.add(skill);
                        }
                    });
                }
                if (exp.title) {
                    const roleSkills = this.roleSkills.get(exp.title.toLowerCase()) || new Set();
                    roleSkills.forEach(skill => {
                        if (!currentSkills.has(skill) && !allSkills.has(skill)) {
                            suggestions.push({
                                name: skill,
                                confidence: 85,
                                source: 'experience'
                            });
                            allSkills.add(skill);
                        }
                    });
                }
            });
        }

        // Extract skills from education
        if (Array.isArray(education)) {
            education.forEach(edu => {
                if (edu.field) {
                    const fieldSkills = this.educationSkills.get(edu.field.toLowerCase()) || new Set();
                    fieldSkills.forEach(skill => {
                        if (!currentSkills.has(skill) && !allSkills.has(skill)) {
                            suggestions.push({
                                name: skill,
                                confidence: 80,
                                source: 'education'
                            });
                            allSkills.add(skill);
                        }
                    });
                }
            });
        }

        // Extract skills from summary
        if (summary) {
            const summarySkills = this.extractSkillsFromText(summary);
            summarySkills.forEach(skill => {
                if (!currentSkills.has(skill) && !allSkills.has(skill)) {
                    suggestions.push({
                        name: skill,
                        confidence: 75,
                        source: 'summary'
                    });
                }
            });
        }
    }

    _getSimilarSkillSuggestions(suggestions, allSkills, currentSkills) {
        // For each current skill, find similar skills
        currentSkills.forEach(skill => {
            const similarSkills = getSimilarSkills(skill, 3); // Get top 3 similar skills per current skill
            
            similarSkills.forEach(similar => {
                if (!currentSkills.has(similar.name) && !allSkills.has(similar.name)) {
                    suggestions.push({
                        name: similar.name,
                        confidence: Math.round(similar.similarity * 100),
                        source: 'similar',
                        basedOn: skill
                    });
                    allSkills.add(similar.name);
                }
            });
        });
    }

    extractSkillsFromText(text) {
        if (!text) return new Set();
        
        const words = text.toLowerCase().split(/\s+/);
        const phrases = this._generatePhrases(words, 3);
        const skills = new Set();

        // Check for common tech skills
        this.commonTechSkills.forEach(skill => {
            if (text.toLowerCase().includes(skill.toLowerCase())) {
                skills.add(skill);
            }
        });

        // Check for soft skills
        this.commonSoftSkills.forEach(skill => {
            if (text.toLowerCase().includes(skill.toLowerCase())) {
                skills.add(skill);
            }
        });

        return skills;
    }

    _generatePhrases(words, maxLength) {
        const phrases = new Set();
        for (let i = 0; i < words.length; i++) {
            for (let j = 1; j <= maxLength && i + j <= words.length; j++) {
                phrases.add(words.slice(i, i + j).join(' '));
            }
        }
        return phrases;
    }
}
