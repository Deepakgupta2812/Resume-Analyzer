const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  identifier: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  role: {
    type: String,
    enum: ['candidate', 'organization'],
    default: 'candidate'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null
  },
  profile: {
    education: { type: String, default: "" },
    certification: { type: String, default: "" },
    position: { type: String, default: "" },
    graduation: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
    cgpa: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    uploadedCertificates: [{ type: String }]
  }
});

module.exports = mongoose.model("User", userSchema);
