const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  // Log the full headers for debugging
  console.log('🔑 Incoming headers:', req.headers);

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    console.log('✅ Token extracted from header:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️ No Bearer token found in Authorization header');
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    console.log('✅ Token verified. User ID:', decoded.id);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).json({ message: 'Token failed' });
  }
};


exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};


exports.auth = (req, res, next) => {
  const token = req.cookies.token; // 👈 get token from cookies
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
