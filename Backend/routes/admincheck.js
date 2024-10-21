const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Admin Login Route
router.post("/login", async (req, res) => {
  console.log("Admin login route hit");
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
  const { serviceNumber, password } = req.body;

  try {
    // Find the user by service number
    const user = await User.findOne({ serviceNumber });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized user. Service number or password is incorrect.",
      });
    }

    // Check if the user is an admin
    if (user.userType !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. You are not an admin." });
    }

    // Check if the user is approved
    if (user.status !== "approved") {
      return res
        .status(403)
        .json({ message: "Access denied. Your account is not approved." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Unauthorized user. Service number or password is incorrect.",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during admin login:", error);
    res
      .status(500)
      .json({ message: "Failed to log in, please try again later." });
  }
});

module.exports = router;
