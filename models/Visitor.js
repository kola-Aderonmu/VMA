const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      unique: true,
    },
    visitorName: {
      type: String,
      required: [true, "Your name is required!"],
    },
    mobileNo: {
      type: Number,
      required: [true, "Number is a required field!"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer not to say"],
      required: [true, "Gender selection is required!"],
    },
    address: {
      type: [String],
    },
    whomToMeet: {
      type: [String],
    },
    purpose: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    dateOfVisit: {
      type: Date,
    },
  },
  { timestamps: true }
);

function getModel() {
  try {
    return mongoose.model("Visitors");
  } catch (e) {
    return mongoose.model("Visitors", visitorSchema);
  }
}

module.exports = getModel();
