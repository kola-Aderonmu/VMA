// controller/admin.js
const User = require("../models/User");

// Get all pending user registrations
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: "pending" });
    res.status(200).json({ pendingUsers });
  } catch (error) {
    console.error("Error fetching pending users:", error);
    res.status(500).json({ message: "Failed to fetch pending users." });
  }
};

// Approve a user
const approveUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status !== "pending") {
      return res.status(400).json({ message: "User is not pending approval." });
    }

    user.status = "approved";
    await user.save();

    res.status(200).json({ message: "User approved successfully." });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Failed to approve user." });
  }
};

// Reject a user
const rejectUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.status !== "pending") {
      return res.status(400).json({ message: "User is not pending approval." });
    }

    user.status = "rejected";
    await user.save();

    res.status(200).json({ message: "User rejected successfully." });
  } catch (error) {
    console.error("Error rejecting user:", error);
    res.status(500).json({ message: "Failed to reject user." });
  }
};

module.exports = { getPendingUsers, approveUser, rejectUser };
