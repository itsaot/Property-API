const express = require("express");
const router = express.Router();
const { signup, login, getMe, profileSetup } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/setup", auth, profileSetup);

module.exports = router;
