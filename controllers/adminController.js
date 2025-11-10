const User = require("../models/User");
const Review = require("../models/Review");
const Rental = require("../models/Rental"); // <-- your property listings model
const Notification = require("../models/Notification");

// ✅ Get all flagged content
exports.getFlaggedContent = async (req, res) => {
  try {
    const flags = await Review.find({ flagged: true })
      .populate("reviewer", "fullName email")
      .sort({ createdAt: -1 });
    res.json(flags);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Suspend or warn a user
exports.updateUserStatus = async (req, res) => {
  try {
    const { action, reason } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "suspend") user.status = "suspended";
    if (action === "warn") user.status = "warned";
    await user.save();

    await Notification.create({
      user: user._id,
      fromUser: req.user._id,
      type: "admin",
      message: `Admin action: ${action}. Reason: ${reason || "N/A"}`,
      link: "/account/settings",
    });

    res.json({ message: `User ${action} successfully`, user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete review
exports.deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (type !== "review") {
      return res.status(400).json({ message: "Invalid content type" });
    }

    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const ownerId = review.reviewee;
    await Review.findByIdAndDelete(id);

    await Notification.create({
      user: ownerId,
      fromUser: req.user._id,
      type: "admin",
      message: `Your review was removed by an admin.`,
      link: `/account/reviews`,
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRentals = await Rental.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.json({
      totalUsers,
      totalRentals,
      totalReviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get all rentals
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete rental
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    await rental.deleteOne();
    res.json({ message: "Rental deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
