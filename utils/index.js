// utils/index.js
const connectDB = require('../config/db'); // correct path to your config folder
const { sendEmail, sendWelcomeEmail, sendReceiptEmail } = require('./email');
const generateToken = require('./generateToken');
const upload = require('./fileUpload');

module.exports = {
  connectDB,
  sendEmail,
  sendWelcomeEmail,
  sendReceiptEmail,
  generateToken,
  upload,
};
