const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { addTransaction, getTransactions } = require("../controllers/accountingController");

// Add transaction (admin only)
router.post("/", protect, admin, addTransaction);

// Get all transactions (admin only)
router.get("/", protect, admin, getTransactions);

module.exports = router;
