const natural = require('natural');
const { WordTokenizer, SentenceTokenizer } = natural;
const wordTokenizer = new WordTokenizer();
const sentenceTokenizer = new SentenceTokenizer();

// Resume-specific action verbs and their categories
const ACTION_VERBS = {
    leadership: [
        'led', 'managed', 'directed', 'coordinated', 'oversaw', 'supervised',
        'spearheaded', 'established', 'executed', 'delegated', 'administered'
    ],
    achievement: [
        'achieved', 'improved', 'increased', 'reduced', 'decreased', 'enhanced',
        'maximized', 'gained', 'exceeded', 'surpassed', 'accelerated'
    ],
    technical: [
        'developed', 'implemented', 'programmed', 'designed', 'engineered',
        'architected', 'built', 'configured', 'maintained', 'optimized'
    ],
    communication: [
        'presented', 'negotiated', 'collaborated', 'facilitated', 'communicated',
        'consulted', 'partnered', 'influenced', 'addressed', 'authored'
    ],
    analysis: [
        'analyzed', 'assessed', 'evaluated', 'researched', 'investigated',
        'identified', 'examined', 'studied', 'reviewed', 'measured'
    ],
    creation: [
        'created', 'launched', 'initiated', 'established', 'founded',
        'introduced', 'pioneered', 'originated', 'innovated', 'devised'
    ]
};

// Common weak words to avoid
const WEAK_WORDS = [
    'helped', 'worked', 'handled', 'responsible', 'duties', 'various',
    'assisted', 'like', 'things', 'stuff', 'dealt', 'got', 'needed'
];

// Metrics and measurement terms
const METRIC_TERMS = [
    '%', 'percent', 'increased', 'decreased', 'reduced', 'improved',
    'generated', 'saved', 'revenue', 'roi', 'budget', 'dollars', '$',
    'hours', 'days', 'weeks', 'months', 'years', 'clients', 'users',
    'customers', 'projects', 'team members', 'people', 'employees'
];

class NLPService {
    // Analyze and improve bullet points
    analyzeBulletPoints(bulletPoints) {
        return bulletPoints.map(bullet => ({
            original: bullet,
            analysis: {
                actionVerbs: this._analyzeActionVerbs(bullet),
                metrics: this._analyzeMetrics(bullet),
                weakWords: this._findWeakWords(bullet),
                complexity: this._analyzeComplexity(bullet),
                improvement: this._generateImprovedBullet(bullet)
            }
        }));
    }

    // Analyze action verbs in text
    _analyzeActionVerbs(text) {
        const tokens = wordTokenizer.tokenize(text.toLowerCase());
        const foundVerbs = {};
        
        Object.entries(ACTION_VERBS).forEach(([category, verbs]) => {
            const found = verbs.filter(verb => tokens.includes(verb));
            if (found.length > 0) {
                foundVerbs[category] = found;
            }
        });

        return {
            found: foundVerbs,
            suggestions: this._suggestActionVerbs(text, tokens)
        };
    }

    // Suggest alternative action verbs
    _suggestActionVerbs(text, tokens) {
        const suggestions = [];
        const firstWord = tokens[0];

        // Check if first word is a weak verb
        if (WEAK_WORDS.includes(firstWord)) {
            Object.entries(ACTION_VERBS).forEach(([category, verbs]) => {
                // Suggest 2-3 relevant action verbs from each category
                suggestions.push({
                    category,
                    verbs: verbs
                        .filter(verb => !tokens.includes(verb))
                        .slice(0, 3)
                });
            });
        }

        return suggestions;
    }

    // Analyze metrics and quantifiable achievements
    _analyzeMetrics(text) {
        const tokens = wordTokenizer.tokenize(text.toLowerCase());
        const foundMetrics = METRIC_TERMS.filter(term => 
            text.toLowerCase().includes(term.toLowerCase())
        );

        return {
            found: foundMetrics,
            hasNumbers: /\d+/.test(text),
            suggestions: foundMetrics.length === 0 ? 
                'Consider adding quantifiable metrics to strengthen this point' : null
        };
    }

    // Find weak words that should be avoided
    _findWeakWords(text) {
        const tokens = wordTokenizer.tokenize(text.toLowerCase());
        return WEAK_WORDS.filter(word => tokens.includes(word));
    }

