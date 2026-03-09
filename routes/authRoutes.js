const express = require("express");
const router = express.Router();
const upload = require("../utils/fileUpload"); // Cloudinary/multer setup
const { protect } = require("../middleware/auth");

const authController = require("../controllers/authController");

// Auth routes
router.post("/signup", upload.single("idDocument"), authController.signup);
router.post("/login", authController.login);
router.post("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.put("/setup", protect, authController.profileSetup);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Admin route
router.post("/admin/login", authController.adminLogin);

module.exports = router;