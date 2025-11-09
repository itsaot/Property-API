const User = require("../models/User");
const Review = require("../models/Review");
const Rental = require("../models/Rental");
const Notification = require("../models/Notification");

// @desc Get all reviews flagged by users (if you implement flags later)
// @route GET /api/admin/flags
// Currently returns empty array since no Flag model exists
exports.getFlaggedContent = async (req, res) => {
  try {
    res.json([]); // placeholder until you implement flags
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Suspend or warn a user
// @route PATCH /api/admin/users/:id
exports.updateUserStatus = async (req, res) => {
  try {
    const { action, reason } = req.body; // action: suspend | warn

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "suspend") user.status = "suspended";
    if (action === "warn") user.status = "warned";

    await user.save();

    // Notify the user
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

// @desc Delete a review
// @route DELETE /api/admin/content/review/:id
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

// @desc Get platform analytics (users, reviews, rentals)
// @route GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalRentals = await Rental.countDocuments();

    res.json({
      totalUsers,
      totalReviews,
      totalRentals,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get all rentals (admin view)
// @route GET /api/admin/rentals
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate("owner", "fullName email");
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Delete a rental
// @route DELETE /api/admin/rentals/:id
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    await Rental.findByIdAndDelete(req.params.id);

    await Notification.create({
      user: rental.owner,
      fromUser: req.user._id,
      type: "admin",
      message: `Your property listing was removed by an admin.`,
      link: "/account/properties",
    });

    res.json({ message: "Rental deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
