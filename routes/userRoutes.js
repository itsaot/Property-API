const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { getUserProfile, uploadProfilePicture, updateProfile, searchUsers, updateSettings } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateProfile);
router.put("/:id/settings", protect, updateSettings);
router.post("/upload-profile", upload.single("image"), uploadProfilePicture);

module.exports = router;
