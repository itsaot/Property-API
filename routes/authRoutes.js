const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUpload"); // Cloudinary/multer setup
const { protect } = require("../middleware/auth");

const protectController = require("../controllers/authController");

// protect routes
router.post("/signup", upload.single("idDocument"), protectController.signup);
router.post("/login", protectController.login);
router.post("/logout", protect, protectController.logout);
router.get("/me", protect, protectController.getMe);
router.put("/setup", protect, protectController.profileSetup);
router.post("/forgot-password", protectController.forgotPassword);
router.post("/reset-password/:token", protectController.resetPassword);

// Admin route
router.post("/admin/login", protectController.adminLogin);

module.exports = router;