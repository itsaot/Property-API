const Accounting = require("../models/Accounting");
const asyncHandler = require("express-async-handler");

// @desc    Record income or expense
// @route   POST /api/accounting
// @access  Admin
const addTransaction = asyncHandler(async (req, res) => {
  const { type, amount, description } = req.body;

  if (!type || !["income", "expense"].includes(type) || !amount) {
    res.status(400);
    throw new Error("Type, amount and description are required");
  }

  const transaction = await Accounting.create({
    type,
    amount,
    description,
  });

  res.status(201).json(transaction);
});

// @desc    Get all transactions
// @route   GET /api/accounting
// @access  Admin
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Accounting.find().sort({ createdAt: -1 });
  res.json(transactions);
});

module.exports = {
  addTransaction,
  getTransactions,
};
