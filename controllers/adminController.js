const User = require("../models/User");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const Post = require("../models/Post"); 
const Flag = require("../models/Flag"); 

// @desc Get all flagged content
// @route GET /api/admin/flags
exports.getFlaggedContent = async (req, res) => {
  try {
    const flags = await Flag.find()
      .populate("reporter", "fullName role")
      .sort({ createdAt: -1 });
    res.json(flags);
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

// @desc Delete any post or review (moderator/admin)
// @route DELETE /api/admin/content/:type/:id
exports.deleteContent = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!["post", "review"].includes(type)) {
      return res.status(400).json({ message: "Invalid content type" });
    }

    let ownerId;

    if (type === "post") {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      ownerId = post.author;
      await Post.findByIdAndDelete(id);
    }

    if (type === "review") {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: "Review not found" });
      ownerId = review.reviewee;
      await Review.findByIdAndDelete(id);
    }

    // 🔔 Notify content owner
    if (ownerId) {
      await Notification.create({
        user: ownerId,
        fromUser: req.user._id,
        type: "admin",
        message: `Your ${type} was removed by an admin.`,
        link: `/account/reviews`,
      });
    }

    res.json({ message: `${type} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// @desc Get basic platform analytics
// @route GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalFlags = await Flag.countDocuments({ resolved: false });

    res.json({
      totalUsers,
      totalPosts,
      totalReviews,
      unresolvedFlags: totalFlags,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
