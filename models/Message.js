const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-populate sender and receiver details
messageSchema.pre(/^find/, function (next) {
  this.populate("sender", "fullName profilePhoto role")
      .populate("receiver", "fullName profilePhoto role");
  next();
});

module.exports = mongoose.model("Message", messageSchema);
