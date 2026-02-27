const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
    amenities: [String],
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rental", rentalSchema);
