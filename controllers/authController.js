const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../utils/email");


// helper: generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Signup user (tenant / landlord)
// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  console.log("🟦 [SIGNUP] Incoming request...");

  // Log all important incoming data for debugging
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("File received:", req.file ? req.file.originalname : "❌ No file uploaded");

  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
      console.warn("⚠️ Missing required fields:", { fullName, email, phone, password, role });
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["tenant", "landlord"].includes(role)) {
      console.warn("⚠️ Invalid role:", role);
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      console.warn("⚠️ User already exists:", { email, phone });
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      idDocument: req.file ? req.file.path : null, // safely handle file
    };

    const user = await User.create(userData);

    const token = generateToken(user._id, user.role);

    console.log("✅ Signup success for:", user.email);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        idDocument: user.idDocument || null,
      },
      token,
    });
  } catch (err) {
    console.error("❌ [SIGNUP ERROR]:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  console.log("🟨 [LOGIN] Incoming request...");
  console.log("Body:", req.body);

  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      console.warn("⚠️ Missing login fields");
      return res.status(400).json({ message: "Please provide email/phone and password" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      console.warn("⚠️ User not found:", emailOrPhone);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Invalid password for:", emailOrPhone);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log("✅ Login success for:", user.email);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("❌ [LOGIN ERROR]:", err.message);
    console.error(err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      expires: new Date(0), // immediately expire
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get logged in user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("properties", "title price")
      .populate("rentalHistory", "title price");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Profile setup (wizard after signup)
// @route PUT /api/auth/setup
exports.profileSetup = async (req, res) => {
  try {
    const { bio, profilePhoto, idDocument } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.bio = bio || user.bio;
    user.profilePhoto = profilePhoto || user.profilePhoto;
    user.idDocument = idDocument || user.idDocument;
    user.isVerified = true;

    await user.save();

    res.json({ message: "Profile setup complete", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🔹 FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Create reset token (valid for 15 minutes)
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send reset email
    await sendEmail(
      user.email,
      "Password Reset Request",
      `<p>Hello ${user.fullName || "user"},</p>
       <p>You requested a password reset. Click the link below to reset your password:</p>
       <a href="${resetLink}">${resetLink}</a>
       <p>This link will expire in 15 minutes.</p>`
    );

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset email", error: error.message });
  }
};

// 🔹 RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token", error: error.message });
  }
};