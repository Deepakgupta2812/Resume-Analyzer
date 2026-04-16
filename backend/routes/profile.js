const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for local storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed'));
  }
});

const uploadCert = multer({ 
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images are allowed.'));
  }
});

// GET /api/profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('profile name identifier');
    if (!user) return res.status(404).json({ error: "User not found." });
    
    // Ensure profile object exists even if old user
    const profile = user.profile || {};
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// PUT /api/profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { education, certification, position, graduation, graduationYear, cgpa } = req.body;
    
    // Dynamically build the update object for profile fields
    const updateObj = {};
    if (education !== undefined) updateObj['profile.education'] = education;
    if (certification !== undefined) updateObj['profile.certification'] = certification;
    if (position !== undefined) updateObj['profile.position'] = position;
    if (graduation !== undefined) updateObj['profile.graduation'] = graduation;
    if (graduationYear !== undefined) updateObj['profile.graduationYear'] = graduationYear;
    if (cgpa !== undefined) updateObj['profile.cgpa'] = cgpa;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateObj },
      { new: true }
    );

    res.json(user.profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile." });
  }
});

// POST /api/profile/upload
router.post('/upload', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file provided." });

    // Store relative path to easily serve it static
    const filePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'profile.profilePicture': filePath } },
      { new: true }
    );

    res.json({ message: "Profile picture updated.", profilePicture: filePath });
  } catch (err) {
    res.status(500).json({ error: err.message || "Upload failed." });
  }
});

// DELETE /api/profile/picture
router.delete('/picture', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'profile.profilePicture': "" } },
      { new: true }
    );
    res.json({ message: "Profile picture removed." });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove picture." });
  }
});

// POST /api/profile/upload-certificate
router.post('/upload-certificate', authMiddleware, (req, res) => {
  uploadCert.single('certificate')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: "File exceeds 3MB limit." });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    try {
      if (!req.file) return res.status(400).json({ error: "No image file provided." });

      const filePath = `/uploads/${req.file.filename}`;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { 'profile.uploadedCertificates': filePath } },
        { new: true }
      );

      res.json({ message: "Certificate uploaded.", uploadedCertificates: user.profile.uploadedCertificates });
    } catch (e) {
      res.status(500).json({ error: e.message || "Upload failed." });
    }
  });
});

// DELETE /api/profile/certificate/:index
router.delete('/certificate/:index', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const certs = user.profile.uploadedCertificates || [];
    const idx = parseInt(req.params.index);
    if (idx >= 0 && idx < certs.length) {
      certs.splice(idx, 1);
      user.profile.uploadedCertificates = certs;
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: { 'profile.uploadedCertificates': certs } },
        { new: true }
      );
      res.json({ uploadedCertificates: updatedUser.profile.uploadedCertificates });
    } else {
      res.status(400).json({ error: "Invalid certificate index." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete certificate" });
  }
});

module.exports = router;
