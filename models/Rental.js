const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  address: String,
  price: { type: Number, required: true },
  pricingType: { type: String, enum: ["monthly", "daily"], default: "monthly" }, // <-- new field
  images: [String],
  mapUrl: String,
  bedrooms: Number,
  bathrooms: Number,
  garageSpaces: Number,
  parkingSpaces: Number,
  furnished: Boolean,
  petFriendly: Boolean,
  available: { type: Boolean, default: true },
  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

module.exports = mongoose.model("Rental", rentalSchema);