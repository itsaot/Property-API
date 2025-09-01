const express = require("express");
const router = express.Router();
const {
  getFlaggedContent,
  updateUserStatus,
  deleteContent,
  getAnalytics,
} = require("../controllers/adminController");
const { auth, isAdmin } = require("../middleware/auth");

// Protected admin routes
router.get("/flags", auth, isAdmin, getFlaggedContent);
router.patch("/users/:id", auth, isAdmin, updateUserStatus);
router.delete("/content/:type/:id", auth, isAdmin, deleteContent);
router.get("/analytics", auth, isAdmin, getAnalytics);

module.exports = router;
