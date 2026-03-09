const express = require("express");
const router = express.Router();
const { protect, hasSubscription } = require("../middleware/auth");
const {
  createLease,
  uploadLeaseDocument,
  signLeaseDocument,
  payRent,
} = require("../controllers/userController"); // Your premium controller functions
const upload = require("../utils/fileUpload"); // For file uploads

// ---------------------------
// PREMIUM ROUTES
// ---------------------------

// Create a new lease (tenant + property)
router.post("/lease", protect, hasSubscription, createLease);

// Upload a lease document (e.g., signed agreement)
router.post(
  "/lease/upload-document",
  protect,
  hasSubscription,
  upload.single("document"),
  uploadLeaseDocument
);

// Sign a lease document
router.post("/lease/sign", protect, hasSubscription, signLeaseDocument);

// Pay rent or deposit
router.post("/lease/pay", protect, hasSubscription, payRent);

module.exports = router;