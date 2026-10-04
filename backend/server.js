require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const resumeRoutes = require("./routes/resume");
const authRoutes = require("./routes/auth");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const path = require("path");
const profileRoutes = require("./routes/profile");
const orgRoutes = require("./routes/org");

// add to debugs
console.log("authRoutes:", typeof authRoutes);
console.log("resumeRoutes:", typeof resumeRoutes);
console.log("profileRoutes:", typeof profileRoutes);
console.log("orgRoutes:", typeof orgRoutes);

const app = express();
const PORT = process.env.PORT || 5000;

// Allow both local dev and deployed Vercel frontends
const rawFrontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null;
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  rawFrontendUrl
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);
    
    const cleanOrigin = origin.replace(/\/$/, '');
    
    // Check configured origins or localhost
    if (allowedOrigins.includes(cleanOrigin) || cleanOrigin.includes('localhost') || cleanOrigin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow any Vercel deployment (production, branch, and preview URLs)
    if (/^https:\/\/.*\.vercel\.app$/.test(cleanOrigin)) {
      return callback(null, true);
    }
    
    // If FRONTEND_URL is not configured yet or not in production, accept origin to avoid blocking
    if (!process.env.FRONTEND_URL || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/org", orgRoutes);

// Static uploads serving
const uploadsPath = path.join(__dirname, 'uploads');
if (!require('fs').existsSync(uploadsPath)) {
  require('fs').mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get("/", (req, res) => res.json({ 
  status: "ok", 
  message: "Resume Analyzer API running",
  database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
}));

// Start HTTP server immediately so Render health check passes without waiting for DB
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB asynchronously
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.error("MongoDB connection error:", err.message));
} else {
  console.warn("WARNING: MONGO_URI is not set. Please configure it in Render environment variables.");
}
