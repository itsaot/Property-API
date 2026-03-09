const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

// Protected routes
router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

// Admin or system events can trigger this
router.post("/create", protect, createNotification);

module.exports = router;
