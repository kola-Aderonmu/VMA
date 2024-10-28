const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SuperAdmin = require("../models/SuperAdmin");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied, token missing!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Enhanced user verification
    const userData = decoded.user || decoded;
    const user = await User.findById(userData.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Authentication failed" });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied, insufficient privileges!",
      });
    }
    next();
  };
};

const checkSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied, token missing!" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const superAdmin = await SuperAdmin.findById(verified.id);

    if (!superAdmin) {
      return res.status(403).json({
        message: "Access denied. SuperAdmin rights required.",
      });
    }

    req.superAdmin = superAdmin;
    next();
  } catch (error) {
    console.error("SuperAdmin verification error:", error);
    res.status(401).json({ message: "Invalid SuperAdmin token" });
  }
};

module.exports = {
  authenticateUser,
  authorizeRoles,
  checkSuperAdmin,
};
