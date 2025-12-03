const mongoose = require("mongoose"); // <-- make sure this line is at the top

const rentalSchema = new mongoose.Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],
  mapUrl: String, // manual Google Maps URL
  available: { type: Boolean, default: true },
  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  flagged: { type: Boolean, default: false },

  // New features
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  garageSpaces: { type: Number, default: 0 },
  parkingSpaces: { type: Number, default: 0 },
  furnished: { type: Boolean, default: false },
  petFriendly: { type: Boolean, default: false }

}, { timestamps: true });

// Virtual: number of tenants
rentalSchema.virtual("tenantCount").get(function () {
  return this.tenants ? this.tenants.length : 0;
});

module.exports = mongoose.model("Rental", rentalSchema);
