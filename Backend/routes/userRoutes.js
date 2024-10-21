// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authMiddleware");
const UserController = require("../controller/UserController");
console.log("UserController:", UserController);

router.post("/visitor-requests", (req, res) => {
  console.log("Visitor request received");
  UserController.createVisitorRequest(req, res);
});

router.get("/visitor-requests", (req, res) => {
  console.log("GET request for visitor requests received");
  UserController.getVisitorRequests(req, res);
});

router.delete("/visitor-requests/:id", (req, res) => {
  console.log("DELETE request for visitor request received");
  UserController.cancelVisitorRequest(req, res);
});

router.post("/logout", async (req, res) => {
  try {
    // You can add any necessary cleanup here, such as invalidating the token
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error during logout" });
  }
});

router.get("/profile", authenticateUser, UserController.getUserProfile);
router.put("/profile", authenticateUser, UserController.updateUserProfile);
router.get("/visitor-stats", authenticateUser, UserController.getVisitorStats);

module.exports = router;
