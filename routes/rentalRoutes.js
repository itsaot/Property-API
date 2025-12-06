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
router.get("/", auth, getRentals);        // all visible rentals for logged-in user
router.get("/my", auth, getMyRentals);    // landlord's own rentals
router.get("/search", auth, searchRentals); // landlord search

router.get("/:id", auth, getRentalById); // single rental (only landlord/tenant/admin)

// CRUD routes
router.post("/", auth, createRental);
router.put("/:id", auth, updateRental);
router.delete("/:id", auth, deleteRental);

module.exports = router;
