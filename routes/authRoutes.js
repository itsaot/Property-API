const express = require("express");
const router = express.Router();
const { signup, login, getMe, profileSetup, forgotPassword, resetPassword } = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const upload = require("../utils/fileUpload");

router.post("/signup", upload.single("idDocument"), signup);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/me", auth, getMe);
router.put("/setup", auth, profileSetup);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
