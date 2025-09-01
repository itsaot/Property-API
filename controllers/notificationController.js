const Notification = require("../models/Notification");

// @desc Get all notifications for logged in user
// @route GET /api/notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("fromUser", "fullName profilePhoto role")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Mark a notification as read
// @route PATCH /api/notifications/:id/read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true }, // ✅ fixed: match schema
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Delete a notification
// @route DELETE /api/notifications/:id
exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Create a notification (can also be used internally by other controllers)
// @route POST /api/notifications/create
exports.createNotification = async (req, res) => {
  try {
    const { user, fromUser, type, message, link } = req.body;

    const notification = await Notification.create({
      user,
      fromUser,
      type,
      message,
      link,
    });

    res.status(201).json({ message: "Notification created", notification });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
