const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../models/Resume");
const { analyzeResume, roleSkills } = require("../utils/skillMatcher");
const { optionalAuthMiddleware, authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Multer config — store in /uploads, accept PDF and DOC/DOCX
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext) ? cb(null, true) : cb(new Error("Only PDF/DOC/DOCX files allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Extract text from uploaded file
const extractText = async (filePath, mimetype) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  } else if (ext === ".doc" || ext === ".docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  return "";
};

// POST /api/resume/upload — upload and analyze resume
router.post("/upload", optionalAuthMiddleware, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { jobRole } = req.body;
    if (!jobRole || !roleSkills[jobRole]) return res.status(400).json({ error: "Invalid job role" });

    const text = await extractText(req.file.path, req.file.mimetype);
    if (!text.trim()) return res.status(400).json({ error: "Could not extract text from file" });

    const analysis = analyzeResume(text, jobRole);

    // Save to MongoDB
    const payload = {
      fileName: req.file.originalname,
      jobRole,
      ...analysis
    };

    if (req.user) {
      payload.user = req.user.id;
      // If uploader is an org user, stamp their organizationId so only that org can see it
      const uploader = await require('../models/User').findById(req.user.id).select('role organizationId');
      if (uploader?.role === 'organization' && uploader.organizationId) {
        payload.organization = uploader.organizationId;
      }
    }

    const saved = await Resume.create(payload);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ id: saved._id, ...analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
});

// GET /api/resume/history — return user's past resumes
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ uploadedAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// DELETE /api/resume/:id — delete a saved resume analysis if owned by the user
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) return res.status(404).json({ error: "Not found or unauthorized" });
    
    await Resume.deleteOne({ _id: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// Helper function to auto-categorize job roles
const categorizeRole = (role) => {
  const lower = role.toLowerCase();
  if (lower.match(/frontend|backend|full stack|web|developer|software engineer/)) return "Software Development";
  if (lower.match(/data|machine learning engineer|science|scientist/)) return "Data & Analytics";
  if (lower.match(/ai|nlp|computer vision|deep learning/)) return "AI & Emerging Tech";
  if (lower.match(/security|hacker|cyber/)) return "Cybersecurity";
  if (lower.match(/cloud|devops|sre|system admin/)) return "Cloud & DevOps";
  if (lower.match(/ui|ux|designer|graphic/)) return "Design & UI/UX";
  if (lower.match(/manager|business|operation/)) return "Business & Management";
  if (lower.match(/accountant|finance|investment|auditor/)) return "Finance & Accounting";
  if (lower.match(/marketing|seo|content|social media|sales/)) return "Marketing & Sales";
  if (lower.match(/tester|qa|automation|embedded|network/)) return "Other Technical Roles";
  return "Engineering & Science";
};

// GET /api/resume/roles — return categorized available job roles
router.get("/roles", (req, res) => {
  const grouped = {};
  Object.keys(roleSkills).forEach(role => {
    const category = categorizeRole(role);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(role);
  });
  
  // Sort categories and their subsets
  const sortedGrouped = {};
  Object.keys(grouped).sort().forEach(cat => {
    sortedGrouped[cat] = grouped[cat].sort();
  });

  res.json(sortedGrouped);
});

// GET /api/resume/:id — fetch a saved result by ID
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: "Not found" });
    res.json(resume);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/resume/ai-suggestions - mock AI based suggestion generator
router.post("/ai-suggestions", optionalAuthMiddleware, async (req, res) => {
  try {
    const { missingSkills, jobRole } = req.body;
    if (!missingSkills || !jobRole) return res.status(400).json({ error: "Missing data" });
    
    // Simulate an AI delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestions = missingSkills.map(skill => {
      const tips = [
        `Consider taking a short online course on ${skill} to meet the baseline requirements for a ${jobRole}.`,
        `${skill} is highly requested for ${jobRole} roles. Update your "Projects" section if you've used it informally.`,
        `You might be able to add ${skill} to your existing experience description if you have parallel experience.`,
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    });

    res.json({ aiSuggestions: suggestions });
  } catch (err) {
    res.status(500).json({ error: "AI Failed to generate suggestions" });
  }
});

module.exports = router;
