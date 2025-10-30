// utils/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"RamShelf" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Email sending failed');
  }
};

const sendWelcomeEmail = (user) => {
  return sendEmail(
    user.email,
    'Welcome to Property Platform!',
    `<h1>Hello ${user.name}!</h1><p>Thanks for joining our platform.</p>`
  );
};

const sendReceiptEmail = (user, payment) => {
  return sendEmail(
    user.email,
    'Payment Receipt',
    `<h1>Hi ${user.name},</h1>
     <p>Thank you for your payment of <strong>R${payment.amount}</strong> for ${payment.propertyName}.</p>
     <p>Transaction ID: ${payment._id}</p>
     <p>We appreciate your business!</p>`
  );
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendReceiptEmail,
};
