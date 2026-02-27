const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription" },
  lease: { type: mongoose.Schema.Types.ObjectId, ref: "Lease" }, // optional for rent payments
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  paymentMethod: { type: String },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
