const express = require("express");
const router = express.Router();
const { signup, login,logout, getMe, profileSetup, forgotPassword, resetPassword, adminLogin } = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const upload = require("../utils/fileUpload");

router.post("/signup", upload.single("idDocument"), signup);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);
router.put("/setup", auth, profileSetup);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// admin route
router.post("/admin/login", adminLogin);

module.exports = router;
