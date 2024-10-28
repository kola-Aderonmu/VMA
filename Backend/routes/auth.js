const express = require("express");
const {
  signupUser,
  loginUser,
  loginSuperAdmin,
  getPendingUsers,
  approveUser,
  rejectUser,
  logoutUser,
  createSuperAdmin,
  refreshToken,
} = require("../controller/auth");
const {
  authenticateToken,
  authorizeRoles,
  checkSuperAdmin,
  authenticateUser,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Authentication Routes
router.route("/login").post(loginUser);
router.route("/superadmin/login").post(loginSuperAdmin);
router.route("/signup").post(signupUser);
router.route("/logout").post(authenticateUser, logoutUser);
router.post("/create-superadmin", createSuperAdmin);
router.post("/refresh-token", authenticateUser, refreshToken);

// SuperAdmin User Management Routes
router
  .route("/pending-users")
  .get(authenticateUser, authorizeRoles("superadmin"), getPendingUsers);
router
  .route("/approve-user/:id")
  .put(authenticateUser, authorizeRoles("superadmin"), approveUser);
router
  .route("/reject-user/:id")
  .put(authenticateUser, authorizeRoles("superadmin"), rejectUser);

module.exports = router;
