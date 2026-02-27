const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
  runCreditCheck,
  runBackgroundCheck,
  getChecks,
} = require("../controllers/checksController");

// Run credit check (admin only)
router.post("/credit", protect, admin, runCreditCheck);

// Run background check (admin only)
router.post("/background", protect, admin, runBackgroundCheck);

// Get checks for a tenant (tenant sees own, admin sees all)
router.get("/:tenantId", protect, getChecks);

module.exports = router;
