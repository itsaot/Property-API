const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification,
} = require("../controllers/notificationController");
const { auth } = require("../middleware/auth");

// Protected routes
router.get("/", auth, getNotifications);
router.patch("/:id/read", auth, markAsRead);
router.delete("/:id", auth, deleteNotification);

// Admin or system events can trigger this
router.post("/create", auth, createNotification);

module.exports = router;
