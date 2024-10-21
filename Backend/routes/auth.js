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
} = require("../middleware/authMiddleware");

const router = express.Router();

// Route for user login
router.route("/login").post(loginUser);

// Route for SuperAdmin login
router.route("/superadmin/login").post(loginSuperAdmin);

// Route for user signup
router.route("/signup").post(signupUser);

// Route for user logout
router.route("/logout").post(authenticateToken, logoutUser);

// Routes for SuperAdmin to manage users
router
  .route("/pending-users")
  .get(authenticateToken, authorizeRoles("superadmin"), getPendingUsers);

router
  .route("/approve-user/:id")
  .put(authenticateToken, authorizeRoles("superadmin"), approveUser);

router
  .route("/reject-user/:id")
  .put(authenticateToken, authorizeRoles("superadmin"), rejectUser);

router.post("/create-superadmin", createSuperAdmin);
router.post("/refresh-token", authenticateToken, refreshToken);

module.exports = router;
