// Response helper function
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate random password
const generateRandomPassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Email template generator
const generateEmailTemplate = (type, data) => {
  switch (type) {
    case 'password_reset':
      return {
        subject: 'Password Reset - FinAid Hub',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hello ${data.name},</p>
          <p>You have requested to reset your password. Use the following OTP to reset your password:</p>
          <h3 style="color: #007bff;">${data.otp}</h3>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>FinAid Hub Team</p>
        `
      };
    case 'welcome':
      return {
        subject: 'Welcome to FinAid Hub',
        html: `
          <h2>Welcome to FinAid Hub!</h2>
          <p>Hello ${data.name},</p>
          <p>Your account has been created successfully.</p>
          <p><strong>Login Details:</strong></p>
          <p>Email: ${data.email}<br>
          Temporary Password: ${data.password}</p>
          <p>Please change your password after your first login.</p>
          <br>
          <p>Best regards,<br>FinAid Hub Team</p>
        `
      };
    default:
      return {
        subject: 'FinAid Hub Notification',
        html: `<p>${data.message}</p>`
      };
  }
};

// Generate license key
const generateLicenseKey = (prefix = 'FINAID') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate pagination info
const getPaginationInfo = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNext,
    hasPrev
  };
};

module.exports = {
  sendResponse,
  generateOTP,
  generateRandomPassword,
  generateEmailTemplate,
  generateLicenseKey,
  isValidEmail,
  getPaginationInfo
};