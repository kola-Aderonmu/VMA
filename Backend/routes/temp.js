// routes/temp.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// @route   POST /api/temp/create-superadmin
// @desc    Create the first SuperAdmin (Temporary Route)
// @access  Public (Remove after creation)
router.post("/create-superadmin", async (req, res) => {
  const { fullName, serviceNumber, email, password } = req.body;

  try {
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "SuperAdmin already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const superAdmin = new User({
      fullName,
      serviceNumber,
      email,
      password: hashedPassword,
      status: "approved",
      role: "superadmin",
    });

    await superAdmin.save();
    res.status(201).json({ message: "SuperAdmin created successfully." });
  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    res.status(500).json({ message: "Failed to create SuperAdmin." });
  }
});

module.exports = router;
