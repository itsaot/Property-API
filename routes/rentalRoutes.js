const express = require("express");
const router = express.Router();
const {
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
router.get("/public", getPublicRentals);

// ----------------------
// PROTECTED ROUTES
// ----------------------
router.get("/my", auth, getMyRentals);
router.get("/search", auth, searchRentals);
router.get("/:id", auth, getRentalById);

router.post("/", auth, createRental);
router.put("/:id", auth, updateRental);
router.delete("/:id", auth, deleteRental);

module.exports = router;
