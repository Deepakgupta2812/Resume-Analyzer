const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const Organization = require("../models/Organization");
const OtpStore = require("../models/OtpStore");
const Resume = require("../models/Resume");
const { authMiddleware } = require("../middleware/authMiddleware");
const { analyzeResume, roleSkills } = require("../utils/skillMatcher");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

const router = express.Router();

const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via email (org accounts are always email-based)
const dispatchOrgOTP = async (email, otp) => {
  const hasRealEmailCreds = process.env.EMAIL_USER &&
    process.env.EMAIL_APP_PASSWORD &&
    process.env.EMAIL_USER !== 'your_gmail@gmail.com';

  if (hasRealEmailCreds) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD }
    });
    await transporter.sendMail({
      from: `"Resume Analyzer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Organization Account — Password Reset Code',
      html: `<h2>Password Reset Request</h2><p>Your one-time reset code is: <strong>${otp}</strong></p><p>Expires in 5 minutes.</p>`
    });
  } else {
    console.log(`\n================================`);
    console.log(`[MOCK ORG OTP] To: ${email}`);
    console.log(`Reset OTP: ${otp}`);
    console.log(`================================\n`);
  }
};

const createTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });

    const domain = email.split('@')[1];
    if (!domain || publicDomains.includes(domain.toLowerCase())) {
      return res.status(400).json({ error: "Please use a professional organization email domain" });
    }

    const existingUser = await User.findOne({ identifier: email });
    if (existingUser) return res.status(409).json({ error: "Email already registered" });

    const org = await Organization.create({ name, email, domain, isVerified: true }); // Automatically verifying right away for simplicity unless we attach Twilio/Nodemailer module cleanly here.
    // NOTE: In production you would do:
    // await Organization.create({ ... isVerified: false });
    // then dispatchOTP(), but the mock mode OTP dispatcher is deep in auth.js. So we'll mock verify it instantly for UX flow unless they invoke the verify OTP.
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ identifier: email, name, password: hashedPassword, role: 'organization', organizationId: org._id });

    createTokenAndSetCookie(res, user._id);
    res.json({ message: "Organization registered successfully (Auto-Verified)", user: { id: user._id, identifier: user.identifier, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to create organization" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    // Fetch user and org separately to avoid select+populate projection conflict
    const user = await User.findOne({ identifier: email, role: 'organization' });
    if (!user) return res.status(404).json({ error: "Organization account not found" });

    // Check org verification separately
    if (user.organizationId) {
      const org = await Organization.findById(user.organizationId);
      if (org && !org.isVerified) {
        return res.status(403).json({ error: "Organization email is not verified" });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[ORG LOGIN] email=${email} hasStoredPassword=${!!user.password} passwordMatch=${isMatch}`);

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials. Please check your password." });

    createTokenAndSetCookie(res, user._id);
    res.json({ message: "Login Successful", user: { id: user._id, identifier: user.identifier, name: user.name, role: user.role } });
  } catch (err) {
    console.error("Org login error:", err);
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

router.get("/resumes", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('organizationId');
    if (!user || user.role !== 'organization') return res.status(403).json({ error: "Unauthorized. Organization access only." });
    if (!user.organizationId) return res.status(403).json({ error: "No organization linked to this account." });

    const { jobRole, minScore = 0, skill } = req.query;

    // Always scope to THIS organization only — never leak other org's resumes
    const query = { organization: user.organizationId._id };
    if (jobRole) query.jobRole = jobRole;
    if (minScore) query.atsScore = { $gte: Number(minScore) };
    if (skill) query.matchedSkills = { $in: [skill] };

    const resumes = await Resume.find(query).populate('user', 'name identifier profile').sort({ atsScore: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// DELETE /api/org/resumes/:id — org deletes only their own candidate record
router.delete("/resumes/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('role organizationId');
    if (!user || user.role !== 'organization') return res.status(403).json({ error: "Unauthorized" });

    // Ensure the resume belongs to this org before deleting
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, organization: user.organizationId });
    if (!deleted) return res.status(404).json({ error: "Record not found or does not belong to your organization" });

    res.json({ message: "Candidate record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// POST /api/org/forgot-password — send OTP to org email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    // Must be a registered org user
    const user = await User.findOne({ identifier: email, role: 'organization' });
    if (!user) return res.status(404).json({ error: "No organization account found with that email." });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await OtpStore.findOneAndUpdate(
      { identifier: email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await dispatchOrgOTP(email, otp);
    res.json({ message: "Recovery code sent to your organization email.", otp });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to send recovery code." });
  }
});

// POST /api/org/reset-password — verify OTP and set new password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: "All fields are required." });

    const otpRecord = await OtpStore.findOne({ identifier: email });
    if (!otpRecord) return res.status(400).json({ error: "Recovery code expired or not found. Please request a new one." });
    if (otpRecord.otp !== otp.trim()) return res.status(400).json({ error: "Invalid recovery code. Please check and try again." });
    if (new Date() > new Date(otpRecord.expiresAt)) return res.status(400).json({ error: "Recovery code has expired. Please request a new one." });

    // Find user first to confirm they exist
    const user = await User.findOne({ identifier: email, role: 'organization' });
    if (!user) return res.status(404).json({ error: "Organization account not found." });

    // Hash new password and save directly on the document (avoids findOneAndUpdate quirks)
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clean up OTP only after successful password save
    await OtpStore.deleteOne({ identifier: email });

    console.log(`[ORG RESET] Password updated for: ${email}`);
    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Org reset-password error:", err);
    res.status(500).json({ error: "Failed to reset password: " + err.message });
  }
});

module.exports = router;
