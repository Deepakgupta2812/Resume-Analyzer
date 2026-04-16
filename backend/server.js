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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
})); // Configure Helmet to allow frontend to fetch static upload images
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/org", orgRoutes);

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => res.json({ message: "Resume Analyzer API running" }));

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
