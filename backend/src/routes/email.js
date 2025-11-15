const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');

const router = express.Router();

// Send email endpoint
router.post('/send-email', authenticateToken, (req, res) => {
  console.log('📍 Send email endpoint hit');
  
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return sendResponse(res, 400, false, 'Missing required fields: to, subject, message');
    }

    // Simulate email sending (in production, use nodemailer)
    console.log(`📧 Email simulation:`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Message: ${message.substring(0, 50)}...`);
    console.log(`  Sent by: ${req.user.email}`);

    sendResponse(res, 200, true, 'Email sent successfully', {
      to,
      subject,
      sent_at: new Date().toISOString(),
      sent_by: req.user.email
    });
  } catch (error) {
    console.error('❌ Send email error:', error);
    sendResponse(res, 500, false, 'Failed to send email');
  }
});

module.exports = router;