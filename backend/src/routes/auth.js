const express = require('express');
const bcryptjs = require('bcryptjs');
const { USERS_DB, OTP_STORE, TOKENS_DB } = require('../config/database');
const { generateToken } = require('../middleware/auth');
const { sendResponse, generateOTP } = require('../utils/helpers');
const { schemas, validate } = require('../utils/validation');

const router = express.Router();

// Authentication endpoint
router.post('/', validate(schemas.login), async (req, res) => {
  console.log('📍 Auth (POST) endpoint hit');
  
  try {
    const { username, password } = req.body;
    
    console.log(`🔍 Authentication attempt for: ${username}`);

    // Find user by email
    let foundUser = null;
    for (const user of USERS_DB.values()) {
      if (user.email === username) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      console.log(`❌ User not found: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, foundUser.password);
    
    if (!isPasswordValid) {
      console.log(`❌ Invalid password for: ${username}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const tokenPayload = {
      userId: foundUser._id,
      email: foundUser.email,
      user_type: foundUser.user_type,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name
    };

    const token = generateToken(tokenPayload);

    // Remove password from response
    const userResponse = {
      _id: foundUser._id,
      first_name: foundUser.first_name,
      last_name: foundUser.last_name,
      email: foundUser.email,
      user_type: foundUser.user_type,
      status: foundUser.status,
      created_at: foundUser.created_at
    };

    console.log(`✅ User authenticated: ${foundUser.email} (${foundUser.user_type})`);

    // Frontend expects response.data.data.token and response.data.message structure
    res.json({
      data: {
        token,
        user: userResponse,
      },
      message: 'Authentication successful',
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Auth error:', error);
    sendResponse(res, 500, false, 'Authentication failed');
  }
});

// Password reset request (send OTP)
router.post('/reset', validate(schemas.resetPassword), async (req, res) => {
  console.log('📍 Reset (POST) endpoint hit');
  
  try {
    const { email } = req.body;
    
    console.log(`🔍 Password reset requested for: ${email}`);

    // Find user by email
    let foundUser = null;
    for (const user of USERS_DB.values()) {
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }

    if (!foundUser) {
      console.log(`❌ User not found for reset: ${email}`);
      return sendResponse(res, 404, false, 'User not found');
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    OTP_STORE.set(email, {
      otp,
      expires_at: otpExpiry,
      created_at: new Date()
    });

    console.log(`📧 OTP generated for ${email}: ${otp} (expires: ${otpExpiry})`);
    
    // In production, send email here
    // For demo purposes, we'll just log it
    console.log(`📨 [EMAIL SIMULATION] To: ${email}, OTP: ${otp}`);

    sendResponse(res, 200, true, 'Password reset OTP sent successfully', {
      email,
      otp_expires_at: otpExpiry
    });

  } catch (error) {
    console.error('❌ Reset error:', error);
    sendResponse(res, 500, false, 'Failed to process password reset request');
  }
});

// Update password with OTP
router.post('/update-password', validate(schemas.updatePassword), async (req, res) => {
  console.log('📍 Update password (POST) endpoint hit');
  
  try {
    const { email, otp, new_password, new_password_confirmation } = req.body;

    console.log(`🔍 Password update attempt for: ${email}`);

    // Check if passwords match
    if (new_password !== new_password_confirmation) {
      return sendResponse(res, 400, false, 'New passwords do not match');
    }

    // Validate OTP
    const storedOTP = OTP_STORE.get(email);
    if (!storedOTP) {
      console.log(`❌ No OTP found for: ${email}`);
      return sendResponse(res, 400, false, 'Invalid or expired OTP');
    }

    if (storedOTP.otp !== otp) {
      console.log(`❌ Invalid OTP for: ${email}`);
      return sendResponse(res, 400, false, 'Invalid OTP');
    }

    if (new Date() > new Date(storedOTP.expires_at)) {
      console.log(`❌ Expired OTP for: ${email}`);
      OTP_STORE.delete(email);
      return sendResponse(res, 400, false, 'OTP has expired');
    }

    // Find and update user
    let foundUser = null;
    for (const [userId, user] of USERS_DB.entries()) {
      if (user.email === email) {
        foundUser = { id: userId, ...user };
        break;
      }
    }

    if (!foundUser) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(new_password, 12);

    // Update user password
    USERS_DB.set(foundUser.id, {
      ...foundUser,
      password: hashedPassword,
      updated_at: new Date().toISOString()
    });

    // Clear OTP
    OTP_STORE.delete(email);

    console.log(`✅ Password updated for: ${email}`);
    sendResponse(res, 200, true, 'Password updated successfully');

  } catch (error) {
    console.error('❌ Update password error:', error);
    sendResponse(res, 500, false, 'Failed to update password');
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  console.log('📍 Logout (POST) endpoint hit');
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    // Add token to blacklist
    TOKENS_DB.set(token, { blacklisted_at: new Date().toISOString() });
    console.log('🚪 Token blacklisted');
  }

  sendResponse(res, 200, true, 'Logged out successfully');
});

module.exports = router;