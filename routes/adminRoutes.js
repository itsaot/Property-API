const express = require("express");
const router = express.Router();
const {
  getFlaggedContent,
  updateUserStatus,
  deleteContent,
  getAnalytics,
  getAllRentals,
  deleteRental,
} = require("../controllers/adminController");
const { auth, isAdmin } = require("../middleware/auth");

// Protected admin routes
router.get("/flags", auth, isAdmin, getFlaggedContent);
router.patch("/users/:id", auth, isAdmin, updateUserStatus);
router.delete("/content/:type/:id", auth, isAdmin, deleteContent);
router.get("/analytics", auth, isAdmin, getAnalytics);

// Rentals management
router.get("/rentals", auth, isAdmin, getAllRentals);
router.delete("/rentals/:id", auth, isAdmin, deleteRental);

module.exports = router;
