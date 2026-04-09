// Predefined required skills for each job role
const roleSkills = {
  "Web Developer": {
    required: ["html", "css", "javascript", "react", "nodejs", "git", "responsive design", "api", "typescript", "webpack"],
    keywords: ["frontend", "backend", "fullstack", "rest", "json", "dom", "npm", "express", "mongodb", "sql"],
    structure: ["projects", "experience", "education", "skills", "summary"]
  },
  "Data Analyst": {
    required: ["python", "sql", "excel", "tableau", "power bi", "statistics", "pandas", "numpy", "data visualization", "machine learning"],
    keywords: ["analysis", "dashboard", "reporting", "etl", "data cleaning", "insights", "kpi", "metrics", "forecasting", "bi"],
    structure: ["projects", "experience", "education", "skills", "certifications"]
  },
  "UI/UX Designer": {
    required: ["figma", "adobe xd", "sketch", "wireframing", "prototyping", "user research", "usability testing", "css", "design systems", "typography"],
    keywords: ["ux", "ui", "interaction", "user flow", "persona", "accessibility", "responsive", "mockup", "branding", "color theory"],
    structure: ["portfolio", "projects", "experience", "education", "skills"]
  },
  "DevOps Engineer": {
    required: ["docker", "kubernetes", "aws", "ci/cd", "jenkins", "terraform", "linux", "bash", "git", "ansible"],
    keywords: ["deployment", "pipeline", "infrastructure", "monitoring", "cloud", "automation", "scalability", "microservices", "nginx", "prometheus"],
    structure: ["projects", "experience", "education", "skills", "certifications"]
  },
  "Data Scientist": {
    required: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "statistics", "sql", "pandas", "scikit-learn", "data visualization"],
    keywords: ["model", "algorithm", "neural network", "nlp", "computer vision", "regression", "classification", "clustering", "feature engineering", "jupyter"],
    structure: ["projects", "research", "experience", "education", "publications"]
  },
  "Backend Developer": {
    required: ["nodejs", "python", "java", "sql", "mongodb", "rest api", "git", "docker", "express", "authentication"],
    keywords: ["server", "database", "microservices", "api", "backend", "scalability", "caching", "redis", "postgresql", "security"],
    structure: ["projects", "experience", "education", "skills", "summary"]
  }
};

// Normalize text for comparison
const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9\s\/]/g, " ");

const analyzeResume = (resumeText, jobRole) => {
  const role = roleSkills[jobRole];
  if (!role) return null;

  const text = normalize(resumeText);

  // Skills Match Score (40%)
  const matchedSkills = role.required.filter(skill => text.includes(skill));
  const missingSkills = role.required.filter(skill => !text.includes(skill));
  const skillScore = (matchedSkills.length / role.required.length) * 40;

  // Keywords Score (30%)
  const matchedKeywords = role.keywords.filter(kw => text.includes(kw));
  const keywordScore = (matchedKeywords.length / role.keywords.length) * 30;

  // Structure Score (30%)
  const matchedSections = role.structure.filter(sec => text.includes(sec));
  const missingSections = role.structure.filter(sec => !text.includes(sec));
  const structureScore = (matchedSections.length / role.structure.length) * 30;

  const totalScore = Math.round(skillScore + keywordScore + structureScore);

  // Generate improvement suggestions
  const suggestions = [
    ...missingSkills.map(s => `Add "${s.charAt(0).toUpperCase() + s.slice(1)}" to your skills section`),
    ...missingSections.map(s => `Include a "${s.charAt(0).toUpperCase() + s.slice(1)}" section in your resume`),
    ...(matchedKeywords.length < 5 ? [`Use more ${jobRole}-specific keywords to improve ATS ranking`] : []),
    ...(totalScore < 50 ? ["Consider tailoring your resume specifically for this job role"] : []),
    ...(totalScore >= 80 ? ["Great resume! Minor tweaks can push it to 90+"] : [])
  ];

  return {
    atsScore: totalScore,
    skillsMatchScore: Math.round(skillScore),
    keywordsScore: Math.round(keywordScore),
    structureScore: Math.round(structureScore),
    matchedSkills,
    missingSkills,
    matchedKeywords,
    matchedSections,
    missingSections,
    suggestions: suggestions.slice(0, 6) // Top 6 suggestions
  };
};

module.exports = { analyzeResume, roleSkills };
