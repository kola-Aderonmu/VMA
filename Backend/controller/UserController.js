const User = require("../models/User");
const VisitorRequest = require("../models/VisitorRequest");
const moment = require("moment");
const Notification = require("../models/Notification");

const createVisitorRequest = async (req, res) => {
  try {
    // Validate user authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const {
      title,
      name,
      gender,
      phone,
      purpose,
      officeOfVisit,
      visitDate,
      visitTime,
    } = req.body;

    // Create new visitor instance
    const newVisitor = new Visitor({
      title,
      name,
      gender,
      phoneNumber: phone,
      purpose,
      officeOfVisit,
      timeOfVisit: visitTime,
      dateOfVisit: visitDate,
      requestedBy: req.user.id,
      status: "pending",
      photo: req.file ? `/uploads/${req.file.filename}` : null,
    });

    // Save visitor to database
    const savedVisitor = await newVisitor.save();
    console.log("Visitor saved successfully:", savedVisitor);

    // Create visitor request
    const visitorRequest = await VisitorRequest.create({
      userId: req.user.id,
      mainVisitor: savedVisitor._id,
      status: "pending",
      visitDate: visitDate,
    });

    // Create notification for office
    await Notification.create({
      userId: req.user.id,
      type: "NEW_VISITOR_REQUEST",
      message: `New visitor request from ${name} for ${officeOfVisit}`,
      visitorRequestId: visitorRequest._id,
    });

    res.status(201).json({
      success: true,
      message: "Visitor request created successfully",
      data: {
        visitor: savedVisitor,
        request: visitorRequest,
      },
    });
  } catch (error) {
    console.error("Visitor creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create visitor request",
      error: error.message,
    });
  }
};

const getVisitorRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const visitorRequests = await VisitorRequest.find({ userId })
      .populate("mainVisitor")
      .sort({ createdAt: -1 });

    console.log("Retrieved visitor requests:", visitorRequests);
    res.json(visitorRequests);
  } catch (error) {
    console.error("Error in getVisitorRequests:", error);
    res.status(500).json({
      message: "Error fetching visitor requests",
      error: error.message,
    });
  }
};

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

const handleVisitorApproval = async (req, res) => {
  const { visitorId, userId } = req.body;
  try {
    // Create entry in visitor history for the target user
    const visitorRequest = await VisitorRequest.create({
      userId: userId,
      mainVisitor: visitorId,
      status: "approved",
      visitDate: new Date(),
    });

    await visitorRequest.populate("mainVisitor");

    // Send notification to the user
    await Notification.create({
      userId: userId,
      type: "VISITOR_APPROVED",
      message: `New visitor approved for you`,
      visitorRequestId: visitorRequest._id,
    });

    res.status(200).json({ message: "Visitor approved and added to history" });
  } catch (error) {
    res.status(500).json({ message: "Error processing visitor approval" });
  }
};

module.exports = {
  createVisitorRequest,
  getVisitorRequests,
  cancelVisitorRequest,
  getUserProfile,
  updateUserProfile,
  getVisitorStats,
  updateVisitorRequestStatus,
  getNotifications,
  handleVisitorApproval,
};
