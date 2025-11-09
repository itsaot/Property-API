const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  let token;

  console.log('[AUTH] Authorization header:', req.headers.authorization);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1].trim();
  }

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] Token verified successfully:', decoded);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error('[AUTH] Token verification failed:', err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
