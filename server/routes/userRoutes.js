const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authenticateUser } = require("../middleware/authMiddleware");
const UserController = require("../controller/UserController");
const VisitorRequest = require("../models/VisitorRequest"); // Add this import

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Visitor Request Routes
router.post(
  "/visitor-requests",
  authenticateUser,
  upload.single("photo"),
  UserController.createVisitorRequest
);

router.get(
  "/visitor-requests",
  authenticateUser,
  UserController.getVisitorRequests
);

router.delete(
  "/visitor-requests/:id",
  authenticateUser,
  UserController.cancelVisitorRequest
);

// Visitor History Route
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const visitorRequests = await VisitorRequest.find({ userId })
      .populate("mainVisitor")
      .sort({ createdAt: -1 });
    res.json(visitorRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching visitor requests" });
  }
});

// Visitor Approval Route
router.post(
  "/visitor-approval",
  authenticateUser,
  UserController.handleVisitorApproval
);

// User Profile Routes
router.get("/profile", authenticateUser, UserController.getUserProfile);
router.put("/profile", authenticateUser, UserController.updateUserProfile);
router.get("/visitor-stats", authenticateUser, UserController.getVisitorStats);

// Authentication Route
router.post("/logout", async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout" });
  }
});

module.exports = router;
