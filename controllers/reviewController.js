const Review = require("../models/Review");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc Get all reviews for a user
// @route GET /api/reviews/user/:userId
exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate("reviewer", "fullName profilePhoto role")
      .populate("reviewedUser", "fullName profilePhoto role");

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Leave a review for a user
// @route POST /api/reviews/:userId
exports.leaveReview = async (req, res) => {
  try {
    const { reviewee, rating, text, riskFlag } = req.body;

    if (!reviewee || !rating) {
      return res.status(400).json({ message: "Reviewee and rating are required" });
    }

    // ✅ Create review
    const review = await Review.create({
      reviewer: req.user._id,
      reviewee,
      rating,
      text,
      riskFlag,
    });

    // 🔔 Create notification for reviewee
    await Notification.create({
      user: reviewee,
      fromUser: req.user._id,
      type: "review",
      message: `You received a new review from ${req.user.fullName}`,
      link: `/reviews/${review._id}`,
    });

    // ✅ Update user's risk rating average (optional improvement)
    const reviews = await Review.find({ reviewee });
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(reviewee, { riskRating: avgRating });

    res.status(201).json({ message: "Review created", data: review });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get reviews for a user
// @route GET /api/reviews/:userId
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate("reviewer", "fullName profilePhoto role")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update a review
// @route PUT /api/reviews/:id
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    const { rating, text, riskFlag } = req.body;

    review.rating = rating ?? review.rating;
    review.text = text ?? review.text;
    review.riskFlag = riskFlag ?? review.riskFlag;

    await review.save();

    res.json({ message: "Review updated successfully", review });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Delete a review
// @route DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    // pull from reviewed user's history
    await User.findByIdAndUpdate(review.reviewedUser, {
      $pull: { reviews: review._id },
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
