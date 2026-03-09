const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages, // ✅ updated
  sendMessage,
  startConversation,
} = require("../controllers/messageController");
const { protect } = require("../middleware/auth");

// all protected
router.get("/conversations", protect, getConversations);
router.get("/:conversationId", protect, getMessages); // ✅ updated
router.post("/:conversationId", protect, sendMessage);
router.post("/start/:userId", protect, startConversation);

module.exports = router;
