const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Authenticate user with JWT
exports.auth = async (req, res, next) => {
  let token;

  console.log("[AUTH] Authorization header:", req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1].trim();
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[AUTH] Token verified successfully:", decoded);

    // Attach user to request (excluding password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("[AUTH] Token verification failed:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ Check if authenticated user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    console.warn("[ADMIN CHECK] No authenticated user found");
    return res.status(401).json({ message: "Not authenticated" });
  }

  if (req.user.role !== "admin") {
    console.warn(`[ADMIN CHECK] Access denied. User role: ${req.user.role}`);
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  console.log(`[ADMIN CHECK] Access granted to admin: ${req.user.email}`);
  next();
};
