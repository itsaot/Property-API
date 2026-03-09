const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUpload"); // profile picture
const { protect } = require("../middleware/auth");

const authController = require("../controllers/authController");

// Profile routes
router.get("/me", protect, authController.getMe);
router.put("/setup", protect, authController.profileSetup);
router.post("/upload-profile", protect, upload.single("image"), authController.profileSetup); // or a separate handler if you want

module.exports = router;