const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     fullName: { type: String, required: true },
//     serviceNumber: { type: String, required: true, index: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     status: { type: String, enum: ["pending", "approved"], default: "pending" },
//     userType: { type: String, enum: ["visitor", "admin"], default: "visitor" },
//   },
//   { timestamps: true }
// );

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    serviceNumber: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    role: {
      type: String,
      enum: ["office", "subadmin"],
      required: true,
    },
    office: {
      type: String,
      required: function () {
        return this.role === "office";
      },
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
