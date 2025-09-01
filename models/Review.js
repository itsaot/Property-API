const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  riskFlag: { type: Boolean, default: false }
}, { timestamps: true });

// Populate reviewer & reviewee by default
reviewSchema.pre(/^find/, function (next) {
  this.populate("reviewer", "fullName role profilePhoto")
      .populate("reviewee", "fullName role profilePhoto");
  next();
});

module.exports = mongoose.model("Review", reviewSchema);
