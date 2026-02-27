const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    rental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["single", "double", "studio"], default: "single" },
    price: { type: Number, required: true },
    occupancy: { type: Number, default: 1 },
    tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["available", "occupied", "maintenance"], default: "available" },
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
