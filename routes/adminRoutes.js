const express = require("express");
const router = express.Router();
const {
  getFlaggedContent,
  updateUserStatus,
  deleteContent,
  getAnalytics,
  getAllRentals,
  deleteRental,
  getAllUsers, // make sure this exists in adminController
} = require("../controllers/adminController");
const { auth, isAdmin } = require("../middleware/auth");

console.log("Admin controller functions check:");
console.log({
  getFlaggedContent,
  updateUserStatus,
  deleteContent,
  getAnalytics,
  getAllRentals,
  deleteRental,
  getAllUsers,
});

// ---------------------------
// Users
// ---------------------------
// Get all users (for admin dashboard)
router.get("/users", auth, isAdmin, getAllUsers);

// Update user status (suspend/warn)
router.patch("/users/:id", auth, isAdmin, updateUserStatus);

// ---------------------------
// Content / Reviews
// ---------------------------
// Get all flagged content
router.get("/flags", auth, isAdmin, getFlaggedContent);

// Delete flagged content (e.g., review)
router.delete("/content/:type/:id", auth, isAdmin, deleteContent);

// ---------------------------
// Rentals
// ---------------------------
// Get all rentals
router.get("/rentals", auth, isAdmin, getAllRentals);

// Delete a rental
router.delete("/rentals/:id", auth, isAdmin, deleteRental);

// ---------------------------
// Analytics
// ---------------------------
router.get("/analytics", auth, isAdmin, getAnalytics);

module.exports = router;
