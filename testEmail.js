// testEmail.js
require('dotenv').config(); // Load .env
const { sendEmail } = require('./utils/email');

async function test() {
  try {
    await sendEmail('iamrihmeek@gmail.com', 'Test Email', '<p>Hello from Property API!</p>');
    console.log('Test email sent successfully!');
  } catch (err) {
    console.error('Failed to send test email:', err);
  }
}

test();
