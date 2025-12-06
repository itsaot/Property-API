const Rental = require("../models/Rental");
const User = require("../models/User");

// ----------------------
// PUBLIC LISTINGS
// ----------------------
exports.getPublicRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ available: true })
      .populate("landlord", "fullName profilePhoto");

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------------
// LANDLORD PRIVATE LISTINGS
// ----------------------
exports.getMyRentals = async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can view their rentals" });
    }

    const rentals = await Rental.find({ landlord: req.user._id })
      .populate("tenants", "fullName profilePhoto")
      .populate("landlord", "fullName profilePhoto");

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------------
// ALL RENTALS (protected)
// ----------------------
exports.getRentals = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === "landlord") {
      filter.landlord = req.user._id; // only own rentals
    }

    if (req.user.role === "tenant") {
      filter.available = true; // tenants see only available rentals
    }

    // Admin sees everything (no filter)

    const rentals = await Rental.find(filter)
      .populate("landlord", "fullName profilePhoto")
      .populate("tenants", "fullName profilePhoto");

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// ----------------------
// SEARCH (LANDLORD-ONLY)
// ----------------------
exports.searchRentals = async (req, res) => {
  try {
    const q = req.query.q || "";

    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can search their rentals" });
    }

    const rentals = await Rental.find({
      landlord: req.user._id,
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { address: { $regex: q, $options: "i" } }
      ]
    }).populate("landlord", "fullName profilePhoto");

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------------
// GET SINGLE RENTAL
// ----------------------
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("landlord", "fullName profilePhoto")
      .populate("tenants", "fullName profilePhoto");

    if (!rental) return res.status(404).json({ message: "Rental not found" });

    const userId = req.user.id;
    const isLandlord = rental.landlord._id.toString() === userId;
    const isTenant = rental.tenants.map(t => t._id.toString()).includes(userId);
    const isAdmin = req.user.role === "admin";

    if (!isLandlord && !isTenant && !isAdmin) {
      return res.status(403).json({ message: "Not allowed to view this rental" });
    }

    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------------
// CREATE RENTAL
// ----------------------
exports.createRental = async (req, res) => {
  try {
    if (req.user.role !== "landlord") {
      return res.status(403).json({ message: "Only landlords can add rentals" });
    }

    const {
      title,
      description,
      address,
      price,
      images,
      mapUrl,
      bedrooms,
      bathrooms,
      garageSpaces,
      parkingSpaces,
      furnished,
      petFriendly,
      available 
    } = req.body;

    const rental = await Rental.create({
      landlord: req.user._id,
      title,
      description,
      address,
      price,
      images,
      mapUrl,
      bedrooms,
      bathrooms,
      garageSpaces,
      parkingSpaces,
      furnished,
      petFriendly,
      available: available ?? true
    });

    // push rental to landlord's property list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { properties: rental._id },
    });

    res.status(201).json({ message: "Rental created successfully", rental });
  } catch (err) {
    console.error("Create Rental Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------------
// UPDATE RENTAL
// ----------------------
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this rental" });
    }

    const {
      title,
      description,
      address,
      price,
      available,
      images,
      mapUrl,
      bedrooms,
      bathrooms,
      garageSpaces,
      parkingSpaces,
      furnished,
      petFriendly
    } = req.body;

    rental.title = title || rental.title;
    rental.description = description || rental.description;
    rental.address = address || rental.address;
    rental.price = price || rental.price;
    rental.available = available ?? rental.available;
    rental.images = images || rental.images;
    rental.mapUrl = mapUrl || rental.mapUrl;
    rental.bedrooms = bedrooms ?? rental.bedrooms;
    rental.bathrooms = bathrooms ?? rental.bathrooms;
    rental.garageSpaces = garageSpaces ?? rental.garageSpaces;
    rental.parkingSpaces = parkingSpaces ?? rental.parkingSpaces;
    rental.furnished = furnished ?? rental.furnished;
    rental.petFriendly = petFriendly ?? rental.petFriendly;

    await rental.save();

    res.json({ message: "Rental updated successfully", rental });
  } catch (err) {
    console.error("Update Rental Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ----------------------
// DELETE RENTAL
// ----------------------
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.landlord.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this rental" });
    }

    await rental.deleteOne();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { properties: rental._id },
    });

    res.json({ message: "Rental deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
