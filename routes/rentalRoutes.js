const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const rentalController = require("../controllers/rentalController");

// ----------------------
// PUBLIC ROUTES
// ----------------------
router.get("/public", rentalController.getPublicRentals); // GET /api/rentals/public

// ----------------------
// PROTECTED ROUTES
// ----------------------
router.get("/", protect, rentalController.getRentals); // GET /api/rentals
router.get("/my", protect, rentalController.getMyRentals); // GET /api/rentals/my
router.get("/:id", protect, rentalController.getRentalById);

// Landlord-only
router.post("/", protect, rentalController.createRental);
router.put("/:id", protect, rentalController.updateRental);
router.delete("/:id", protect, rentalController.deleteRental);

// Search (landlord-only)
router.get("/search", protect, rentalController.searchRentals);

module.exports = router;