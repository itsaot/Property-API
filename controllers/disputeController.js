const Dispute = require("../models/Dispute");
const asyncHandler = require("express-async-handler");

// @desc    Create a new dispute
// @route   POST /api/disputes
// @access  Tenant
const createDispute = asyncHandler(async (req, res) => {
  const { subject, description, attachments } = req.body;

  if (!subject || !description) {
    res.status(400);
    throw new Error("Subject and description are required");
  }

  const dispute = await Dispute.create({
    tenant: req.user._id,
    subject,
    description,
    attachments: attachments || [],
    status: "open",
  });

  res.status(201).json(dispute);
});

// @desc    Get all disputes for a user (tenant/admin)
// @route   GET /api/disputes
// @access  Authenticated
const getDisputes = asyncHandler(async (req, res) => {
  const filter = req.user.role === "tenant" ? { tenant: req.user._id } : {};
  const disputes = await Dispute.find(filter)
    .populate("tenant", "name email")
    .sort({ createdAt: -1 });

  res.json(disputes);
});

// @desc    Update dispute status (open, resolved, rejected)
// @route   PATCH /api/disputes/:id/status
// @access  Admin/Staff
const updateDisputeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const dispute = await Dispute.findById(req.params.id);

  if (!dispute) {
    res.status(404);
    throw new Error("Dispute not found");
  }

  if (!["open", "resolved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  dispute.status = status;
  await dispute.save();

  res.json(dispute);
});

module.exports = {
  createDispute,
  getDisputes,
  updateDisputeStatus,
};
