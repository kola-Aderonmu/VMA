// server/models/VisitorRequest.js
const mongoose = require("mongoose");

const visitorRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mainVisitor: {
    title: {
      type: String,
      required: true, // allows any title input by the user
    },
    gender: {
      type: String,
      required: true,
      enum: ["M", "F"], // restricts to 'M' or 'F'
    },
    name: { type: String, required: true },

    phone: { type: String, required: true },
  },
  purpose: { type: String, required: true },
  officeOfVisit: {
    type: String,
    required: true, 
  },
  visitDate: { type: Date, required: true },
  visitTime: { type: String, required: true },
  additionalVisitors: [{ type: String }],
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  photoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VisitorRequest", visitorRequestSchema);
