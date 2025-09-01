const Rental = require("../models/Rental");
const User = require("../models/User");

// @desc Get all rentals
// @route GET /api/rentals
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("landlord", "fullName profilePhoto")
      .populate("tenants", "fullName profilePhoto");

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Get single rental by ID
// @route GET /api/rentals/:id
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("landlord", "fullName profilePhoto")
      .populate("tenants", "fullName profilePhoto");

    if (!rental) return res.status(404).json({ message: "Rental not found" });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Create a new rental (landlords only)
// @route POST /api/rentals
exports.createRental = async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can add rentals" });
    }

    const { title, description, address, price, images } = req.body;

    const rental = await Rental.create({
      landlord: req.user._id,
      title,
      description,
      address,
      price,
      images,
    });

    // push rental to landlord's property list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { properties: rental._id },
    });

    res.status(201).json({ message: "Rental created successfully", rental });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Update rental
// @route PUT /api/rentals/:id
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this rental" });
    }

    const { title, description, address, price, available, images } = req.body;

    rental.title = title || rental.title;
    rental.description = description || rental.description;
    rental.address = address || rental.address;
    rental.price = price || rental.price;
    rental.available = available ?? rental.available;
    rental.images = images || rental.images;

    await rental.save();

    res.json({ message: "Rental updated successfully", rental });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Delete rental
// @route DELETE /api/rentals/:id
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this rental" });
    }

    await rental.deleteOne();

    // remove rental from landlord properties
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { properties: rental._id },
    });

    res.json({ message: "Rental deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
