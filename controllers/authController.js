const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// helper: generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Signup user (tenant / landlord)
// @route POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!["tenant", "landlord"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    };

    // Save ID document URL if uploaded
    if (req.file && req.file.path) {
      userData.idDocument = req.file.path; // Cloudinary URL
    }

    const user = await User.create(userData);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        idDocument: user.idDocument || null,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// @desc Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

     // generate JWT
    const token = generateToken(user._id, user.role);

    // set token in cookie
    res.cookie("token", token, {
      httpOnly: true, // prevents client-side JS access
      secure: false,  // set true in production (HTTPS)
      sameSite: "lax", // adjust if cross-site frontend
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
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


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // find user & check password...
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // Store in cookie
  res.cookie("token", token, {
    httpOnly: true,   // prevents JS access
    secure: false,    // set true in production (HTTPS only)
    sameSite: "lax"   // adjust if using cross-site frontend
  });

  res.json({ message: "Login successful", user });
};
