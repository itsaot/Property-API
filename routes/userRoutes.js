const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { getUserProfile, uploadProfilePicture, updateProfile, searchUsers, updateSettings } = require("../controllers/userController");
const { auth } = require("../middleware/auth");

router.get("/search", auth, searchUsers);
router.get("/:id", auth, getUserProfile);
router.put("/:id", auth, updateProfile);
router.put("/:id/settings", auth, updateSettings);
router.post("/upload-profile", upload.single("image"), uploadProfilePicture);

module.exports = router;
