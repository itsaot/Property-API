const Payment = require('../models/Payment');
const User = require('../models/User');
const axios = require('axios');
const { sendReceiptEmail } = require('../utils');

// Create a normal/offline payment
exports.createPayment = async (req, res) => {
  try {
    const { userId, propertyName, amount, paymentMethod } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const payment = await Payment.create({
      user: user._id,
      propertyName,
      amount,
      paymentMethod,
    });

    await sendReceiptEmail(user, payment);

    res.status(201).json({ payment, message: 'Payment successful and receipt sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment failed' });
  }
};

// Initialize Paystack payment
exports.initializePaystackPayment = async (req, res) => {
  try {
    const { email, amount, propertyName, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        callback_url: `${process.env.FRONTEND_URL}/payment-success`,
        metadata: { propertyName, userId },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ authorization_url: response.data.data.authorization_url });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
};

// Verify Paystack payment
exports.verifyPaystackPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, amount, metadata } = response.data.data;

    if (status === 'success') {
      // Record payment in DB
      const payment = await Payment.create({
        user: metadata.userId,
        propertyName: metadata.propertyName,
        amount: amount / 100,
        paymentMethod: 'card',
      });

      const user = await User.findById(metadata.userId);
      await sendReceiptEmail(user, payment);

      return res.json({ message: 'Payment successful', payment });
    }

    res.status(400).json({ message: 'Payment not successful' });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};