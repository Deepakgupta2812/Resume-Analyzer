const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  fileName: String,
  jobRole: String,
  atsScore: Number,
  skillsMatchScore: Number,
  keywordsScore: Number,
  structureScore: Number,
  matchedSkills: [String],
  missingSkills: [String],
  matchedSections: [String],
  missingSections: [String],
  suggestions: [String],
  status: { type: String, enum: ['Eligible', 'Not Eligible', 'Pending'], default: 'Pending' },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", resumeSchema);
