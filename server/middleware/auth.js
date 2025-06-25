const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { isDatabaseConnected } = require("./mockData");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // For development without database, allow mock admin token
    if (!isDatabaseConnected() && token === "mock_admin_token") {
      req.userId = "mock_admin_1";
      req.userRole = "admin";
      req.userEmail = "admin@shkva.edu";
      console.log("🔧 Using mock admin authentication");
      return next();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "shkva_secret_key",
    );

    // Check if user still exists (only if database is connected)
    if (isDatabaseConnected()) {
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "Token is not valid" });
      }
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.userEmail = decoded.email;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Token is not valid" });
  }
};

// Role-based middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res
        .status(403)
        .json({ error: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports.requireRole = requireRole;
