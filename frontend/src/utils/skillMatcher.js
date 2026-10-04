// Client-side skill matcher for instant ATS evaluation
export const roleSkills = {
  "Web Developer": {
    required: ["html", "css", "javascript", "react", "node.js", "git", "responsive design", "api", "typescript", "webpack"],
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
    required: ["node.js", "python", "java", "sql", "mongodb", "rest api", "git", "docker", "express", "authentication"],
    keywords: ["server", "database", "microservices", "api", "backend", "scalability", "caching", "redis", "postgresql", "security"],
    structure: ["projects", "experience", "education", "skills", "summary"]
  },
  "Mechanical Engineering (ME)": {
    required: ["autocad", "solidworks", "thermodynamics", "fluid mechanics", "manufacturing", "cad", "matlab", "ansys", "fea", "project management"],
    keywords: ["design", "simulation", "machining", "hvac", "materials", "robotics", "automation", "testing", "prototyping", "cad/cam"],
    structure: ["projects", "experience", "education", "skills", "certifications"]
  },
  "Civil Engineering (CE)": {
    required: ["autocad", "revit", "structural analysis", "surveying", "construction management", "sap2000", "etabs", "geotechnical", "project management"],
    keywords: ["design", "infrastructure", "concrete", "steel", "planning", "estimation", "site execution", "safety", "environmental", "urban"],
    structure: ["projects", "experience", "education", "skills", "certifications"]
  },
  "Biotechnology": {
    required: ["molecular biology", "pcr", "cell culture", "genetics", "biochemistry", "microbiology", "bioinformatics", "data analysis", "r", "python"],
    keywords: ["research", "laboratory", "gmp", "assay", "fermentation", "purification", "qa", "qc", "clinical", "pharma"],
    structure: ["research", "experience", "education", "skills", "publications"]
  },
  "Agriculture": {
    required: ["agronomy", "soil science", "crop production", "pest management", "precision agriculture", "data analysis", "gis", "sustainability", "irrigation"],
    keywords: ["farming", "yield", "genetics", "fertilizers", "harvesting", "livestock", "supply chain", "ecology", "research", "botany"],
    structure: ["projects", "experience", "education", "skills", "summary"]
  },
  "Electrical Engineering": {
    required: ["circuit design", "matlab", "vhdl", "plc", "verilog", "power systems", "microcontrollers", "autocad electrical", "c", "c++"],
    keywords: ["electronics", "pcb", "embedded", "control systems", "hardware", "signal processing", "instrumentation", "sensors", "automation", "rf"],
    structure: ["projects", "experience", "education", "skills", "certifications"]
  },
  "Frontend Developer": {
    required: ["html", "css", "javascript", "react", "vue", "angular", "responsive design", "typescript", "git"],
    keywords: ["ui", "dom", "browser", "webpack", "ajax", "accessibility", "spa", "css3", "html5", "redux"],
    structure: ["projects", "experience", "education", "skills"]
  },
  "Full Stack Developer": {
    required: ["javascript", "react", "node.js", "express", "mongodb", "sql", "git", "api", "html", "css"],
    keywords: ["frontend", "backend", "database", "rest", "server", "deployment", "fullstack", "architecture", "microservices", "agile"],
    structure: ["projects", "experience", "education", "skills"]
  },
  "Mobile App Developer (Android/iOS)": {
    required: ["swift", "kotlin", "java", "react native", "flutter", "dart", "ios", "android", "mobile design", "api integration"],
    keywords: ["app store", "google play", "mobile", "lifecycle", "xcode", "android studio", "ui/ux", "push notifications", "sdk", "gradle"],
    structure: ["projects", "experience", "education", "skills"]
  },
  "Software Engineer": {
    required: ["java", "python", "c++", "c#", "data structures", "algorithms", "object oriented programming", "git", "sql", "testing"],
    keywords: ["software development", "agile", "scrum", "debugging", "system design", "architecture", "sdlc", "optimization", "clean code", "version control"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "Data Engineer": {
    required: ["python", "sql", "hadoop", "spark", "kafka", "etl", "aws", "data pipeline", "airflow", "database"],
    keywords: ["big data", "data warehousing", "redshift", "scala", "nosql", "cloud", "data architecture", "distributed systems", "streaming", "batch"],
    structure: ["projects", "experience", "education", "skills"]
  },
  "Business Analyst": {
    required: ["excel", "sql", "tableau", "power bi", "agile", "sdlc", "requirements gathering", "communication", "data analysis", "jira"],
    keywords: ["stakeholder management", "business process", "brd", "documentation", "user stories", "kpi", "gap analysis", "modeling", "reporting", "strategy"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "Machine Learning Engineer": {
    required: ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "algorithms", "sql", "data modeling", "model deployment", "statistics"],
    keywords: ["nlp", "computer vision", "neural networks", "scikit-learn", "optimization", "predictive modeling", "pandas", "numpy", "mlops", "ai"],
    structure: ["projects", "experience", "education", "skills", "publications"]
  },
  "AI Engineer": {
    required: ["python", "artificial intelligence", "machine learning", "deep learning", "tensorflow", "pytorch", "c++", "neural networks", "cloud", "api"],
    keywords: ["ai models", "data science", "algorithm design", "generative ai", "nlp", "computer vision", "optimization", "model training", "inference", "mlops"],
    structure: ["projects", "experience", "education", "skills"]
  },
  "NLP Engineer": {
    required: ["python", "nlp", "machine learning", "transformers", "bert", "gpt", "nltk", "spacy", "deep learning", "tensorflow"],
    keywords: ["text processing", "tokenization", "sentiment analysis", "language models", "computational linguistics", "word2vec", "pytorch", "dialogue systems", "information extraction", "corpus"],
    structure: ["projects", "research", "experience", "education", "skills"]
  },
  "Computer Vision Engineer": {
    required: ["python", "c++", "opencv", "computer vision", "machine learning", "deep learning", "image processing", "tensorflow", "pytorch", "cnn"],
    keywords: ["object detection", "image recognition", "segmentation", "facial recognition", "yolo", "algorithms", "camera calibration", "video analysis", "3d", "sensor fusion"],
    structure: ["projects", "experience", "education", "skills"]
  },
  "Security Analyst": {
    required: ["cybersecurity", "network security", "siem", "wireshark", "incident response", "firewalls", "vulnerability assessment", "splunk", "ids/ips", "linux"],
    keywords: ["threat analysis", "malware", "endpoint security", "penetration testing", "soc", "phishing", "mitigation", "forensics", "tcp/ip", "encryption"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Cloud Engineer": {
    required: ["aws", "azure", "gcp", "cloud computing", "linux", "python", "terraform", "kubernetes", "docker", "ci/cd"],
    keywords: ["cloud architecture", "migration", "iam", "serverless", "ec2", "s3", "vpc", "infrastructure as code", "monitoring", "networking"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "QA Engineer / Tester": {
    required: ["software testing", "qa", "manual testing", "test cases", "jira", "agile", "sql", "bug tracking", "test planning", "api testing"],
    keywords: ["quality assurance", "regression", "smoke", "sdlc", "stlc", "postman", "documentation", "black box", "integration", "defects"],
    structure: ["experience", "projects", "education", "skills"]
  }
};

const normalize = (text) =>
  (text || "").toLowerCase()
    .replace(/[^a-z0-9\s\/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const analyzeResumeClientSide = (resumeText, jobRole) => {
  const role = roleSkills[jobRole] || roleSkills["Full Stack Developer"];
  const text = normalize(resumeText);

  const matchedSkills = role.required.filter(skill => text.includes(normalize(skill)));
  const missingSkills = role.required.filter(skill => !text.includes(normalize(skill)));
  const skillScore = (matchedSkills.length / role.required.length) * 40;

  const matchedKeywords = role.keywords.filter(kw => text.includes(normalize(kw)));
  const keywordScore = (matchedKeywords.length / role.keywords.length) * 30;

  const matchedSections = role.structure.filter(sec => text.includes(normalize(sec)));
  const missingSections = role.structure.filter(sec => !text.includes(normalize(sec)));
  const structureScore = (matchedSections.length / role.structure.length) * 30;

  const totalScore = Math.min(100, Math.max(15, Math.round(skillScore + keywordScore + structureScore)));

  const suggestions = [
    ...missingSkills.map(s => `Add "${s.charAt(0).toUpperCase() + s.slice(1)}" to your skills section`),
    ...missingSections.map(s => `Include a "${s.charAt(0).toUpperCase() + s.slice(1)}" section in your resume`),
    ...(matchedKeywords.length < 5 ? [`Use more ${jobRole}-specific keywords to improve ATS ranking`] : []),
    ...(totalScore < 50 ? ["Consider tailoring your resume specifically for this job role"] : []),
    ...(totalScore >= 80 ? ["Great resume! Minor tweaks can push it to 90+"] : [])
  ];

  const aiSuggestions = missingSkills.map(skill => {
    const tips = [
      `Consider taking a short online course on ${skill} to meet the baseline requirements for a ${jobRole}.`,
      `${skill} is highly requested for ${jobRole} roles. Update your "Projects" section if you've used it informally.`,
      `Highlight any hands-on experience or coursework involving ${skill} in your experience bullets.`
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  });

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
    suggestions: suggestions.slice(0, 6),
    aiSuggestions: aiSuggestions.slice(0, 5)
  };
};
