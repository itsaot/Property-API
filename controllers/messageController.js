const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Notification = require("../models/Notification");

// @desc Get all conversations for logged in user
// @route GET /api/messages/conversations
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate("participants", "fullName profilePhoto role")
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get messages in a conversation
// @route GET /api/messages/:conversationId
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate("sender", "fullName profilePhoto role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Send a message
// @route POST /api/messages/:conversationId
exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { conversationId } = req.params;

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text,
    });

    // find conversation + get recipient(s)
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ message: "Conversation not found" });

    // recipients = everyone except sender
    const recipients = conversation.participants.filter(
      (p) => p.toString() !== req.user._id.toString()
    );

    // 🔔 create notifications for recipients
    for (let recipient of recipients) {
      await Notification.create({
        user: recipient,
        type: "message",
        message: `${req.user.fullName} sent you a new message`,
      });
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Start a new conversation
// @route POST /api/messages/start/:userId
exports.startConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    // check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, userId],
      });
    }

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
