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
const { auth } = require("../middleware/auth");

// ----------------------
// PUBLIC ROUTES
// ----------------------
router.get("/public", getPublicRentals); // public homepage listings

// ----------------------
// PROTECTED ROUTES
// ----------------------
// Get all rentals visible to logged-in user
router.get("/", auth, getRentals);

// Get rentals owned by logged-in landlord
router.get("/my", auth, getMyRentals);

// Search ONLY in landlord's own rentals
router.get("/search", auth, searchRentals);

// Get a single rental by ID (only landlord, tenant, or admin)
router.get("/:id", auth, getRentalById);

// Create, Update, Delete rentals (landlord only)
router.post("/", auth, createRental);
router.put("/:id", auth, updateRental);
router.delete("/:id", auth, deleteRental);

module.exports = router;
