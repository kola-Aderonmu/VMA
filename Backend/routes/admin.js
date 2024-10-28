const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Visitor = require("../models/visitor");
const {
  authenticateUser,
  checkSuperAdmin,
} = require("../middleware/authMiddleware");

// Test route
router.get("/test", (req, res) => {
  res.status(200).send("Test route works!");
});

// Visitor Management Routes
router.post("/create-visitor", authenticateUser, async (req, res) => {
  try {
    const {
      title,
      name,
      surname,
      phoneNumber,
      address,
      officeOfVisit,
      timeOfVisit,
    } = req.body;
    const newVisitor = new Visitor({
      title,
      name,
      surname,
      phoneNumber,
      address,
      officeOfVisit,
      timeOfVisit,
    });

    await newVisitor.save();
    const officeUser = await User.findOne({
      office: officeOfVisit,
      role: "office",
    });

    if (officeUser) {
      console.log(
        `Notification: A new visitor has arrived for ${officeOfVisit}`
      );
    }

    res.status(201).json({
      message: "Visitor created successfully and office notified.",
    });
  } catch (error) {
    console.error("Error during visitor creation:", error);
    res.status(500).json({
      message: "Failed to create visitor, please try again later.",
    });
  }
});

// User Management Routes
router.delete(
  "/delete-user/:userId",
  authenticateUser,
  checkSuperAdmin,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error during user deletion:", error);
      res.status(500).json({
        message: "Failed to delete user, please try again later.",
      });
    }
  }
);

module.exports = router;
