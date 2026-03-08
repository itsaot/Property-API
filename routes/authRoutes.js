const express = require("express");
const router = express.Router();
const { signup, login, logout, getMe, profileSetup, forgotPassword, resetPassword, adminLogin } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const upload = require("../utils/fileUpload");

const authController = require("../controllers/authController");
console.log("AUTH CONTROLLER:", authController);

router.post("/signup", upload.single("idDocument"), signup);
router.post("/login", login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.put("/setup", protect, profileSetup);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// admin route
router.post("/admin/login", adminLogin);

module.exports = router;