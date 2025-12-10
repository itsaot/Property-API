const express = require("express");
const router = express.Router();
const {
  getReviewsForUser,
  leaveReview,
  updateReview,
  deleteReview,
  getRentalReviews,
  leaveRentalReview
} = require("../controllers/reviewController");
const { auth } = require("../middleware/auth");

// --------------------
// User reviews (existing)
// --------------------
router.get("/user/:userId", getReviewsForUser);
router.post("/:userId", auth, leaveReview);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

// --------------------
// Rental reviews (new)
// --------------------
// Public: fetch all reviews for a rental
router.get("/rental/:rentalId", getRentalReviews);
// Protected: leave a review for a rental
router.post("/rental/:rentalId", auth, leaveRentalReview);

module.exports = router;
