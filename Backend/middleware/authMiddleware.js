// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SuperAdmin = require("../models/SuperAdmin");

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user; // Assuming the payload has { user: { id, role } }
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(400).json({ message: "Token is not valid" });
  }
};

// Generalized middleware to authorize based on roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied, insufficient privileges!" });
    }
    next();
  };
};

// Specific middleware to check for SuperAdmin
// const checkSuperAdmin = authorizeRoles("superadmin");
const checkSuperAdmin = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const superAdmin = await SuperAdmin.findById(verified.id);
    if (!superAdmin) {
      return res
        .status(403)
        .json({ message: "Access denied. SuperAdmin rights required." });
    }
    req.superAdmin = superAdmin;
    next();
  } catch (error) {
    console.error("SuperAdmin verification error:", error);
    res.status(400).json({ message: "Invalid SuperAdmin token" });
  }
};

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
module.exports = {
  authenticateToken,
  authorizeRoles,
  checkSuperAdmin,
  authenticateUser,
};
