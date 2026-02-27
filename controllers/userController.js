const Lease = require("../models/Lease");
const Payment = require("../models/Payment");

// Middleware: Ensure user has subscription before premium actions
exports.ensureSubscription = async (req, res, next) => {
  const active = await exports.hasActiveSubscription(req.user.id);
  if (!active) return res.status(403).json({ message: "Subscription required to access this feature" });
  next();
};

// Create a new lease (tenant + property)
exports.createLease = async (req, res) => {
  try {
    const { property, startDate, endDate, rentAmount } = req.body;

    const lease = await Lease.create({
      tenant: req.user.id,
      property,
      startDate,
      endDate,
      rentAmount,
      documents: [],
    });

    res.status(201).json({ message: "Lease created", lease });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload a lease document (e.g., digital lease agreement)
exports.uploadLeaseDocument = async (req, res) => {
  try {
    const { leaseId, name, url } = req.body;

    const lease = await Lease.findById(leaseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    lease.documents.push({ name, url });
    await lease.save();

    res.status(200).json({ message: "Document uploaded", lease });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Sign a lease document
exports.signLeaseDocument = async (req, res) => {
  try {
    const { leaseId, documentId } = req.body;

    const lease = await Lease.findById(leaseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    const doc = lease.documents.id(documentId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.signed = true;
    await lease.save();

    res.status(200).json({ message: "Document signed", lease });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Pay rent / deposit
exports.payRent = async (req, res) => {
  try {
    const { leaseId, amount, paymentMethod } = req.body;

    const lease = await Lease.findById(leaseId);
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    const payment = await Payment.create({
      user: req.user.id,
      lease: lease._id,
      amount,
      paymentMethod,
      status: "completed", // In production, integrate gateway
    });

    res.status(200).json({ message: "Rent paid successfully", payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
