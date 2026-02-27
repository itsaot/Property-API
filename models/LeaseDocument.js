const mongoose = require("mongoose");

const leaseDocumentSchema = new mongoose.Schema(
  {
    lease: { type: mongoose.Schema.Types.ObjectId, ref: "Lease", required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ["agreement", "addendum", "other"], default: "agreement" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LeaseDocument", leaseDocumentSchema);
