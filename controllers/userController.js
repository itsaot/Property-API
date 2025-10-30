const User = require("../models/User");

// @desc Get user profile by ID
// @route GET /api/users/:id
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("properties", "title price address")
      .populate("rentalHistory", "title price address")
      .populate("reviews");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update profile
// @route PUT /api/users/:id
exports.updateProfile = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }

    const { fullName, bio, profilePhoto, settings } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = fullName || user.fullName;
    user.bio = bio || user.bio;
    user.profilePhoto = profilePhoto || user.profilePhoto;
    if (settings) {
      user.settings = { ...user.settings, ...settings };
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Search users (landlords or tenants)
// @route GET /api/users/search?q=
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    const users = await User.find({
      fullName: { $regex: q, $options: "i" },
    }).select("fullName role profilePhoto riskRating");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update privacy/block settings
// @route PUT /api/users/:id/settings
exports.updateSettings = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { privacy, blockedUsers } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (privacy) user.settings.privacy = privacy;
    if (blockedUsers) user.settings.blockedUsers = blockedUsers;

    await user.save();

    res.json({ message: "Settings updated", settings: user.settings });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Cloudinary multer storage returns the file URL in req.file.path
    const imageUrl = req.file.path;

    // Update the user's profilePhoto
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePhoto = imageUrl;
    await user.save();

    res.status(200).json({ message: "Profile picture uploaded successfully", url: imageUrl });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};