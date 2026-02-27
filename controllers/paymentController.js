const Payment = require("../models/Payment");
const asyncHandler = require("express-async-handler");

// @desc    Make a rent payment
// @route   POST /api/payments
// @access  Tenant
const makePayment = asyncHandler(async (req, res) => {
  const { amount, paymentMethod, reference } = req.body;

  if (!amount || !paymentMethod) {
    res.status(400);
    throw new Error("Amount and payment method are required");
  }

  const payment = await Payment.create({
    tenant: req.user._id,
    amount,
    paymentMethod,
    reference: reference || null,
    status: "completed",
  });

  res.status(201).json(payment);
});

// @desc    Get all payments for a tenant
// @route   GET /api/payments
// @access  Tenant/Admin
const getPayments = asyncHandler(async (req, res) => {
  const filter = req.user.role === "tenant" ? { tenant: req.user._id } : {};
  const payments = await Payment.find(filter)
    .populate("tenant", "name email")
    .sort({ createdAt: -1 });

  res.json(payments);
});

module.exports = {
  makePayment,
  getPayments,
};
