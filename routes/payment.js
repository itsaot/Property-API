const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Offline / manual payments
router.post('/', paymentController.createPayment);

// Paystack integration
router.post('/paystack/initialize', paymentController.initializePaystackPayment);
router.get('/paystack/verify/:reference', paymentController.verifyPaystackPayment);

module.exports = router;
