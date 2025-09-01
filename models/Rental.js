const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  landlord: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String],

  available: { type: Boolean, default: true },

  tenants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  flagged: { type: Boolean, default: false }
}, { timestamps: true });

// Virtual: number of tenants
rentalSchema.virtual("tenantCount").get(function () {
  return this.tenants ? this.tenants.length : 0;
});

module.exports = mongoose.model("Rental", rentalSchema);
