const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
require("dotenv").config();

// Import routes
const paymentRoutes = require("./routes/payment");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rentalRoutes = require("./routes/rentalRoutes"); // rental listings
const allowedOrigins = [
  "http://localhost:3000",
  "https://preview--rental-realm-link.lovable.app",
  "https://rental-realm-link.lovable.app",
  "https://preview--ramshelf-property-hub.lovable.app",
  "https://ramshelf.vercel.app",
  "https://lovable.dev/projects/ac36ae5a-ab30-46d1-a46b-89973a406b9a"// optional: if your main site uses this domain
];

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const cors = require("cors");

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});



// Routes
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/rentals", rentalRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
