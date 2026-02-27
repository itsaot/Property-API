const mongoose = require("mongoose");

const maintenanceMessageSchema = new mongoose.Schema(
  {
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: "MaintenanceTicket", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    attachments: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceMessage", maintenanceMessageSchema);
