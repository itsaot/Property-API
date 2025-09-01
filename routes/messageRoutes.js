const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages, // ✅ updated
  sendMessage,
  startConversation,
} = require("../controllers/messageController");
const { auth } = require("../middleware/auth");

// all protected
router.get("/conversations", auth, getConversations);
router.get("/:conversationId", auth, getMessages); // ✅ updated
router.post("/:conversationId", auth, sendMessage);
router.post("/start/:userId", auth, startConversation);

module.exports = router;
