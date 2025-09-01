const express = require("express");
const router = express.Router();
const {
  getReviewsForUser,
  leaveReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { auth } = require("../middleware/auth");

// public
router.get("/user/:userId", getReviewsForUser);

// protected
router.post("/:userId", auth, leaveReview);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;
