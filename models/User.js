const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["tenant", "landlord", "admin"],
    required: true,
  },
  fullName: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },

  profilePhoto: { type: String }, // Cloudinary URL
  idDocument: { type: String },   // Verification

  bio: { type: String },

  // landlord properties
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rental" }],

  // tenant rental history
  rentalHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rental" }],

  // reviews received
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

  riskRating: { type: Number, default: 0 }, // avg from reviews

  isSuspended: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },

  settings: {
    privacy: { type: String, enum: ["public", "private"], default: "public" },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  }
}, { timestamps: true });

// Virtual: number of properties (for landlords)
userSchema.virtual("propertyCount").get(function () {
  return this.properties ? this.properties.length : 0;
});

// Virtual: number of reviews
userSchema.virtual("reviewCount").get(function () {
  return this.reviews ? this.reviews.length : 0;
});

// Middleware: recalc risk rating before save
userSchema.pre("save", async function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const Review = mongoose.model("Review");
    const reviews = await Review.find({ reviewee: this._id });
    if (reviews.length > 0) {
      this.riskRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
