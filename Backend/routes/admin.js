// routes/admin.js
const express = require("express");
const User = require("../models/User");
const Visitor = require("../models/visitor");
const {
  createSuperAdmin,
  getPendingUsers,
  approveUser,
  rejectUser,
} = require("../controller/auth");
const {
  authenticateToken,
  checkSuperAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Visitor creation route - protected by authentication
// Adjust access based on roles if necessary (e.g., only 'office' and 'subadmin' can create visitors)
router.post("/create-visitor", authenticateToken, async (req, res) => {
  const {
    title,
    name,
    surname,
    phoneNumber,
    address,
    officeOfVisit,
    timeOfVisit,
  } = req.body;

  try {
    // Create new visitor
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

    // Notify the office of the visit (this logic will be for future use in the dashboard)
    const officeUser = await User.findOne({
      office: officeOfVisit,
      role: "office",
    });
    if (officeUser) {
      // Implement actual notification logic here (e.g., email, push notification)
      console.log(
        `Notification: A new visitor has arrived for ${officeOfVisit}`
      );
    }

    res
      .status(201)
      .json({ message: "Visitor created successfully and office notified." });
  } catch (error) {
    console.error("Error during visitor creation:", error);
    res
      .status(500)
      .json({ message: "Failed to create visitor, please try again later." });
  }
});

// SuperAdmin approval route - protected by authentication and superadmin check
router.put(
  "/approve-user/:id",
  authenticateToken,
  checkSuperAdmin,
  approveUser
);

// SuperAdmin rejection route - protected by authentication and superadmin check
router.put("/reject-user/:id", authenticateToken, checkSuperAdmin, rejectUser);

// SuperAdmin delete user route - protected by authentication and superadmin check
router.delete(
  "/delete-user/:userId",
  authenticateToken,
  checkSuperAdmin,
  async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      await User.findByIdAndDelete(userId);

      // Optionally, send a notification to the user about account deletion

      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error during user deletion:", error);
      res
        .status(500)
        .json({ message: "Failed to delete user, please try again later." });
    }
  }
);

// Test route
router.get("/test", (req, res) => {
  res.status(200).send("Test route works!");
});

// Route to create SuperAdmin (use it only once or securely remove it)
router.post("/create-superadmin", createSuperAdmin);

// Fetch pending users route - protected by authentication and superadmin check
router.get(
  "/pending-users",
  authenticateToken,
  checkSuperAdmin,
  getPendingUsers
);

module.exports = router;
