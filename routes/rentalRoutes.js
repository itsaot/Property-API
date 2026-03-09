const express = require("express");
const router = express.Router();
const {
  getRentals,
  getPublicRentals,
  getMyRentals,
  searchRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental
} = require("../controllers/rentalController");
const { protect } = require("../middleware/auth");

// ----------------------
// PUBLIC ROUTES
// ----------------------
router.get("/public", getPublicRentals); // public homepage listings

// ----------------------
// PROTECTED ROUTES
// ----------------------
router.get("/", protect, getRentals);        // all visible rentals for logged-in user
router.get("/my", protect, getMyRentals);    // landlord's own rentals
router.get("/search", protect, searchRentals); // landlord search

router.get("/:id", protect, getRentalById); // single rental (only landlord/tenant/admin)

// CRUD routes
router.post("/", protect, createRental);
router.put("/:id", protect, updateRental);
router.delete("/:id", protect, deleteRental);

module.exports = router;
