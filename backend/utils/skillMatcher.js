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
    required: ["javascript", "react", "nodejs", "express", "mongodb", "sql", "git", "api", "html", "css"],
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
  "Deep Learning Engineer": {
    required: ["python", "deep learning", "neural networks", "tensorflow", "pytorch", "keras", "machine learning", "gpu", "mathematics", "c++"],
    keywords: ["cnn", "rnn", "lstm", "transformers", "model optimization", "tuning", "backpropagation", "computer vision", "nlp", "research"],
    structure: ["projects", "research", "experience", "education", "skills"]
  },
  "Security Analyst": {
    required: ["cybersecurity", "network security", "siem", "wireshark", "incident response", "firewalls", "vulnerability assessment", "splunk", "ids/ips", "linux"],
    keywords: ["threat analysis", "malware", "endpoint security", "penetration testing", "soc", "phishing", "mitigation", "forensics", "tcp/ip", "encryption"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Ethical Hacker": {
    required: ["penetration testing", "kali linux", "metasploit", "nmap", "wireshark", "networking", "cryptography", "scripting", "python", "owasp"],
    keywords: ["vulnerability", "exploits", "ceh", "red team", "blue team", "burp suite", "web application security", "network scanning", "social engineering", "infosec"],
    structure: ["experience", "projects", "certifications", "skills"]
  },
  "Cybersecurity Engineer": {
    required: ["cybersecurity", "firewalls", "network security", "linux", "python", "siem", "cloud security", "cryptography", "risk assessment", "iam"],
    keywords: ["architecture", "threat modeling", "incident response", "compliance", "cissp", "vpn", "zero trust", "endpoint", "vulnerability management", "security operations"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Network Security Engineer": {
    required: ["network security", "firewalls", "cisco", "vpn", "tcp/ip", "routing", "switching", "ids/ips", "palo alto", "wireshark"],
    keywords: ["network architecture", "bgp", "ospf", "lan/wan", "load balancing", "packet capturing", "ccna", "ccnp", "security protocols", "mitigation"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Cloud Engineer": {
    required: ["aws", "azure", "gcp", "cloud computing", "linux", "python", "terraform", "kubernetes", "docker", "ci/cd"],
    keywords: ["cloud architecture", "migration", "iam", "serverless", "ec2", "s3", "vpc", "infrastructure as code", "monitoring", "networking"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Site Reliability Engineer (SRE)": {
    required: ["linux", "python", "go", "kubernetes", "docker", "aws", "terraform", "monitoring", "ansible", "ci/cd"],
    keywords: ["reliability", "scalability", "automation", "incident management", "sli/slo", "grafana", "prometheus", "troubleshooting", "infrastructure", "on-call"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "System Administrator": {
    required: ["linux", "windows server", "active directory", "networking", "bash", "powershell", "troubleshooting", "vmware", "backup", "hardware"],
    keywords: ["system config", "maintenance", "help desk", "it support", "dns", "dhcp", "patching", "security", "virtualization", "storage"],
    structure: ["experience", "education", "certifications", "skills"]
  },
  "UI Designer": {
    required: ["figma", "sketch", "adobe xd", "photoshop", "illustrator", "ui design", "visual design", "color theory", "typography", "wireframing"],
    keywords: ["user interface", "mockups", "prototypes", "branding", "layout", "responsive", "design systems", "web design", "mobile design", "icons"],
    structure: ["portfolio", "experience", "education", "skills"]
  },
  "UX Designer": {
    required: ["figma", "user research", "wireframing", "prototyping", "usability testing", "information architecture", "user flows", "interaction design", "adobe xd", "analytics"],
    keywords: ["user experience", "user journeys", "personas", "empathy mapping", "a/b testing", "heuristic evaluation", "accessibility", "agile", "collaboration", "design thinking"],
    structure: ["portfolio", "experience", "education", "skills"]
  },
  "Product Designer": {
    required: ["product design", "figma", "ui/ux", "user research", "prototyping", "wireframing", "interaction design", "design thinking", "agile", "adobe creative suite"],
    keywords: ["end-to-end", "user-centered", "strategy", "vision", "usability", "cross-functional", "iteration", "visual design", "systems thinking", "problem solving"],
    structure: ["portfolio", "experience", "education", "skills"]
  },
  "Graphic Designer": {
    required: ["adobe photoshop", "adobe illustrator", "adobe indesign", "typography", "color theory", "layout design", "branding", "print design", "digital design", "creativity"],
    keywords: ["visual communication", "logo design", "illustration", "marketing materials", "infographics", "composition", "web graphics", "social media", "packaging", "brochures"],
    structure: ["portfolio", "experience", "education", "skills"]
  },
  "Product Manager": {
    required: ["product management", "agile", "scrum", "roadmap", "strategy", "user research", "data analysis", "jira", "communication", "stakeholder management"],
    keywords: ["vision", "kpi", "go-to-market", "user stories", "backlog", "cross-functional", "prioritization", "metrics", "lifecycle", "customer success"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "Project Manager": {
    required: ["project management", "agile", "scrum", "jira", "budgeting", "risk management", "communication", "leadership", "planning", "pmp"],
    keywords: ["timelines", "deliverables", "stakeholders", "resource allocation", "kanban", "methodologies", "coordination", "tracking", "status reporting", "execution"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Operations Manager": {
    required: ["operations management", "process improvement", "leadership", "budgeting", "logistics", "supply chain", "strategy", "data analysis", "communication", "hr"],
    keywords: ["efficiency", "optimization", "kpi", "vendor management", "inventory", "compliance", "performance", "cost reduction", "planning", "cross-functional"],
    structure: ["experience", "education", "skills"]
  },
  "Business Development Executive": {
    required: ["sales", "b2b", "lead generation", "crm", "communication", "negotiation", "narket research", "networking", "strategy", "marketing"],
    keywords: ["pipeline", "prospecting", "pitching", "revenue", "partnerships", "client relations", "closing", "forecasting", "account management", "presentations"],
    structure: ["experience", "education", "skills"]
  },
  "Accountant": {
    required: ["accounting", "bookkeeping", "excel", "quickbooks", "financial reporting", "tax", "reconciliation", "gaap", "auditing", "erp"],
    keywords: ["invoicing", "payroll", "general ledger", "accounts payable", "accounts receivable", "month-end", "compliance", "balance sheet", "budgeting", "cpa"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Financial Analyst": {
    required: ["financial analysis", "excel", "financial modeling", "forecasting", "budgeting", "data analysis", "accounting", "valuation", "reporting", "finance"],
    keywords: ["corporate finance", "variance analysis", "roi", "kpi", "p&l", "trends", "dashboard", "presentations", "strategy", "sql"],
    structure: ["experience", "education", "skills"]
  },
  "Investment Banker": {
    required: ["financial modeling", "valuation", "excel", "finance", "m&a", "accounting", "powerpoint", "due diligence", "corporate finance", "economics"],
    keywords: ["pitch books", "capital markets", "lbo", "dcf", "deal execution", "equity", "debt", "ipo", "advisory", "research"],
    structure: ["experience", "education", "certifications", "skills"]
  },
  "Auditor": {
    required: ["auditing", "accounting", "compliance", "risk assessment", "excel", "gaap", "financial reporting", "internal controls", "analytical skills", "communication"],
    keywords: ["sox", "cpa", "cia", "fieldwork", "testing", "assurance", "governance", "documentation", "reconciliation", "variance analysis"],
    structure: ["experience", "certifications", "education", "skills"]
  },
  "Digital Marketing Specialist": {
    required: ["digital marketing", "seo", "sem", "google analytics", "social media", "content creation", "email marketing", "ppc", "strategy", "hubspot"],
    keywords: ["campaigns", "roi", "conversion", "optimization", "adwords", "branding", "copywriting", "kpi", "crm", "analytics"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "SEO Analyst": {
    required: ["seo", "google analytics", "keyword research", "on-page seo", "off-page seo", "html", "link building", "content strategy", "semrush", "ahrefs"],
    keywords: ["ranking", "traffic", "optimization", "search engine", "technical seo", "audits", "performance", "metrics", "reporting", "webmaster tools"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "Content Strategist": {
    required: ["content strategy", "writing", "editing", "seo", "marketing", "social media", "cms", "analytics", "copywriting", "google analytics"],
    keywords: ["editorial", "blogging", "branding", "engagement", "audience", "storytelling", "campaigns", "wordpress", "planning", "ux writing"],
    structure: ["experience", "portfolio", "education", "skills"]
  },
  "Social Media Manager": {
    required: ["social media marketing", "content creation", "facebook", "instagram", "twitter", "linkedin", "hootsuite", "analytics", "copywriting", "canva"],
    keywords: ["engagement", "community", "campaigns", "influencer", "strategy", "scheduling", "metrics", "branding", "paid social", "trends"],
    structure: ["experience", "portfolio", "education", "skills"]
  },
  "Sales Executive": {
    required: ["sales", "communication", "crm", "negotiation", "lead generation", "b2b", "b2c", "customer service", "presentations", "salesforce"],
    keywords: ["closing", "prospecting", "pipeline", "revenue", "targets", "cold calling", "account management", "pitching", "relationships", "forecasting"],
    structure: ["experience", "education", "skills"]
  },
  "QA Engineer / Tester": {
    required: ["software testing", "qa", "manual testing", "test cases", "jira", "agile", "sql", "bug tracking", "test planning", "api testing"],
    keywords: ["quality assurance", "regression", "smoke", "sdlc", "stlc", "postman", "documentation", "black box", "integration", "defects"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "Automation Tester": {
    required: ["automation testing", "selenium", "java", "python", "qa", "cypress", "api testing", "ci/cd", "git", "testng"],
    keywords: ["framework", "appium", "postman", "cucumber", "bdd", "jenkins", "regression", "scripting", "page object model", "quality assurance"],
    structure: ["experience", "projects", "education", "skills"]
  },
  "Embedded Systems Engineer": {
    required: ["c", "c++", "embedded c", "microcontrollers", "rtos", "hardware", "python", "firmware", "pcb", "debugging"],
    keywords: ["arm", "iot", "spi", "i2c", "uart", "sensors", "linux", "oscilloscope", "schematics", "electronics"],
    structure: ["projects", "experience", "education", "skills"]
  },
  "Network Engineer": {
    required: ["networking", "cisco", "ccna", "routing", "switching", "firewalls", "tcp/ip", "troubleshooting", "bgp", "ospf"],
    keywords: ["wan", "lan", "vpn", "infrastructure", "switches", "routers", "dns", "dhcp", "wireshark", "network security"],
    structure: ["experience", "certifications", "education", "skills"]
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
