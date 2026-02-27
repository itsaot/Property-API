const mongoose = require("mongoose");

const maintenanceTicketSchema = new mongoose.Schema(
  {
    rental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    title: { type: String, required: true },
    description: { type: String },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "MaintenanceMessage" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceTicket", maintenanceTicketSchema);
