// controller/auth.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SuperAdmin = require("../models/SuperAdmin");

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

// Generate tokens function
const generateTokens = (user) => {
  console.log("Generating tokens for user:", user);
  console.log("JWT_SECRET in generateTokens:", process.env.JWT_SECRET);

  const jwtSecret = process.env.JWT_SECRET
    ? String(process.env.JWT_SECRET)
    : null;
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET
    ? String(process.env.REFRESH_TOKEN_SECRET)
    : null;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (!refreshSecret) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};

// Signup a new user
const signupUser = async (req, res) => {
  const { fullName, serviceNumber, email, password, role, office } = req.body;

  try {
    // Validate required fields
    if (!fullName || !serviceNumber || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields." });
    }

    // Validate role
    if (!["office", "subadmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    // If role is 'office', ensure 'office' field is provided
    if (role === "office" && !office) {
      return res
        .status(400)
        .json({ message: "Office field is required for Office users." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with "pending" status
    const newUser = new User({
      fullName,
      serviceNumber,
      email,
      password: hashedPassword,
      status: "pending", // User status set to "pending" for admin approval
      role,
      office: role === "office" ? office : undefined, // Set office only if role is 'office'
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "Sign-up successful, awaiting admin approval." });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res
      .status(500)
      .json({ message: "Failed to sign up, please try again later." });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { serviceNumber, password } = req.body;

  try {
    console.log(
      "Attempting to log in user with service number:",
      serviceNumber
    );
    const user = await User.findOne({ serviceNumber });
    if (!user) {
      console.log("No user found with service number:", serviceNumber);
      return res
        .status(400)
        .json({ message: "No account with this Service Number." });
    }
    if (user.status !== "approved") {
      return res.status(400).json({ message: "Approval Pending!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Incorrect password." });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to user in database
    user.refreshToken = refreshToken;
    await user.save();

    // Create user object to send in response (excluding sensitive information)
    const userResponse = {
      id: user._id,
      fullName: user.fullName,
      serviceNumber: user.serviceNumber,
      email: user.email,
      role: user.role,
      office: user.office,
    };

    res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Failed to login, please try again later." });
  }
};

// Login SuperAdmin
const loginSuperAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const superAdmin = await SuperAdmin.findOne({ username });
    if (!superAdmin) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const { accessToken, refreshToken } = generateTokens({
      _id: superAdmin._id,
      role: "superadmin",
    });

    // Save refresh token to superadmin in database
    superAdmin.refreshToken = refreshToken;
    await superAdmin.save();

    const superAdminResponse = {
      id: superAdmin._id,
      username: superAdmin.username,
      role: "superadmin",
    };

    res.status(200).json({
      message: "SuperAdmin login successful!",
      accessToken,
      refreshToken,
      user: superAdminResponse,
    });
  } catch (error) {
    console.error("Error during SuperAdmin login:", error);
    res
      .status(500)
      .json({ message: "Failed to login, please try again later." });
  }
};

// New function to refresh the access token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token is required!" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    let user;

    if (decoded.role === "superadmin") {
      user = await SuperAdmin.findOne({
        _id: decoded.id,
        refreshToken: refreshToken,
      });
    } else {
      user = await User.findOne({
        _id: decoded.id,
        refreshToken: refreshToken,
      });
    }

    if (!user) {
      return res.status(403).json({ message: "Refresh token is not valid!" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid refresh token!" });
  }
};

// Updated Logout user
const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    let user = await User.findOne({ refreshToken });
    if (!user) {
      user = await SuperAdmin.findOne({ refreshToken });
    }

    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res
      .status(500)
      .json({ message: "Failed to logout, please try again later." });
  }
};

// Get pending users
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: "pending" });
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Failed to fetch pending users." });
  }
};

// Approve user
const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User approved successfully.", user });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Failed to approve user." });
  }
};

// Reject user
const rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json({ message: "User rejected successfully.", user });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ message: "Failed to reject user." });
  }
};

// Create SuperAdmin (use this function only once to set up the first SuperAdmin)
const createSuperAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingSuperAdmin = await SuperAdmin.findOne({ username });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "SuperAdmin already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newSuperAdmin = new SuperAdmin({
      username,
      password: hashedPassword,
    });

    await newSuperAdmin.save();
    res.status(201).json({ message: "SuperAdmin created successfully." });
  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    res.status(500).json({ message: "Failed to create SuperAdmin." });
  }
};

module.exports = {
  signupUser,
  loginUser,
  loginSuperAdmin,
  getPendingUsers,
  approveUser,
  rejectUser,
  logoutUser,
  createSuperAdmin,
  refreshToken,
};
