// Pre-trained skill embeddings and relationships
export const skillEmbeddings = {
    // Programming Languages
    'JavaScript': ['TypeScript', 'Node.js', 'React', 'Vue.js', 'Angular', 'Express.js'],
    'Python': ['Django', 'Flask', 'NumPy', 'Pandas', 'TensorFlow', 'scikit-learn'],
    'Java': ['Spring Boot', 'Hibernate', 'Maven', 'JUnit', 'Microservices'],
    'C++': ['STL', 'Boost', 'OpenGL', 'DirectX', 'Game Development'],
    'Ruby': ['Rails', 'RSpec', 'Sinatra', 'Capistrano'],
    
    // Web Development
    'React': ['Redux', 'React Native', 'Next.js', 'Webpack', 'JavaScript'],
    'Angular': ['TypeScript', 'RxJS', 'NgRx', 'Material Design'],
    'Vue.js': ['Vuex', 'Nuxt.js', 'JavaScript', 'Frontend Development'],
    'Node.js': ['Express.js', 'MongoDB', 'REST APIs', 'GraphQL', 'Microservices'],
    'HTML': ['CSS', 'JavaScript', 'Web Development', 'Responsive Design'],
    'CSS': ['Sass', 'Less', 'Bootstrap', 'Tailwind CSS', 'Web Design'],
    
    // Database
    'SQL': ['MySQL', 'PostgreSQL', 'Database Design', 'Data Modeling'],
    'MongoDB': ['NoSQL', 'Database Administration', 'Node.js', 'Mongoose'],
    'PostgreSQL': ['SQL', 'Database Administration', 'Data Modeling'],
    'Redis': ['Caching', 'NoSQL', 'Performance Optimization'],
    
    // Cloud & DevOps
    'AWS': ['Cloud Computing', 'EC2', 'S3', 'Lambda', 'CloudFormation'],
    'Docker': ['Kubernetes', 'Container Orchestration', 'DevOps', 'CI/CD'],
    'Kubernetes': ['Container Orchestration', 'Docker', 'Cloud Native'],
    'Jenkins': ['CI/CD', 'DevOps', 'Automation', 'Build Management'],
    
    // AI & Machine Learning
    'Machine Learning': ['Deep Learning', 'Neural Networks', 'TensorFlow', 'PyTorch'],
    'Deep Learning': ['Neural Networks', 'Computer Vision', 'NLP', 'AI'],
    'TensorFlow': ['Keras', 'Machine Learning', 'Deep Learning', 'Python'],
    'Computer Vision': ['OpenCV', 'Deep Learning', 'Image Processing'],
    
    // Mobile Development
    'iOS Development': ['Swift', 'Objective-C', 'Xcode', 'Mobile Development'],
    'Android Development': ['Kotlin', 'Java', 'Mobile Development'],
    'React Native': ['Mobile Development', 'JavaScript', 'Cross-platform Development'],
    'Flutter': ['Dart', 'Mobile Development', 'Cross-platform Development'],
    
    // Soft Skills
    'Project Management': ['Agile', 'Scrum', 'Team Leadership', 'Risk Management'],
    'Team Leadership': ['Management', 'Communication', 'Mentoring', 'Strategy'],
    'Communication': ['Presentation', 'Technical Writing', 'Collaboration'],
    'Problem Solving': ['Analytical Skills', 'Critical Thinking', 'Innovation'],
    
    // Version Control
    'Git': ['GitHub', 'Version Control', 'GitLab', 'Bitbucket'],
    'Version Control': ['Git', 'SVN', 'Code Management'],
    
    // Testing
    'Unit Testing': ['Test Automation', 'JUnit', 'Jest', 'Testing'],
    'Test Automation': ['Selenium', 'Cypress', 'Testing Frameworks'],
    'QA': ['Quality Assurance', 'Testing', 'Test Planning'],
    
    // Security
    'Cybersecurity': ['Security', 'Network Security', 'Penetration Testing'],
    'Network Security': ['Firewalls', 'Security Protocols', 'VPN'],
    
    // Data Science
    'Data Analysis': ['Statistics', 'Python', 'R', 'Data Visualization'],
    'Data Visualization': ['Tableau', 'Power BI', 'D3.js', 'Data Analysis'],
    'Big Data': ['Hadoop', 'Spark', 'Data Processing', 'Analytics']
};

// Skill categories for better organization and relationship mapping
export const skillCategories = {
    'Programming Languages': [
        'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'TypeScript', 'Go', 'Rust'
    ],
    'Web Development': [
        'HTML', 'CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js'
    ],
    'Database': [
        'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Oracle'
    ],
    'Cloud & DevOps': [
        'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Azure', 'GCP'
    ],
    'AI & Machine Learning': [
        'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP'
    ],
    'Mobile Development': [
        'iOS Development', 'Android Development', 'React Native', 'Flutter'
    ],
    'Soft Skills': [
        'Project Management', 'Team Leadership', 'Communication', 'Problem Solving'
    ]
};

// Calculate similarity score between two skills
export function calculateSkillSimilarity(skill1, skill2) {
    if (skill1 === skill2) return 1.0;
    
    // Check direct relationships in embeddings
    const relatedSkills1 = skillEmbeddings[skill1] || [];
    const relatedSkills2 = skillEmbeddings[skill2] || [];
    
    // Direct relationship check
    if (relatedSkills1.includes(skill2)) return 0.8;
    if (relatedSkills2.includes(skill1)) return 0.8;
    
    // Category similarity check
    const category1 = findSkillCategory(skill1);
    const category2 = findSkillCategory(skill2);
    
    if (category1 && category2 && category1 === category2) return 0.6;
    
    // Check second-degree relationships
    const hasCommonRelated = relatedSkills1.some(s => 
        relatedSkills2.includes(s)
    );
    
    if (hasCommonRelated) return 0.4;
    
    return 0.0;
}

// Find the category of a skill
function findSkillCategory(skill) {
    for (const [category, skills] of Object.entries(skillCategories)) {
        if (skills.includes(skill)) return category;
    }
    return null;
}

// Get similar skills based on embeddings
export function getSimilarSkills(skill, limit = 5) {
    const similarSkills = [];
    const directRelated = skillEmbeddings[skill] || [];
    
    // Add direct relationships
    directRelated.forEach(relatedSkill => {
        similarSkills.push({
            name: relatedSkill,
            similarity: 0.8,
            relationship: 'direct'
        });
    });
    
    // Find category-based relationships
    const category = findSkillCategory(skill);
    if (category) {
        skillCategories[category].forEach(categorySkill => {
            if (categorySkill !== skill && !directRelated.includes(categorySkill)) {
                similarSkills.push({
                    name: categorySkill,
                    similarity: 0.6,
                    relationship: 'category'
                });
            }
        });
    }
    
    // Sort by similarity and limit results
    return similarSkills
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
}