    // Analyze text complexity and clarity
    _analyzeComplexity(text) {
        const sentences = sentenceTokenizer.tokenize(text);
        const words = wordTokenizer.tokenize(text);
        
        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            averageWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length,
            isComplex: words.length > 20 || sentences.length > 2,
            suggestion: this._getComplexitySuggestion(words.length, sentences.length)
        };
    }

    // Get suggestion based on complexity analysis
    _getComplexitySuggestion(wordCount, sentenceCount) {
        if (wordCount < 8) {
            return 'Too brief. Add more detail and context.';
        }
        if (wordCount > 20) {
            return 'Consider breaking into multiple bullet points for clarity.';
        }
        if (sentenceCount > 2) {
            return 'Simplify into a single, concise statement.';
        }
        return null;
    }

    // Generate improved version of bullet point
    _generateImprovedBullet(bullet) {
        const analysis = {
            actionVerbs: this._analyzeActionVerbs(bullet),
            metrics: this._analyzeMetrics(bullet),
            weakWords: this._findWeakWords(bullet),
            complexity: this._analyzeComplexity(bullet)
        };

        let improved = bullet;

        // Replace weak words with strong action verbs
        analysis.weakWords.forEach(weakWord => {
            const category = Object.keys(ACTION_VERBS)[0]; // Default to first category
            const replacement = ACTION_VERBS[category][0];
            improved = improved.replace(new RegExp(`\\b${weakWord}\\b`, 'gi'), replacement);
        });

        return improved;
    }

    // Analyze professional summary
    analyzeSummary(summary) {
        const sentences = sentenceTokenizer.tokenize(summary);
        const analysis = {
            length: summary.length,
            sentences: sentences.length,
            structure: this._analyzeSummaryStructure(sentences),
            keywords: this._extractKeywords(summary),
            improvement: this._improveSummary(summary)
        };

        return analysis;
    }

    // Analyze summary structure
    _analyzeSummaryStructure(sentences) {
        return sentences.map(sentence => ({
            text: sentence,
            wordCount: wordTokenizer.tokenize(sentence).length,
            hasActionVerb: this._hasActionVerb(sentence),
            focus: this._determineSentenceFocus(sentence)
        }));
    }

    // Determine the focus/purpose of a sentence
    _determineSentenceFocus(sentence) {
        const lowercase = sentence.toLowerCase();
        
        if (lowercase.includes('year') || lowercase.includes('experience')) {
            return 'experience';
        }
        if (lowercase.includes('seeking') || lowercase.includes('looking')) {
            return 'objective';
        }
        if (lowercase.includes('skill') || lowercase.includes('expertise')) {
            return 'skills';
        }
        if (lowercase.includes('achieved') || lowercase.includes('accomplished')) {
            return 'achievements';
        }
        return 'other';
    }

    // Check if text contains an action verb
    _hasActionVerb(text) {
        const tokens = wordTokenizer.tokenize(text.toLowerCase());
        return Object.values(ACTION_VERBS)
            .flat()
            .some(verb => tokens.includes(verb));
    }

    // Extract important keywords
    _extractKeywords(text) {
        const tokens = wordTokenizer.tokenize(text.toLowerCase());
        const tfidf = new natural.TfIdf();
        
        tfidf.addDocument(tokens);
        
        return tokens
            .map(token => ({
                word: token,
                score: tfidf.tfidf(token, 0)
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    // Improve professional summary
    _improveSummary(summary) {
        const analysis = {
            structure: this._analyzeSummaryStructure(sentenceTokenizer.tokenize(summary)),
            keywords: this._extractKeywords(summary)
        };

        let suggestions = [];

        // Check length
        if (summary.length < 200) {
            suggestions.push('Consider expanding your summary to provide more detail about your expertise and achievements.');
        } else if (summary.length > 500) {
            suggestions.push('Consider condensing your summary to be more concise and impactful.');
        }

        // Check structure
        const focuses = analysis.structure.map(s => s.focus);
        if (!focuses.includes('experience')) {
            suggestions.push('Add information about your years of experience and industry expertise.');
        }
        if (!focuses.includes('skills')) {
            suggestions.push('Include key skills and areas of expertise.');
        }
        if (!focuses.includes('achievements')) {
            suggestions.push('Highlight notable achievements or contributions.');
        }

        return suggestions;
    }

    // Analyze job description requirements
    analyzeJobDescription(description) {
        return {
            keywords: this._extractKeywords(description),
            requirements: this._extractRequirements(description),
            skills: this._extractSkills(description)
        };
    }

    // Extract job requirements
    _extractRequirements(description) {
        const sentences = sentenceTokenizer.tokenize(description);
        return sentences
            .filter(sentence => 
                sentence.toLowerCase().includes('require') ||
                sentence.toLowerCase().includes('must') ||
                sentence.toLowerCase().includes('should') ||
                sentence.toLowerCase().includes('looking for')
            )
            .map(requirement => ({
                text: requirement,
                type: this._determineRequirementType(requirement)
            }));
    }

    // Determine type of requirement
    _determineRequirementType(requirement) {
        const lowercase = requirement.toLowerCase();
        
        if (lowercase.includes('year') || lowercase.includes('experience')) {
            return 'experience';
        }
        if (lowercase.includes('degree') || lowercase.includes('education')) {
            return 'education';
        }
        if (lowercase.includes('skill') || lowercase.includes('proficient')) {
            return 'skill';
        }
        if (lowercase.includes('certification') || lowercase.includes('license')) {
            return 'certification';
        }
        return 'other';
    }

    // Extract required skills
    _extractSkills(description) {
        const tokens = wordTokenizer.tokenize(description.toLowerCase());
        const technicalSkills = [];
        const softSkills = [];

        // Add your own skill dictionaries here
        const technical = ['javascript', 'python', 'java', 'react', 'node'];
        const soft = ['communication', 'leadership', 'teamwork', 'problem-solving'];

        tokens.forEach(token => {
            if (technical.includes(token)) {
                technicalSkills.push(token);
            }
            if (soft.includes(token)) {
                softSkills.push(token);
            }
        });

        return {
            technical: technicalSkills,
            soft: softSkills
        };
    }
}

module.exports = new NLPService();
