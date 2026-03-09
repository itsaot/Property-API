const express = require("express");
const router = express.Router();
const { protect, hasSubscription } = require("../middleware/auth");
const rentalController = require("../controllers/rentalController");

// ----------------------
// PREMIUM RENTALS ROUTES
// ----------------------

// Example: Get all available premium rentals
router.get("/rentals/premium", protect, hasSubscription, rentalController.getPublicRentals);

// Example: Premium search (only for subscribed tenants)
router.get("/rentals/premium/search", protect, hasSubscription, rentalController.searchRentals);

// Example: Get single premium rental (protected)
router.get("/rentals/premium/:id", protect, hasSubscription, rentalController.getRentalById);

// Example: Create a rental (if your premium feature allows landlords to create exclusive listings)
router.post("/rentals/premium", protect, hasSubscription, rentalController.createRental);

// Example: Update a premium rental
router.put("/rentals/premium/:id", protect, hasSubscription, rentalController.updateRental);

// Example: Delete a premium rental
router.delete("/rentals/premium/:id", protect, hasSubscription, rentalController.deleteRental);

module.exports = router;