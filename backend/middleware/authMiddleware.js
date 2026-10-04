const jwt = require("jsonwebtoken");

const extractToken = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.headers && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const authMiddleware = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Unauthorized. Please log in." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    if (res.clearCookie) res.clearCookie("token");
    return res.status(401).json({ error: "Invalid session. Please log in again." });
  }
};

const optionalAuthMiddleware = (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    if (res.clearCookie) res.clearCookie("token");
    next();
  }
};

module.exports = { authMiddleware, optionalAuthMiddleware };
