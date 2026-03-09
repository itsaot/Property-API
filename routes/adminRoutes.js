const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

// ---------------------------
// Users
// ---------------------------
router.get("/users", protect, admin, adminController.getAllUsers);
router.patch("/users/:id", protect, admin, adminController.updateUserStatus);

// ---------------------------
// Content / Reviews
// ---------------------------
router.get("/flags", protect, admin, adminController.getFlaggedContent);
router.delete("/content/:type/:id", protect, admin, adminController.deleteContent);

// ---------------------------
// Rentals
// ---------------------------
router.get("/rentals", protect, admin, adminController.getAllRentals);
router.delete("/rentals/:id", protect, admin, adminController.deleteRental);

// ---------------------------
// Analytics
// ---------------------------
router.get("/analytics", protect, admin, adminController.getAnalytics);

module.exports = router;