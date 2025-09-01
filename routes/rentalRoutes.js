const express = require("express");
const router = express.Router();
const {
  getRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental,
} = require("../controllers/rentalController");
const { auth } = require("../middleware/auth");

// public
router.get("/", getRentals);
router.get("/:id", getRentalById);

// protected
router.post("/", auth, createRental);
router.put("/:id", auth, updateRental);
router.delete("/:id", auth, deleteRental);

module.exports = router;
