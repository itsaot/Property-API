const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Subscription = require("../models/Subscription"); // Add this

// Protect routes – only authenticated users
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// Admin-only access
exports.admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Subscription check middleware – now checks DB for active subscription
exports.hasSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
      endDate: { $gte: new Date() },
    });

    if (!subscription) {
      return res.status(403).json({
        message: "Active subscription required to access this feature",
      });
    }

    next();
  } catch (err) {
    console.error("❌ Subscription check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};