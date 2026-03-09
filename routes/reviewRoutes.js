const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");

// ✅ User reviews
router.get("/user/:userId", protect, reviewController.getReviewsForUser);
router.get("/:userId", protect, reviewController.getUserReviews);
router.post("/:userId", protect, reviewController.leaveReview);
router.put("/:id", protect, reviewController.updateReview);
router.delete("/:id", protect, reviewController.deleteReview);

// ✅ Rental reviews
router.get("/rental/:rentalId", protect, reviewController.getRentalReviews);
router.post("/rental/:rentalId", protect, reviewController.leaveRentalReview);

module.exports = router;