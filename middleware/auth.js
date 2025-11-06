const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  let token;

  console.log('[AUTH] Incoming request headers:', req.headers);

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('[AUTH] Token extracted from header:', token.substring(0, 20) + '...');
  }

  if (!token) {
    console.warn('[AUTH] ❌ No token provided in Authorization header');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[AUTH] Token successfully verified, user ID:', decoded.id);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.warn('[AUTH] ❌ User not found for decoded token');
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error('[AUTH] Token verification failed:', err.message);
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
