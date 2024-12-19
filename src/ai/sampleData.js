// Sample resume data for training the AI
export const sampleResumes = [
    {
        experience: [
            {
                position: "Senior Software Engineer",
                company: "Tech Corp",
                description: "Led development of scalable microservices architecture, improving system performance by 40%. Managed team of 5 engineers and implemented CI/CD pipeline reducing deployment time by 60%."
            },
            {
                position: "Software Developer",
                company: "StartUp Inc",
                description: "Developed full-stack web applications using React and Node.js. Optimized database queries resulting in 30% faster load times."
            }
        ],
        skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "CI/CD", "MongoDB"]
    },
    {
        experience: [
            {
                position: "Data Scientist",
                company: "Analytics Co",
                description: "Implemented machine learning models achieving 85% prediction accuracy. Reduced data processing time by 50% through optimization algorithms."
            }
        ],
        skills: ["Python", "TensorFlow", "SQL", "Machine Learning", "Data Analysis", "Statistics", "Scikit-learn"]
    },
    {
        experience: [
            {
                position: "Frontend Developer",
                company: "Web Solutions",
                description: "Created responsive web interfaces using modern JavaScript frameworks. Improved website performance score from 65 to 95."
            }
        ],
        skills: ["JavaScript", "React", "Vue.js", "HTML5", "CSS3", "Webpack", "TypeScript", "Redux"]
    },
    {
        experience: [
            {
                position: "DevOps Engineer",
                company: "Cloud Systems",
                description: "Automated deployment processes saving 20 hours per week. Maintained 99.9% uptime for production services."
            }
        ],
        skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux", "Python", "Shell Scripting"]
    },
    {
        experience: [
            {
                position: "Backend Developer",
                company: "Server Logic",
                description: "Designed RESTful APIs handling 1M+ daily requests. Implemented caching solution reducing database load by 35%."
            }
        ],
        skills: ["Java", "Spring Boot", "MySQL", "Redis", "RabbitMQ", "Microservices", "API Design"]
    }
];

// Common skill relationships for different tech roles
export const skillRelationships = [
    // Frontend Development
    ["JavaScript", "React", "HTML5", "CSS3", "TypeScript", "Redux", "Webpack"],
    ["JavaScript", "Vue.js", "HTML5", "CSS3", "Vuex", "Webpack"],
    ["JavaScript", "Angular", "TypeScript", "RxJS", "HTML5", "CSS3"],
    
    // Backend Development
    ["Node.js", "Express.js", "MongoDB", "REST API", "GraphQL"],
    ["Python", "Django", "PostgreSQL", "REST API", "Celery"],
    ["Java", "Spring Boot", "MySQL", "Hibernate", "Microservices"],
    
    // DevOps
    ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform", "Linux"],
    ["AWS", "CloudFormation", "Lambda", "S3", "EC2", "Route53"],
    ["Azure", "Kubernetes", "Docker", "DevOps", "CI/CD"],
    
    // Data Science
    ["Python", "TensorFlow", "Scikit-learn", "Pandas", "NumPy"],
    ["R", "Statistics", "Machine Learning", "Data Analysis", "Visualization"],
    ["SQL", "Python", "Data Analysis", "Tableau", "Power BI"]
];

// Impact verbs commonly used in strong resumes
export const impactVerbs = [
    "achieved",
    "improved",
    "developed",
    "led",
    "managed",
    "created",
    "increased",
    "decreased",
    "optimized",
    "implemented",
    "designed",
    "launched",
    "coordinated",
    "streamlined",
    "reduced",
    "accelerated",
    "transformed",
    "pioneered",
    "spearheaded",
    "orchestrated"
];
