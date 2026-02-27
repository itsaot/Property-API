const CreditCheck = require("../models/CreditCheck");
const BackgroundCheck = require("../models/BackgroundCheck");
const asyncHandler = require("express-async-handler");

// @desc    Run a credit check
// @route   POST /api/checks/credit
// @access  Admin
const runCreditCheck = asyncHandler(async (req, res) => {
  const { tenantId, score } = req.body;

  if (!tenantId || !score) {
    res.status(400);
    throw new Error("Tenant ID and score are required");
  }

  const check = await CreditCheck.create({
    tenant: tenantId,
    score,
  });

  res.status(201).json(check);
});

// @desc    Run a background check
// @route   POST /api/checks/background
// @access  Admin
const runBackgroundCheck = asyncHandler(async (req, res) => {
  const { tenantId, passed, notes } = req.body;

  if (!tenantId || passed === undefined) {
    res.status(400);
    throw new Error("Tenant ID and result are required");
  }

  const check = await BackgroundCheck.create({
    tenant: tenantId,
    passed,
    notes: notes || "",
  });

  res.status(201).json(check);
});

// @desc    Get checks for a tenant
// @route   GET /api/checks/:tenantId
// @access  Admin/Tenant
const getChecks = asyncHandler(async (req, res) => {
  const tenantId = req.params.tenantId;
  if (!tenantId) {
    res.status(400);
    throw new Error("Tenant ID required");
  }

  const credit = await CreditCheck.find({ tenant: tenantId });
  const background = await BackgroundCheck.find({ tenant: tenantId });

  res.json({ credit, background });
});

module.exports = {
  runCreditCheck,
  runBackgroundCheck,
  getChecks,
};
