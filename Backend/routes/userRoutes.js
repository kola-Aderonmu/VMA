const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const UserController = require("../controller/UserController");
const multer = require("multer");
const path = require("path");

// Debug logging
console.log("UserController:", UserController);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and JPG are allowed."),
      false
    );
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large. Maximum size is 5MB.",
      });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// Create visitor request route
router.post(
  "/visitor-requests",
  authenticateUser,
  upload.single("photo"),
  handleMulterError,
  async (req, res) => {
    try {
      // Required fields validation
      const requiredFields = [
        "title",
        "name",
        "gender",
        "phone",
        "purpose",
        "officeOfVisit",
        "visitDate",
        "visitTime",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Add photo URL if uploaded
      if (req.file) {
        req.body.photoUrl = req.file.path;
      }

      // Forward to controller
      await UserController.createVisitorRequest(req, res);
    } catch (error) {
      console.error("Error in visitor request creation:", error);
      res.status(500).json({
        message: "Failed to create visitor request",
        error: error.message,
      });
    }
  }
);

// Get visitor requests route
router.get(
  "/visitor-requests",
  authenticateUser,
  UserController.getVisitorRequests
);

// Delete visitor request route
router.delete(
  "/visitor-requests/:id",
  authenticateUser,
  UserController.cancelVisitorRequest
);

// Get visitor history route
router.get("/history", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const visitorRequests = await VisitorRequest.find({ userId })
      .populate("mainVisitor")
      .sort({ createdAt: -1 });
    res.json(visitorRequests);
  } catch (error) {
    console.error("Error fetching visitor history:", error);
    res.status(500).json({ message: "Error fetching visitor requests" });
  }
});

// Visitor approval route
router.post(
  "/visitor-approval",
  authenticateUser,
  UserController.handleVisitorApproval
);

// User profile routes
router.get("/profile", authenticateUser, UserController.getUserProfile);
router.put("/profile", authenticateUser, UserController.updateUserProfile);
router.get("/visitor-stats", authenticateUser, UserController.getVisitorStats);
router.get("/stats", authenticateUser, UserController.getUserDashboardStats);

// Logout route
router.post("/logout", async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout" });
  }
});

module.exports = router;
