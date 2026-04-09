const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../models/Resume");
const { analyzeResume, roleSkills } = require("../utils/skillMatcher");

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
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { jobRole } = req.body;
    if (!jobRole || !roleSkills[jobRole]) return res.status(400).json({ error: "Invalid job role" });

    const text = await extractText(req.file.path, req.file.mimetype);
    if (!text.trim()) return res.status(400).json({ error: "Could not extract text from file" });

    const analysis = analyzeResume(text, jobRole);

    // Save to MongoDB
    const saved = await Resume.create({
      fileName: req.file.originalname,
      jobRole,
      ...analysis
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ id: saved._id, ...analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Analysis failed" });
  }
});

// GET /api/resume/roles — return available job roles
router.get("/roles", (req, res) => {
  res.json(Object.keys(roleSkills));
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

module.exports = router;
