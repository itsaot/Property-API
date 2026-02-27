const mongoose = require("mongoose");

const leaseSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  property: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  documents: [
    {
      name: String,
      url: String,
      signed: { type: Boolean, default: false },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  status: { type: String, enum: ["active", "terminated"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("Lease", leaseSchema);
