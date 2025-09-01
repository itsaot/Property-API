const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // sender (optional)
    type: {
      type: String,
      enum: ["review", "message", "warning", "system"],
      required: true,
    },
    message: { type: String, required: true },
    link: { type: String }, // optional redirect (e.g. /messages/123)
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
