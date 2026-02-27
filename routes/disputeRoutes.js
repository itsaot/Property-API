const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createDispute,
  getDisputes,
  updateDisputeStatus,
} = require("../controllers/disputeController");

// Create a new dispute (tenant only)
router.post("/", protect, createDispute);

// Get disputes (tenant sees own, admin sees all)
router.get("/", protect, getDisputes);

// Update dispute status (admin only)
router.patch("/:id/status", protect, admin, updateDisputeStatus);

module.exports = router;
