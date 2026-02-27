require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");

// Middleware
const errorHandler = require("./middleware/errorHandler");
const { protect, admin, hasSubscription } = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/payment");
const reviewRoutes = require("./routes/reviewRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://preview--rental-realm-link.lovable.app",
  "https://rental-realm-link.lovable.app",
  "https://preview--ramshelf-property-hub.lovable.app",
  "https://ramshelf.vercel.app",
  "https://lovable.dev/projects/ac36ae5a-ab30-46d1-a46b-89973a406b9a",
  "https://preview--rentel-hub-finder.lovable.app/"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options("*", cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`🟨 [REQUEST] ${req.method} ${req.originalUrl} from ${req.headers.origin || "unknown origin"}`);
  next();
});

// Public Routes (no auth required)
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Protected Routes (auth required)
app.use("/api/users", protect, userRoutes);
app.use("/api/reviews", protect, reviewRoutes);
app.use("/api/messages", protect, messageRoutes);
app.use("/api/notifications", protect, notificationRoutes);
app.use("/api/rentals", protect, rentalRoutes);

// Subscription-only routes (example: premium features)
app.use("/api/premium", protect, hasSubscription, require("./routes/premiumRoutes"));

// Admin-only routes
app.use("/api/admin", protect, admin, adminRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
