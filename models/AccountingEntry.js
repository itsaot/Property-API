const mongoose = require("mongoose");

const accountingEntrySchema = new mongoose.Schema(
  {
    rental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental" },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String },
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountingEntry", accountingEntrySchema);
