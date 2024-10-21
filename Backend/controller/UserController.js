const User = require("../models/User");
const VisitorRequest = require("../models/VisitorRequest");
const moment = require("moment");
const Notification = require("../models/Notification");

async function createVisitorRequest(req, res) {
  try {
    const newRequest = new VisitorRequest({
      ...req.body,
      userId: req.user.id,
    });
    await newRequest.save();
    res.status(201).json({ message: "Visitor request created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error creating visitor request",
      error: error.message,
    });
  }
}

async function getVisitorRequests(req, res) {
  try {
    const requests = await VisitorRequest.find({ userId: req.user.id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching visitor requests",
      error: error.message,
    });
  }
}

async function cancelVisitorRequest(req, res) {
  try {
    await VisitorRequest.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    res.json({ message: "Visitor request cancelled successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error cancelling visitor request",
      error: error.message,
    });
  }
}

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: error.message });
  }
}

async function updateUserProfile(req, res) {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user profile", error: error.message });
  }
}

async function getVisitorStats(req, res) {
  try {
    const userId = req.user.id;
    const today = moment().startOf("day");
    const thirtyDaysAgo = moment().subtract(30, "days").startOf("day");

    // Daily stats for the last 30 days
    const dailyStats = await VisitorRequest.aggregate([
      {
        $match: {
          userId: userId,
          visitDate: { $gte: thirtyDaysAgo.toDate(), $lte: today.toDate() },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$visitDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly stats for the last 12 months
    const monthlyStats = await VisitorRequest.aggregate([
      {
        $match: {
          userId: userId,
          visitDate: {
            $gte: moment().subtract(12, "months").startOf("month").toDate(),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$visitDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format the results
    const formattedDailyStats = dailyStats.map((stat) => ({
      date: stat._id,
      count: stat.count,
    }));

    const formattedMonthlyStats = monthlyStats.map((stat) => ({
      month: moment(stat._id, "YYYY-MM").format("MMMM YYYY"),
      count: stat.count,
    }));

    res.json({
      daily: formattedDailyStats,
      monthly: formattedMonthlyStats,
    });
  } catch (error) {
    console.error("Error fetching visitor statistics:", error);
    res.status(500).json({
      message: "Error fetching visitor statistics",
      error: error.message,
    });
  }
}

async function updateVisitorRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const visitorRequest = await VisitorRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!visitorRequest) {
      return res.status(404).json({ message: "Visitor request not found" });
    }

    // Create a notification
    await Notification.create({
      userId: visitorRequest.userId,
      message: `Your visitor request for ${visitorRequest.mainVisitor.name} has been ${status}`,
      type: status === "approved" ? "success" : "warning",
    });

    res.json(visitorRequest);
  } catch (error) {
    console.error("Error updating visitor request status:", error);
    res.status(500).json({
      message: "Error updating visitor request status",
      error: error.message,
    });
  }
}

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 }
    );
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res
      .status(500)
      .json({ message: "Error fetching notifications", error: error.message });
  }
}

module.exports = {
  createVisitorRequest,
  getVisitorRequests,
  cancelVisitorRequest,
  getUserProfile,
  updateUserProfile,
  getVisitorStats,
  updateVisitorRequestStatus,
  getNotifications,
};
