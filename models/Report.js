const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetRental: { type: mongoose.Schema.Types.ObjectId, ref: "Rental" },
  reason: { type: String, required: true },
  status: { type: String, enum: ["pending", "resolved"], default: "pending" }
}, { timestamps: true });

// Populate reporter & target
reportSchema.pre(/^find/, function (next) {
  this.populate("reporter", "fullName role")
      .populate("targetUser", "fullName role")
      .populate("targetRental", "title address price");
  next();
});

module.exports = mongoose.model("Report", reportSchema);
