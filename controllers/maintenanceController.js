const MaintenanceRequest = require("../models/MaintenanceRequest");
const asyncHandler = require("express-async-handler");

// @desc    Create a new maintenance request
// @route   POST /api/maintenance
// @access  Tenant (authenticated)
const createRequest = asyncHandler(async (req, res) => {
  const { title, initialMessage, attachments } = req.body;

  if (!title || !initialMessage) {
    res.status(400);
    throw new Error("Title and initial message are required");
  }

  const request = await MaintenanceRequest.create({
    tenant: req.user._id,
    title,
    messages: [
      {
        sender: req.user._id,
        text: initialMessage,
        attachments: attachments || [],
      },
    ],
    status: "open",
  });

  res.status(201).json(request);
});

// @desc    Get all maintenance requests for a user (tenant or staff)
// @route   GET /api/maintenance
// @access  Authenticated
const getRequests = asyncHandler(async (req, res) => {
  const filter = req.user.role === "tenant" ? { tenant: req.user._id } : {};
  const requests = await MaintenanceRequest.find(filter)
    .populate("tenant", "name email")
    .populate("messages.sender", "name email")
    .sort({ createdAt: -1 });

  res.json(requests);
});

// @desc    Add a message to a maintenance request
// @route   POST /api/maintenance/:id/message
// @access  Authenticated (tenant/staff)
const addMessage = asyncHandler(async (req, res) => {
  const { text, attachments } = req.body;
  const request = await MaintenanceRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Maintenance request not found");
  }

  // Only tenant owner or staff can add messages
  if (
    req.user.role === "tenant" &&
    request.tenant.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to message in this request");
  }

  request.messages.push({
    sender: req.user._id,
    text,
    attachments: attachments || [],
  });

  await request.save();

  const updatedRequest = await request
    .populate("messages.sender", "name email")
    .execPopulate();

  res.json(updatedRequest);
});

// @desc    Update request status (open, in-progress, closed)
// @route   PATCH /api/maintenance/:id/status
// @access  Staff or Admin
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const request = await MaintenanceRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Maintenance request not found");
  }

  if (!["open", "in-progress", "closed"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  request.status = status;
  await request.save();

  res.json(request);
});

module.exports = {
  createRequest,
  getRequests,
  addMessage,
  updateStatus,
};
