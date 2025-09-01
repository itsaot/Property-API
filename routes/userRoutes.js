const express = require("express");
const router = express.Router();
const { getUserProfile, updateProfile, searchUsers, updateSettings } = require("../controllers/userController");
const { auth } = require("../middleware/auth");

router.get("/search", auth, searchUsers);
router.get("/:id", auth, getUserProfile);
router.put("/:id", auth, updateProfile);
router.put("/:id/settings", auth, updateSettings);

module.exports = router;
