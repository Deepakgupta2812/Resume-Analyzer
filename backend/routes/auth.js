const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const OtpStore = require("../models/OtpStore");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const createTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "7d" });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const sendOTP = async (email, otp) => {
  const hasRealCreds =
    process.env.EMAIL_USER &&
    process.env.EMAIL_APP_PASSWORD &&
    process.env.EMAIL_USER !== "your_gmail@gmail.com";

  if (hasRealCreds) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD },
    });
    await transporter.sendMail({
      from: `"Resume Analyzer" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      html: `<h2>Password Reset</h2><p>Your OTP is: <strong>${otp}</strong></p><p>Expires in 5 minutes.</p>`,
    });
  } else {
    console.log(`\n================================`);
    console.log(`[MOCK OTP] To: ${email}`);
    console.log(`OTP: ${otp}`);
    console.log(`================================\n`);
  }
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, identifier, password } = req.body;
    if (!name || !identifier || !password)
      return res.status(400).json({ error: "All fields are required" });

    const existing = await User.findOne({ identifier });
    if (existing) return res.status(409).json({ error: "Account already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, identifier, password: hashed, role: "candidate" });

    createTokenAndSetCookie(res, user._id);
    res.json({ message: "Account created", user: { id: user._id, name: user.name, identifier: user.identifier, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message || "Signup failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ error: "All fields are required" });

    const user = await User.findOne({ identifier, role: "candidate" });
    if (!user) return res.status(404).json({ error: "Account not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    createTokenAndSetCookie(res, user._id);
    res.json({ message: "Login successful", user: { id: user._id, name: user.name, identifier: user.identifier, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message || "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ error: "Email/identifier is required" });

    const user = await User.findOne({ identifier, role: "candidate" });
    if (!user) return res.status(404).json({ error: "No account found" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpStore.findOneAndUpdate(
      { identifier },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOTP(identifier, otp);
    res.json({ message: "OTP sent", otp }); // otp returned for mock/dev mode
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to send OTP" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    if (!identifier || !otp || !newPassword)
      return res.status(400).json({ error: "All fields are required" });

    const record = await OtpStore.findOne({ identifier });
    if (!record) return res.status(400).json({ error: "OTP expired or not found" });
    if (record.otp !== otp.trim()) return res.status(400).json({ error: "Invalid OTP" });
    if (new Date() > new Date(record.expiresAt)) return res.status(400).json({ error: "OTP has expired" });

    const user = await User.findOne({ identifier, role: "candidate" });
    if (!user) return res.status(404).json({ error: "Account not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await OtpStore.deleteOne({ identifier });

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Reset failed" });
  }
});

module.exports = router;
