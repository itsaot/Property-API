const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { makePayment, getPayments } = require("../controllers/paymentController");

// Make a payment (tenant only)
router.post("/", protect, makePayment);

// Get payments (tenant sees own, admin sees all)
router.get("/", protect, getPayments);

module.exports = router;
