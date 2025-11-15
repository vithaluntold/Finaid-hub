const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔧 Starting FinAidHub Backend Server...');

const app = express();
const PORT = process.env.PORT || 9003;
const CORS_ORIGIN = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000';
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

console.log(`🌍 Environment: ${NODE_ENV}`);
console.log(`🔌 Using PORT: ${PORT}`);
console.log(`🔗 CORS Origin: ${CORS_ORIGIN}`);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Enable CORS - support both development and production
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? [CORS_ORIGIN] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', CORS_ORIGIN],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

console.log('🔧 Middleware configured...');

// =================== DATA STORAGE (In-Memory for Development) ===================
// TODO: Replace with MongoDB/PostgreSQL in production

// User Storage
const USERS_DB = new Map();
const TOKENS_DB = new Map(); // For token blacklisting
const OTP_STORE = new Map();

// Business Data Storage
const FINAID_PROFILES_DB = new Map();
const LICENSES_DB = new Map();
const LICENSING_MASTER_DB = new Map();
const CLIENTS_DB = new Map();
const CLIENT_COMPANIES_DB = new Map();
const ADMINS_DB = new Map();
const AGENTS_RUNS_DB = new Map();
const VECTOR_DATA_DB = new Map();

// Initialize default data
const initializeDefaultData = () => {
  // Default Super Admin
  const superAdminId = uuidv4();
  USERS_DB.set(superAdminId, {
    _id: superAdminId,
    first_name: 'Super',
    last_name: 'Admin',
    email: 'superadmin@finaidhub.io',
    password: bcryptjs.hashSync('password123', 12),
    user_type: 'super_admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Default Admin
  const adminId = uuidv4();
  USERS_DB.set(adminId, {
    _id: adminId,
    first_name: 'John',
    last_name: 'Admin',
    email: 'admin@finaidhub.io',
    password: bcryptjs.hashSync('admin123', 12),
    user_type: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Default Accounting Firm Owner
  const ownerId = uuidv4();
  USERS_DB.set(ownerId, {
    _id: ownerId,
    first_name: 'Jane',
    last_name: 'Owner',
    email: 'owner@firm.com',
    password: bcryptjs.hashSync('owner123', 12),
    user_type: 'accounting_firm_owner',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Default Accountant
  const accountantId = uuidv4();
  USERS_DB.set(accountantId, {
    _id: accountantId,
    first_name: 'Bob',
    last_name: 'Accountant',
    email: 'accountant@firm.com',
    password: bcryptjs.hashSync('acc123', 12),
    user_type: 'accountant',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  console.log('✅ Default users initialized');

  // Initialize sample Fin(AI)d profiles
  const profile1Id = uuidv4();
  FINAID_PROFILES_DB.set(profile1Id, {
    _id: profile1Id,
    name: 'Basic Financial Analytics',
    description: 'Entry-level financial analysis and reporting',
    category: 'analytics',
    features: ['Transaction Categorization', 'Basic Reports', 'Expense Tracking'],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: superAdminId
  });

  const profile2Id = uuidv4();
  FINAID_PROFILES_DB.set(profile2Id, {
    _id: profile2Id,
    name: 'Advanced AI Bookkeeping',
    description: 'AI-powered bookkeeping with smart categorization',
    category: 'ai-automation',
    features: ['AI Categorization', 'Smart Reconciliation', 'Predictive Analytics'],
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: superAdminId
  });

  // Initialize sample licenses
  const license1Id = uuidv4();
  LICENSES_DB.set(license1Id, {
    _id: license1Id,
    finaid_profile_id: profile1Id,
    license_key: 'FINAID-BASIC-' + Date.now(),
    owner_id: ownerId,
    assigned_users: [],
    status: 'active',
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const license2Id = uuidv4();
  LICENSES_DB.set(license2Id, {
    _id: license2Id,
    finaid_profile_id: profile2Id,
    license_key: 'FINAID-ADVANCED-' + Date.now(),
    owner_id: ownerId,
    assigned_users: [accountantId],
    status: 'active',
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Initialize sample licensing master data
  const master1Id = uuidv4();
  LICENSING_MASTER_DB.set(master1Id, {
    _id: master1Id,
    finaid_profile_id: profile1Id,
    price: 99.99,
    currency: 'USD',
    billing_cycle: 'monthly',
    features: ['Transaction Categorization', 'Basic Reports', 'Expense Tracking'],
    max_users: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Initialize sample client companies
  const company1Id = uuidv4();
  CLIENT_COMPANIES_DB.set(company1Id, {
    _id: company1Id,
    company_name: 'ABC Corporation',
    industry: 'Technology',
    size: '50-100 employees',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner_id: ownerId
  });

  // Initialize sample clients
  const client1Id = uuidv4();
  CLIENTS_DB.set(client1Id, {
    _id: client1Id,
    name: 'John Client',
    email: 'john.client@abccorp.com',
    phone: '+1-555-0123',
    company_id: company1Id,
    profile_id: profile1Id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assigned_accountant: accountantId
  });

  console.log('✅ Sample data initialized');
};

// =================== UTILITY FUNCTIONS ===================

// JWT Helper Functions
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token is required' 
    });
  }

  // Check if token is blacklisted
  if (TOKENS_DB.has(token)) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token has been invalidated' 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }

  req.user = decoded;
  next();
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.user_type)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Response helper function
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Input validation schemas
const schemas = {
  login: Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  resetPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  updatePassword: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    new_password: Joi.string().min(6).required(),
    new_password_confirmation: Joi.string().min(6).required()
  }),

  createUser: Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    user_type: Joi.string().valid('admin', 'accounting_firm_owner', 'accountant').required(),
    department: Joi.string().optional()
  })
};

// =================== FILE UPLOAD CONFIGURATION ===================

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`📁 Created uploads directory: ${uploadsDir}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow specific file types
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'application/pdf', 'text/csv', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, and Excel files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB default
  }
});

// =================== EMAIL SYSTEM ===================

// Configure nodemailer
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email helper functions
const sendEmail = async (to, subject, htmlContent, textContent = null) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email credentials not configured, skipping email send');
      return { success: true, message: 'Email system not configured - development mode' };
    }

    const mailOptions = {
      from: process.env.MAIL_FROM || 'noreply@finaidhub.io',
      to,
      subject,
      html: htmlContent,
      text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const result = await emailTransporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}: ${result.messageId}`);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('❌ Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendOTPEmail = async (email, otp) => {
  const subject = 'FinAid Hub - Password Reset OTP';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">FinAid Hub - Password Reset</h2>
      <p>Hello,</p>
      <p>You have requested to reset your password. Please use the following OTP code:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
        <h1 style="color: #1f2937; font-size: 32px; margin: 0;">${otp}</h1>
      </div>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you did not request this password reset, please ignore this email.</p>
      <hr style="margin: 30px 0;">
      <p style="color: #6b7280; font-size: 14px;">
        This is an automated email from FinAid Hub. Please do not reply to this email.
      </p>
    </div>
  `;
  
  return await sendEmail(email, subject, html);
};

const sendInvitationEmail = async (email, firstName, lastName, role, tempPassword = null) => {
  const subject = `Welcome to FinAid Hub - ${role} Invitation`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to FinAid Hub!</h2>
      <p>Hello ${firstName} ${lastName},</p>
      <p>You have been invited to join FinAid Hub as a <strong>${role}</strong>.</p>
      
      ${tempPassword ? `
        <div style="background-color: #f3f4f6; padding: 20px; margin: 20px 0;">
          <p><strong>Your login credentials:</strong></p>
          <p>Email: ${email}</p>
          <p>Temporary Password: <code style="background-color: #e5e7eb; padding: 2px 4px;">${tempPassword}</code></p>
        </div>
        <p>Please log in and change your password immediately.</p>
      ` : `
        <p>Please complete your registration by setting up your password.</p>
      `}
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Access FinAid Hub
        </a>
      </div>
      
      <hr style="margin: 30px 0;">
      <p style="color: #6b7280; font-size: 14px;">
        If you did not expect this invitation, please contact your administrator.
      </p>
    </div>
  `;
  
  return await sendEmail(email, subject, html);
};

// Initialize data
initializeDefaultData();

console.log('🔧 Data storage and utilities configured...');

// =================== PUBLIC ENDPOINTS ===================

// Root endpoint
app.get('/', (req, res) => {
  console.log('📍 Root endpoint hit');
  sendResponse(res, 200, true, 'FinAidHub Backend Server is Working!', {
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      docs: '/api/v1/docs'
    },
    environment: NODE_ENV
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('📍 Health endpoint hit');
  sendResponse(res, 200, true, 'Server is healthy and running', {
    status: 'OK',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

// =================== AUTHENTICATION ENDPOINTS ===================

// Login endpoint with real JWT
app.post('/api/v1/auth', async (req, res) => {
  console.log('📍 Auth endpoint hit');
  
  try {
    // Validate input
    const { error, value } = schemas.login.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { username, password } = value;

    // Find user by email
    let foundUser = null;
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.email === username) {
        foundUser = { id: userId, ...userData };
        break;
      }
    }

    if (!foundUser) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return sendResponse(res, 401, false, 'Invalid credentials');
    }

    // Check if user is active
    if (foundUser.status !== 'active') {
      return sendResponse(res, 401, false, 'Account is not active');
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

// Password reset endpoints (using existing OTP_STORE)

// Generate/reset password token (send OTP) - Enhanced version
app.post('/api/v1/reset', async (req, res) => {
  console.log('📍 Reset (POST) endpoint hit');
  
  try {
    // Validate input
    const { error, value } = schemas.resetPassword.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { email } = value;

    // Check if user exists
    let userExists = false;
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.email === email) {
        userExists = true;
        break;
      }
    }

    if (!userExists) {
      // Don't reveal if email exists or not for security
      return sendResponse(res, 200, true, `If the email exists, an OTP has been sent to ${email}`, {
        status: true
      });
    }

    // Generate 6-digit OTP with expiration
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + (parseInt(process.env.OTP_EXPIRES_IN || '300000')); // 5 minutes default
    
    OTP_STORE.set(email, {
      code: otp,
      expires: otpExpiry,
      attempts: 0
    });
    
    console.log(`🔐 Generated OTP for ${email}: ${otp} (expires at ${new Date(otpExpiry)})`);

    // TODO: Send real email here in production
    // await sendOTPEmail(email, otp);

    return sendResponse(res, 200, true, `OTP generated and sent to ${email}`, {
      status: true,
      otpForTesting: NODE_ENV === 'development' ? otp : undefined, // Only show in dev
      expiresIn: process.env.OTP_EXPIRES_IN || '300000'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    sendResponse(res, 500, false, 'Password reset failed');
  }
});

// Verify/update password - Enhanced version
app.put('/api/v1/reset', async (req, res) => {
  console.log('📍 Reset (PUT) endpoint hit');
  
  try {
    // Validate input
    const { error, value } = schemas.updatePassword.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { email, otp, new_password, new_password_confirmation } = value;

    // Check password confirmation
    if (new_password !== new_password_confirmation) {
      return sendResponse(res, 400, false, "Passwords don't match");
    }

    // Verify OTP
    const storedOtpData = OTP_STORE.get(email);
    if (!storedOtpData) {
      return sendResponse(res, 400, false, 'Invalid or expired OTP');
    }

    // Check OTP expiry
    if (Date.now() > storedOtpData.expires) {
      OTP_STORE.delete(email);
      return sendResponse(res, 400, false, 'OTP has expired. Please request a new one.');
    }

    // Check OTP code
    if (storedOtpData.code !== String(otp)) {
      storedOtpData.attempts += 1;
      if (storedOtpData.attempts >= 3) {
        OTP_STORE.delete(email);
        return sendResponse(res, 400, false, 'Too many failed attempts. Please request a new OTP.');
      }
      return sendResponse(res, 400, false, `Invalid OTP. ${3 - storedOtpData.attempts} attempts remaining.`);
    }

    // Find user and update password
    let userUpdated = false;
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.email === email) {
        const hashedPassword = await bcryptjs.hash(new_password, 12);
        userData.password = hashedPassword;
        userData.updated_at = new Date().toISOString();
        USERS_DB.set(userId, userData);
        userUpdated = true;
        break;
      }
    }

    if (!userUpdated) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Clean up OTP
    OTP_STORE.delete(email);
    console.log(`🔐 Password updated successfully for ${email}`);

    return sendResponse(res, 200, true, 'Password updated successfully', {
      status: true
    });

  } catch (error) {
    console.error('❌ Update password error:', error);
    sendResponse(res, 500, false, 'Password update failed');
  }
});

// =================== USER MANAGEMENT ENDPOINTS ===================

// Get user profile (protected)
app.get('/api/v1/users/profile', authenticateToken, (req, res) => {
  console.log('📍 Get user profile endpoint hit');
  
  try {
    const userId = req.user.userId;
    const userData = USERS_DB.get(userId);
    
    if (!userData) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Remove sensitive data
    const userProfile = {
      _id: userData._id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_type: userData.user_type,
      status: userData.status,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      department: userData.department || null
    };

    sendResponse(res, 200, true, 'User profile retrieved successfully', userProfile);

  } catch (error) {
    console.error('❌ Get profile error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve user profile');
  }
});

// Update user profile (protected)
app.put('/api/v1/users/profile', authenticateToken, async (req, res) => {
  console.log('📍 Update user profile endpoint hit');
  
  try {
    const userId = req.user.userId;
    const userData = USERS_DB.get(userId);
    
    if (!userData) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const { first_name, last_name, department } = req.body;

    // Update allowed fields only
    if (first_name) userData.first_name = first_name;
    if (last_name) userData.last_name = last_name;
    if (department !== undefined) userData.department = department;
    userData.updated_at = new Date().toISOString();

    USERS_DB.set(userId, userData);

    // Remove sensitive data
    const userProfile = {
      _id: userData._id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_type: userData.user_type,
      status: userData.status,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      department: userData.department || null
    };

    sendResponse(res, 200, true, 'Profile updated successfully', userProfile);

  } catch (error) {
    console.error('❌ Update profile error:', error);
    sendResponse(res, 500, false, 'Failed to update user profile');
  }
});

// Get user info by ID (public endpoint used by frontend)
app.get('/api/v1/user/get-user-info', (req, res) => {
  console.log('📍 Get user info endpoint hit');
  console.log('🔍 Requested user ID:', req.query.id);
  
  try {
    const { id } = req.query;
    
    if (!id) {
      return sendResponse(res, 400, false, 'User ID is required');
    }

    const userData = USERS_DB.get(id);
    console.log('📦 User found in DB:', userData ? 'YES' : 'NO');
    console.log('📊 Total users in DB:', USERS_DB.size);
    
    if (!userData) {
      // Log all user IDs for debugging
      const allUserIds = Array.from(USERS_DB.keys());
      console.log('🔑 Available user IDs:', allUserIds);
      return sendResponse(res, 404, false, 'User not found');
    }

    // Return public user info only
    const userInfo = {
      _id: userData._id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_type: userData.user_type,
      status: userData.status,
      created_at: userData.created_at,
      department: userData.department || null
    };

    sendResponse(res, 200, true, 'User info retrieved successfully', userInfo);

  } catch (error) {
    console.error('❌ Get user info error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve user info');
  }
});

// Get accounting firm owners (for super admin) - MUST be before /users/:id
app.get('/api/v1/users/accounting-owner', authenticateToken, authorizeRoles('super_admin', 'admin'), (req, res) => {
  console.log('📍 Get accounting owners endpoint hit');
  
  try {
    const accountingOwners = [];
    
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.user_type === 'accounting_firm_owner') {
        accountingOwners.push({
          _id: userData._id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          user_type: userData.user_type,
          status: userData.status,
          created_at: userData.created_at,
          department: userData.department || null
        });
      }
    }

    sendResponse(res, 200, true, 'Accounting firm owners retrieved successfully', accountingOwners);

  } catch (error) {
    console.error('❌ Get accounting owners error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve accounting firm owners');
  }
});

// Get invited accountants - MUST be before /users/:id
app.get('/api/v1/users/accountant/invited', authenticateToken, authorizeRoles('accounting_firm_owner'), (req, res) => {
  console.log('📍 Get invited accountants endpoint hit');
  
  try {
    const invitedAccountants = [];
    
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.user_type === 'accountant' && userData.status === 'invited') {
        invitedAccountants.push({
          _id: userData._id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          user_type: userData.user_type,
          status: userData.status,
          created_at: userData.created_at,
          invited_by: userData.invited_by || req.user.userId
        });
      }
    }

    sendResponse(res, 200, true, 'Invited accountants retrieved successfully', invitedAccountants);

  } catch (error) {
    console.error('❌ Get invited accountants error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve invited accountants');
  }
});

// Get user by ID (RESTful endpoint) - MUST be after specific routes like accounting-owner
app.get('/api/v1/users/:id', (req, res) => {
  console.log('📍 Get user by ID endpoint hit');
  console.log('🔍 Requested user ID:', req.params.id);
  
  try {
    const { id } = req.params;
    
    if (!id) {
      return sendResponse(res, 400, false, 'User ID is required');
    }

    const userData = USERS_DB.get(id);
    console.log('📦 User found in DB:', userData ? 'YES' : 'NO');
    
    if (!userData) {
      const allUserIds = Array.from(USERS_DB.keys());
      console.log('🔑 Available user IDs:', allUserIds);
      return sendResponse(res, 404, false, 'User not found');
    }

    // Return public user info only
    const userInfo = {
      _id: userData._id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_type: userData.user_type,
      status: userData.status,
      created_at: userData.created_at,
      department: userData.department || null
    };

    sendResponse(res, 200, true, 'User info retrieved successfully', userInfo);

  } catch (error) {
    console.error('❌ Get user by ID error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve user info');
  }
});

// =================== ADMIN MANAGEMENT ENDPOINTS ===================

// Get all admins by super admin (enhanced)
app.get('/api/v1/admins/users/by-superadmin', authenticateToken, authorizeRoles('super_admin'), (req, res) => {
  console.log('📍 Get admins by super admin endpoint hit');
  
  try {
    const admins = [];
    
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.user_type === 'admin') {
        admins.push({
          _id: userData._id,
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          user_type: userData.user_type,
          status: userData.status,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          department: userData.department || 'General'
        });
      }
    }

    sendResponse(res, 200, true, 'Admins retrieved successfully', admins);

  } catch (error) {
    console.error('❌ Get admins error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve admins');
  }
});

// Create new admin (enhanced)
app.post('/api/v1/admins/users', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  console.log('📍 Create admin endpoint hit');
  
  try {
    const { error, value } = schemas.createUser.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { first_name, last_name, email, department } = value;

    // Check if user already exists
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.email === email) {
        return sendResponse(res, 400, false, 'User with this email already exists');
      }
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcryptjs.hash(tempPassword, 12);

    const newAdminId = uuidv4();
    const newAdmin = {
      _id: newAdminId,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      user_type: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      department: department || 'General',
      created_by: req.user.userId,
      temp_password: tempPassword // Store for response only
    };

    USERS_DB.set(newAdminId, newAdmin);
    console.log(`👥 New admin created: ${first_name} ${last_name} (${email})`);

    // Remove sensitive data from response
    const adminResponse = { ...newAdmin };
    delete adminResponse.password;
    
    // TODO: Send welcome email with temporary password in production
    console.log(`🔐 Temporary password for ${email}: ${tempPassword}`);

    sendResponse(res, 201, true, 'Admin created successfully', {
      ...adminResponse,
      tempPasswordForTesting: NODE_ENV === 'development' ? tempPassword : undefined
    });

  } catch (error) {
    console.error('❌ Create admin error:', error);
    sendResponse(res, 500, false, 'Failed to create admin');
  }
});

// Invite admin endpoint (enhanced)
app.post('/api/v1/admins/invite', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  console.log('📍 Invite admin endpoint hit');
  
  try {
    const { error, value } = schemas.createUser.validate(req.body);
    if (error) {
      return sendResponse(res, 400, false, error.details[0].message);
    }

    const { first_name, last_name, email, department } = value;

    // Check if user already exists
    for (const [userId, userData] of USERS_DB.entries()) {
      if (userData.email === email) {
        return sendResponse(res, 400, false, 'User with this email already exists');
      }
    }

    const inviteId = uuidv4();
    const invitedAdmin = {
      _id: inviteId,
      first_name,
      last_name,
      email,
      password: null, // Will be set when they accept invite
      user_type: 'admin',
      status: 'invited',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      department: department || 'General',
      invited_by: req.user.userId,
      invite_token: uuidv4() // For invite verification
    };

    USERS_DB.set(inviteId, invitedAdmin);
    console.log(`📧 Admin invitation created: ${first_name} ${last_name} (${email})`);

    // TODO: Send invitation email in production
    
    const inviteResponse = { ...invitedAdmin };
    delete inviteResponse.password;
    delete inviteResponse.invite_token; // Don't expose token

    res.json({
      success: true,
      status: 'Success',
      data: inviteResponse,
      message: 'Admin invitation sent successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Invite admin error:', error);
    sendResponse(res, 500, false, 'Failed to send admin invitation');
  }
});

// Delete admin (enhanced)
app.delete('/api/v1/admins/users/:id', authenticateToken, authorizeRoles('super_admin'), (req, res) => {
  console.log('📍 Delete admin endpoint hit');
  
  try {
    const { id } = req.params;
    const userData = USERS_DB.get(id);
    
    if (!userData) {
      return sendResponse(res, 404, false, 'Admin not found');
    }

    if (userData.user_type !== 'admin') {
      return sendResponse(res, 400, false, 'User is not an admin');
    }

    // Prevent deleting yourself
    if (id === req.user.userId) {
      return sendResponse(res, 400, false, 'Cannot delete your own account');
    }

    USERS_DB.delete(id);
    console.log(`🗑️ Admin deleted: ${userData.first_name} ${userData.last_name} (${userData.email})`);

    const deletedAdminResponse = {
      _id: userData._id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      user_type: userData.user_type,
      status: userData.status
    };

    sendResponse(res, 200, true, 'Admin deleted successfully', deletedAdminResponse);

  } catch (error) {
    console.error('❌ Delete admin error:', error);
    sendResponse(res, 500, false, 'Failed to delete admin');
  }
});

// Resend invite (enhanced)
app.post('/api/v1/users/resend-invite/:id', authenticateToken, authorizeRoles('super_admin'), (req, res) => {
  console.log('📍 Resend invite endpoint hit');
  
  try {
    const { id } = req.params;
    const userData = USERS_DB.get(id);
    
    if (!userData) {
      return sendResponse(res, 404, false, 'User not found');
    }

    if (userData.status !== 'invited') {
      return sendResponse(res, 400, false, 'User has already accepted the invitation');
    }

    // Update invite token and timestamp
    userData.invite_token = uuidv4();
    userData.updated_at = new Date().toISOString();
    USERS_DB.set(id, userData);

    console.log(`📧 Invitation resent to: ${userData.first_name} ${userData.last_name} (${userData.email})`);

    // TODO: Send new invitation email in production

    sendResponse(res, 200, true, 'Invitation resent successfully', {
      status: 'Success',
      user: {
        _id: userData._id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email
      }
    });

  } catch (error) {
    console.error('❌ Resend invite error:', error);
    sendResponse(res, 500, false, 'Failed to resend invitation');
  }
});

// =================== LICENSE MANAGEMENT ENDPOINTS ===================

// Get my licenses (for all user types)
app.get('/api/v1/licenses/my-licenses', authenticateToken, (req, res) => {
  console.log('📍 Get my licenses endpoint hit');
  
  try {
    const userId = req.user.userId;
    const userLicenses = [];
    
    for (const [licenseId, licenseData] of LICENSES_DB.entries()) {
      if (licenseData.owner_id === userId || licenseData.assigned_users?.includes(userId)) {
        userLicenses.push(licenseData);
      }
    }

    sendResponse(res, 200, true, 'Licenses retrieved successfully', {
      licenses: userLicenses,
      count: userLicenses.length
    });

  } catch (error) {
    console.error('❌ Get my licenses error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve licenses');
  }
});

// Get licenses for accountant role
app.get('/api/v1/licenses/my-licenses/accountant', authenticateToken, authorizeRoles('accountant'), (req, res) => {
  console.log('📍 Get accountant licenses endpoint hit');
  
  try {
    const userId = req.user.userId;
    const accountantLicenses = [];
    
    for (const [licenseId, licenseData] of LICENSES_DB.entries()) {
      if (licenseData.assigned_users?.includes(userId)) {
        accountantLicenses.push(licenseData);
      }
    }

    sendResponse(res, 200, true, 'Accountant licenses retrieved successfully', {
      licenses: accountantLicenses,
      count: accountantLicenses.length
    });

  } catch (error) {
    console.error('❌ Get accountant licenses error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve accountant licenses');
  }
});

// Assign license to user
app.post('/api/v1/licenses/assign', authenticateToken, authorizeRoles('accounting_firm_owner', 'admin'), (req, res) => {
  console.log('📍 Assign license endpoint hit');
  
  try {
    const { license_id, user_id } = req.body;
    
    if (!license_id || !user_id) {
      return sendResponse(res, 400, false, 'License ID and User ID are required');
    }

    const licenseData = LICENSES_DB.get(license_id);
    if (!licenseData) {
      return sendResponse(res, 404, false, 'License not found');
    }

    const userData = USERS_DB.get(user_id);
    if (!userData) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Initialize assigned_users if not exists
    if (!licenseData.assigned_users) {
      licenseData.assigned_users = [];
    }

    // Check if already assigned
    if (licenseData.assigned_users.includes(user_id)) {
      return sendResponse(res, 400, false, 'License already assigned to this user');
    }

    // Assign license
    licenseData.assigned_users.push(user_id);
    licenseData.updated_at = new Date().toISOString();
    LICENSES_DB.set(license_id, licenseData);

    console.log(`📄 License ${license_id} assigned to user ${user_id}`);

    sendResponse(res, 200, true, 'License assigned successfully', {
      license_id,
      user_id,
      assigned_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Assign license error:', error);
    sendResponse(res, 500, false, 'Failed to assign license');
  }
});

// =================== FINAID PROFILES ENDPOINTS ===================

// Get all Fin(AI)d profiles with optional filtering
app.get('/api/v1/finaid-profiles', (req, res) => {
  console.log('📍 Get finaid profiles endpoint hit');
  
  try {
    const profiles = [];
    
    for (const [profileId, profileData] of FINAID_PROFILES_DB.entries()) {
      profiles.push(profileData);
    }

    sendResponse(res, 200, true, 'Fin(AI)d profiles retrieved successfully', profiles);

  } catch (error) {
    console.error('❌ Get finaid profiles error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve Fin(AI)d profiles');
  }
});

// Get Fin(AI)d profiles with filter
app.get('/api/v1/finaid-profiles/filter', (req, res) => {
  console.log('📍 Get filtered finaid profiles endpoint hit');
  
  try {
    const { finaid_profile_id } = req.query;
    
    if (finaid_profile_id) {
      const profile = FINAID_PROFILES_DB.get(finaid_profile_id);
      if (profile) {
        return sendResponse(res, 200, true, 'Fin(AI)d profile found', [profile]);
      } else {
        return sendResponse(res, 404, false, 'Fin(AI)d profile not found', []);
      }
    }

    // Return all profiles if no filter
    const profiles = [];
    for (const [profileId, profileData] of FINAID_PROFILES_DB.entries()) {
      profiles.push(profileData);
    }

    sendResponse(res, 200, true, 'Fin(AI)d profiles retrieved successfully', profiles);

  } catch (error) {
    console.error('❌ Get filtered finaid profiles error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve filtered Fin(AI)d profiles');
  }
});

// Create new Fin(AI)d profile
app.post('/api/v1/finaid-profiles', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Create finaid profile endpoint hit');
  
  try {
    const { name, description, category, features } = req.body;
    
    if (!name) {
      return sendResponse(res, 400, false, 'Profile name is required');
    }

    const profileId = uuidv4();
    const newProfile = {
      _id: profileId,
      name,
      description: description || '',
      category: category || 'general',
      features: features || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: req.user.userId
    };

    FINAID_PROFILES_DB.set(profileId, newProfile);
    console.log(`📊 New Fin(AI)d profile created: ${name}`);

    sendResponse(res, 201, true, 'Fin(AI)d profile created successfully', newProfile);

  } catch (error) {
    console.error('❌ Create finaid profile error:', error);
    sendResponse(res, 500, false, 'Failed to create Fin(AI)d profile');
  }
});

// Delete Fin(AI)d profile
app.delete('/api/v1/finaid-profiles/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Delete finaid profile endpoint hit');
  
  try {
    const { id } = req.params;
    const profileData = FINAID_PROFILES_DB.get(id);
    
    if (!profileData) {
      return sendResponse(res, 404, false, 'Fin(AI)d profile not found');
    }

    FINAID_PROFILES_DB.delete(id);
    console.log(`🗑️ Fin(AI)d profile deleted: ${profileData.name}`);

    sendResponse(res, 200, true, 'Fin(AI)d profile deleted successfully', profileData);

  } catch (error) {
    console.error('❌ Delete finaid profile error:', error);
    sendResponse(res, 500, false, 'Failed to delete Fin(AI)d profile');
  }
});

// =================== LICENSING MASTER ENDPOINTS ===================

// Get licensing master by profile ID
app.get('/api/v1/licensing-master/profile-id/:id', (req, res) => {
  console.log('📍 Get licensing master by profile ID endpoint hit');
  
  try {
    const { id } = req.params;
    const licensingMaster = [];
    
    for (const [masterId, masterData] of LICENSING_MASTER_DB.entries()) {
      if (masterData.finaid_profile_id === id) {
        licensingMaster.push(masterData);
      }
    }

    sendResponse(res, 200, true, 'Licensing master data retrieved successfully', licensingMaster);

  } catch (error) {
    console.error('❌ Get licensing master error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve licensing master data');
  }
});

// =================== CLIENT MANAGEMENT ENDPOINTS ===================

// Get all clients
app.get('/api/v1/clients', authenticateToken, (req, res) => {
  console.log('📍 Get clients endpoint hit');
  
  try {
    const clients = [];
    
    for (const [clientId, clientData] of CLIENTS_DB.entries()) {
      clients.push(clientData);
    }

    sendResponse(res, 200, true, 'Clients retrieved successfully', clients);

  } catch (error) {
    console.error('❌ Get clients error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve clients');
  }
});

// Get client companies
app.get('/api/v1/client-companies', authenticateToken, (req, res) => {
  console.log('📍 Get client companies endpoint hit');
  
  try {
    const companies = [];
    
    for (const [companyId, companyData] of CLIENT_COMPANIES_DB.entries()) {
      companies.push(companyData);
    }

    sendResponse(res, 200, true, 'Client companies retrieved successfully', companies);

  } catch (error) {
    console.error('❌ Get client companies error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve client companies');
  }
});

// =================== QUICKBOOKS INTEGRATION ENDPOINTS ===================

// QuickBooks OAuth authorization
app.get('/api/v1/quickbooks/authorize', authenticateToken, (req, res) => {
  console.log('📍 QuickBooks authorize endpoint hit');
  
  try {
    const { client_id, state, code, realmId } = req.query;
    
    if (!code || !realmId) {
      // Generate authorization URL
      const authUrl = `https://appcenter.intuit.com/connect/oauth2?` +
        `client_id=${process.env.QUICKBOOKS_CLIENT_ID || 'your_client_id'}&` +
        `scope=com.intuit.quickbooks.accounting&` +
        `redirect_uri=${encodeURIComponent(process.env.QUICKBOOKS_REDIRECT_URI || 'http://localhost:9000/api/v1/quickbooks/callback')}&` +
        `response_type=code&` +
        `access_type=offline&` +
        `state=${state || req.user.userId}`;
      
      return sendResponse(res, 200, true, 'QuickBooks authorization URL generated', {
        authUrl,
        redirectTo: authUrl
      });
    }

    // Handle callback with code
    const tokenData = {
      access_token: `qb_access_${Date.now()}`,
      refresh_token: `qb_refresh_${Date.now()}`,
      token_type: 'Bearer',
      expires_in: 3600,
      realmId,
      scope: 'com.intuit.quickbooks.accounting'
    };

    // Store QB connection for user
    const userId = req.user.userId;
    const userData = USERS_DB.get(userId);
    if (userData) {
      userData.quickbooks_connection = {
        ...tokenData,
        connected_at: new Date().toISOString(),
        status: 'active'
      };
      USERS_DB.set(userId, userData);
    }

    sendResponse(res, 200, true, 'QuickBooks connected successfully', tokenData);

  } catch (error) {
    console.error('❌ QuickBooks authorize error:', error);
    sendResponse(res, 500, false, 'QuickBooks authorization failed');
  }
});

// Get QuickBooks vendors
app.post('/api/v1/quickbooks/vendors', authenticateToken, (req, res) => {
  console.log('📍 QuickBooks vendors endpoint hit');
  
  try {
    // Mock QuickBooks vendors data
    const mockVendors = [
      {
        Id: '1',
        Name: 'Office Supply Co',
        CompanyName: 'Office Supply Co',
        Active: true,
        Balance: 250.00,
        AcctNum: 'V001'
      },
      {
        Id: '2', 
        Name: 'Tech Solutions Inc',
        CompanyName: 'Tech Solutions Inc',
        Active: true,
        Balance: 0.00,
        AcctNum: 'V002'
      }
    ];

    sendResponse(res, 200, true, 'QuickBooks vendors retrieved successfully', mockVendors);

  } catch (error) {
    console.error('❌ QuickBooks vendors error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve QuickBooks vendors');
  }
});

// Get QuickBooks customers
app.post('/api/v1/quickbooks/customers', authenticateToken, (req, res) => {
  console.log('📍 QuickBooks customers endpoint hit');
  
  try {
    const mockCustomers = [
      {
        Id: '1',
        Name: 'ABC Corporation',
        CompanyName: 'ABC Corporation',
        Active: true,
        Balance: 1500.00,
        BillAddr: {
          Line1: '123 Business St',
          City: 'Business City',
          CountrySubDivisionCode: 'CA',
          PostalCode: '90210'
        }
      },
      {
        Id: '2',
        Name: 'XYZ Enterprises',
        CompanyName: 'XYZ Enterprises', 
        Active: true,
        Balance: 750.00,
        BillAddr: {
          Line1: '456 Enterprise Ave',
          City: 'Commerce City',
          CountrySubDivisionCode: 'NY',
          PostalCode: '10001'
        }
      }
    ];

    sendResponse(res, 200, true, 'QuickBooks customers retrieved successfully', mockCustomers);

  } catch (error) {
    console.error('❌ QuickBooks customers error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve QuickBooks customers');
  }
});

// QuickBooks unified endpoints for frontend
app.post('/api/v1/quickbooks/unified/payees', authenticateToken, (req, res) => {
  console.log('📍 QuickBooks unified payees endpoint hit');
  
  try {
    const mockPayees = [
      { id: '1', name: 'Office Supply Co', type: 'vendor', balance: 250.00 },
      { id: '2', name: 'Tech Solutions Inc', type: 'vendor', balance: 0.00 },
      { id: '3', name: 'ABC Corporation', type: 'customer', balance: 1500.00 },
      { id: '4', name: 'XYZ Enterprises', type: 'customer', balance: 750.00 }
    ];

    sendResponse(res, 200, true, 'Unified payees retrieved successfully', mockPayees);

  } catch (error) {
    console.error('❌ QuickBooks unified payees error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve unified payees');
  }
});

app.post('/api/v1/quickbooks/unified/categories', authenticateToken, (req, res) => {
  console.log('📍 QuickBooks unified categories endpoint hit');
  
  try {
    const mockCategories = [
      { id: '1', name: 'Office Expenses', type: 'Expense', balance: 0.00 },
      { id: '2', name: 'Travel Expenses', type: 'Expense', balance: 0.00 },
      { id: '3', name: 'Software Subscriptions', type: 'Expense', balance: 0.00 },
      { id: '4', name: 'Revenue', type: 'Income', balance: 0.00 },
      { id: '5', name: 'Consulting Income', type: 'Income', balance: 0.00 }
    ];

    sendResponse(res, 200, true, 'Unified categories retrieved successfully', mockCategories);

  } catch (error) {
    console.error('❌ QuickBooks unified categories error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve unified categories');
  }
});

app.post('/api/v1/quickbooks/unified/invoices', authenticateToken, (req, res) => {
  console.log('📍 QuickBooks unified invoices endpoint hit');
  
  try {
    const mockInvoices = [
      {
        id: '1',
        docNumber: 'INV-001',
        customer: 'ABC Corporation',
        amount: 1500.00,
        dueDate: '2024-12-15',
        status: 'Open'
      },
      {
        id: '2',
        docNumber: 'INV-002', 
        customer: 'XYZ Enterprises',
        amount: 750.00,
        dueDate: '2024-12-20',
        status: 'Paid'
      }
    ];

    sendResponse(res, 200, true, 'Unified invoices retrieved successfully', mockInvoices);

  } catch (error) {
    console.error('❌ QuickBooks unified invoices error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve unified invoices');
  }
});

app.post('/api/v1/quickbooks/unified/bills', authenticateToken, (req, res) => {
  console.log('📍 QuickBooks unified bills endpoint hit');
  
  try {
    const mockBills = [
      {
        id: '1',
        vendor: 'Office Supply Co',
        amount: 250.00,
        dueDate: '2024-12-10',
        status: 'Open',
        referenceNumber: 'BILL-001'
      },
      {
        id: '2',
        vendor: 'Tech Solutions Inc',
        amount: 500.00,
        dueDate: '2024-12-12',
        status: 'Paid',
        referenceNumber: 'BILL-002'
      }
    ];

    sendResponse(res, 200, true, 'Unified bills retrieved successfully', mockBills);

  } catch (error) {
    console.error('❌ QuickBooks unified bills error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve unified bills');
  }
});

// =================== COMPLETE AI AGENT SYSTEM ===================

// Get AI agent runs by company
app.get('/api/v1/finaid-agent/runs/company/:clientID', authenticateToken, (req, res) => {
  console.log('📍 Get AI agent runs by company endpoint hit');
  
  try {
    const { clientID } = req.params;
    let runs = [];
    
    // Get existing runs
    for (const [runId, runData] of AGENTS_RUNS_DB.entries()) {
      if (runData.client_company_id === clientID) {
        runs.push(runData);
      }
    }

    // If no runs exist, create sample runs
    if (runs.length === 0) {
      const sampleRuns = [
        {
          run_id: uuidv4(),
          client_company_id: clientID,
          status: 'completed',
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          transactions_processed: 156,
          categories_found: 12,
          ai_confidence: 0.92
        },
        {
          run_id: uuidv4(),
          client_company_id: clientID,
          status: 'processing',
          created_at: new Date().toISOString(),
          completed_at: null,
          transactions_processed: 45,
          categories_found: 8,
          ai_confidence: 0.87
        }
      ];

      sampleRuns.forEach(run => {
        AGENTS_RUNS_DB.set(run.run_id, run);
        runs.push(run);
      });
    }

    sendResponse(res, 200, true, 'AI agent runs retrieved successfully', runs);

  } catch (error) {
    console.error('❌ Get AI agent runs error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve AI agent runs');
  }
});

// Get specific AI run details
app.get('/api/v1/finaid-agent/runs/:run_id', authenticateToken, (req, res) => {
  console.log('📍 Get AI run details endpoint hit');
  
  try {
    const { run_id } = req.params;
    const runData = AGENTS_RUNS_DB.get(run_id);
    
    if (!runData) {
      return sendResponse(res, 404, false, 'AI run not found');
    }

    // Add detailed run information
    const detailedRun = {
      ...runData,
      transactions: [
        {
          id: '1',
          date: '2024-11-01',
          description: 'Office Supply Purchase',
          amount: -150.50,
          category: 'Office Expenses',
          ai_confidence: 0.95,
          status: 'processed'
        },
        {
          id: '2', 
          date: '2024-11-02',
          description: 'Client Payment Received',
          amount: 2500.00,
          category: 'Revenue',
          ai_confidence: 0.98,
          status: 'processed'
        }
      ],
      summary: {
        total_transactions: runData.transactions_processed || 156,
        income_transactions: 45,
        expense_transactions: 111,
        total_income: 15750.00,
        total_expenses: 8250.50,
        net_amount: 7499.50
      }
    };

    sendResponse(res, 200, true, 'AI run details retrieved successfully', detailedRun);

  } catch (error) {
    console.error('❌ Get AI run details error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve AI run details');
  }
});

// AI Agent vector indexing
app.post('/api/v1/finaid-agent/vector/index', authenticateToken, (req, res) => {
  console.log('📍 AI vector index endpoint hit');
  
  try {
    const { client_company_id, data } = req.body;
    
    if (!client_company_id) {
      return sendResponse(res, 400, false, 'Client company ID is required');
    }

    // Simulate vector indexing
    const indexId = uuidv4();
    const vectorData = {
      id: indexId,
      client_company_id,
      indexed_at: new Date().toISOString(),
      data_points: data?.length || 100,
      vector_dimensions: 512,
      status: 'indexed'
    };

    VECTOR_DATA_DB.set(indexId, vectorData);

    sendResponse(res, 200, true, 'Vector indexing completed successfully', vectorData);

  } catch (error) {
    console.error('❌ AI vector index error:', error);
    sendResponse(res, 500, false, 'Vector indexing failed');
  }
});

// Get vector data
app.get('/api/v1/finaid-agent/vector/get', authenticateToken, (req, res) => {
  console.log('📍 Get vector data endpoint hit');
  
  try {
    const { client_company_id } = req.query;
    const vectorData = [];
    
    for (const [vectorId, data] of VECTOR_DATA_DB.entries()) {
      if (!client_company_id || data.client_company_id === client_company_id) {
        vectorData.push(data);
      }
    }

    sendResponse(res, 200, true, 'Vector data retrieved successfully', vectorData);

  } catch (error) {
    console.error('❌ Get vector data error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve vector data');
  }
});

// Clear vector data
app.post('/api/v1/finaid-agent/vector/clear', authenticateToken, (req, res) => {
  console.log('📍 Clear vector data endpoint hit');
  
  try {
    const { client_company_id } = req.body;
    let cleared = 0;
    
    if (client_company_id) {
      // Clear specific client data
      for (const [vectorId, data] of VECTOR_DATA_DB.entries()) {
        if (data.client_company_id === client_company_id) {
          VECTOR_DATA_DB.delete(vectorId);
          cleared++;
        }
      }
    } else {
      // Clear all data
      cleared = VECTOR_DATA_DB.size;
      VECTOR_DATA_DB.clear();
    }

    sendResponse(res, 200, true, `Cleared ${cleared} vector data entries`, {
      cleared_count: cleared
    });

  } catch (error) {
    console.error('❌ Clear vector data error:', error);
    sendResponse(res, 500, false, 'Failed to clear vector data');
  }
});

// Get LangSmith run details
app.get('/api/v1/finaid-agent/langsmith/:runId', authenticateToken, (req, res) => {
  console.log('📍 Get LangSmith run details endpoint hit');
  
  try {
    const { runId } = req.params;
    
    // Mock LangSmith data
    const langsmithData = {
      run_id: runId,
      session_id: `session_${Date.now()}`,
      status: 'completed',
      started_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      completed_at: new Date().toISOString(),
      execution_time_ms: 2450,
      tokens_used: 1250,
      cost_usd: 0.0125,
      model: 'gpt-4-turbo',
      inputs: {
        transactions: 25,
        categories: 8
      },
      outputs: {
        processed_transactions: 25,
        categorized: 23,
        confidence_scores: [0.95, 0.87, 0.92, 0.89, 0.94]
      },
      metadata: {
        client_company_id: '12345',
        processing_type: 'transaction_categorization'
      }
    };

    sendResponse(res, 200, true, 'LangSmith run details retrieved successfully', langsmithData);

  } catch (error) {
    console.error('❌ Get LangSmith run error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve LangSmith run details');
  }
});

// Post agent to QuickBooks
app.post('/api/v1/post-agent/quickbooks', authenticateToken, (req, res) => {
  console.log('📍 Post agent to QuickBooks endpoint hit');
  
  try {
    const { run_id, action, data } = req.body;
    
    if (!run_id) {
      return sendResponse(res, 400, false, 'Run ID is required');
    }

    // Simulate posting to QuickBooks
    const postResult = {
      run_id,
      action: action || 'post_transactions',
      quickbooks_response: {
        posted_transactions: data?.transactions?.length || 15,
        successful: 14,
        failed: 1,
        qb_batch_id: `QB_${Date.now()}`,
        posted_at: new Date().toISOString()
      },
      status: 'completed'
    };

    sendResponse(res, 200, true, 'Successfully posted to QuickBooks', postResult);

  } catch (error) {
    console.error('❌ Post agent to QuickBooks error:', error);
    sendResponse(res, 500, false, 'Failed to post to QuickBooks');
  }
});

// =================== FILE UPLOAD ENDPOINTS ===================

// Upload single file
app.post('/api/v1/upload/document', authenticateToken, upload.single('document'), (req, res) => {
  console.log('📍 Upload document endpoint hit');
  
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, 'No file uploaded');
    }

    const fileData = {
      id: uuidv4(),
      original_name: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploaded_by: req.user.userId,
      uploaded_at: new Date().toISOString(),
      path: req.file.path,
      public_url: `/uploads/${req.file.filename}`
    };

    console.log(`📄 File uploaded: ${req.file.originalname} (${req.file.size} bytes)`);

    sendResponse(res, 200, true, 'File uploaded successfully', fileData);

  } catch (error) {
    console.error('❌ File upload error:', error);
    sendResponse(res, 500, false, 'File upload failed');
  }
});

// Upload multiple files
app.post('/api/v1/upload/documents', authenticateToken, upload.array('documents', 5), (req, res) => {
  console.log('📍 Upload multiple documents endpoint hit');
  
  try {
    if (!req.files || req.files.length === 0) {
      return sendResponse(res, 400, false, 'No files uploaded');
    }

    const uploadedFiles = req.files.map(file => ({
      id: uuidv4(),
      original_name: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      uploaded_by: req.user.userId,
      uploaded_at: new Date().toISOString(),
      path: file.path,
      public_url: `/uploads/${file.filename}`
    }));

    console.log(`📄 ${uploadedFiles.length} files uploaded successfully`);

    sendResponse(res, 200, true, `${uploadedFiles.length} files uploaded successfully`, uploadedFiles);

  } catch (error) {
    console.error('❌ Multiple file upload error:', error);
    sendResponse(res, 500, false, 'File upload failed');
  }
});

// Serve uploaded files
app.get('/uploads/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadsDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.status(404).json({ success: false, message: 'File not found' });
  }
});

// =================== COMPLETE CRUD OPERATIONS ===================

// Update Fin(AI)d profile
app.put('/api/v1/finaid-profiles/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Update finaid profile endpoint hit');
  
  try {
    const { id } = req.params;
    const profileData = FINAID_PROFILES_DB.get(id);
    
    if (!profileData) {
      return sendResponse(res, 404, false, 'Fin(AI)d profile not found');
    }

    const { name, description, category, features } = req.body;

    // Update fields
    if (name) profileData.name = name;
    if (description !== undefined) profileData.description = description;
    if (category) profileData.category = category;
    if (features) profileData.features = features;
    profileData.updated_at = new Date().toISOString();

    FINAID_PROFILES_DB.set(id, profileData);

    sendResponse(res, 200, true, 'Fin(AI)d profile updated successfully', profileData);

  } catch (error) {
    console.error('❌ Update finaid profile error:', error);
    sendResponse(res, 500, false, 'Failed to update Fin(AI)d profile');
  }
});

// Create client
app.post('/api/v1/clients', authenticateToken, (req, res) => {
  console.log('📍 Create client endpoint hit');
  
  try {
    const { name, email, phone, company_id, profile_id } = req.body;
    
    if (!name || !email) {
      return sendResponse(res, 400, false, 'Name and email are required');
    }

    const clientId = uuidv4();
    const newClient = {
      _id: clientId,
      name,
      email,
      phone: phone || null,
      company_id: company_id || null,
      profile_id: profile_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_accountant: req.user.userId,
      status: 'active'
    };

    CLIENTS_DB.set(clientId, newClient);
    console.log(`👤 New client created: ${name}`);

    sendResponse(res, 201, true, 'Client created successfully', newClient);

  } catch (error) {
    console.error('❌ Create client error:', error);
    sendResponse(res, 500, false, 'Failed to create client');
  }
});

// Update client
app.put('/api/v1/clients/:id', authenticateToken, (req, res) => {
  console.log('📍 Update client endpoint hit');
  
  try {
    const { id } = req.params;
    const clientData = CLIENTS_DB.get(id);
    
    if (!clientData) {
      return sendResponse(res, 404, false, 'Client not found');
    }

    const { name, email, phone, company_id, profile_id, status } = req.body;

    // Update fields
    if (name) clientData.name = name;
    if (email) clientData.email = email;
    if (phone !== undefined) clientData.phone = phone;
    if (company_id !== undefined) clientData.company_id = company_id;
    if (profile_id !== undefined) clientData.profile_id = profile_id;
    if (status) clientData.status = status;
    clientData.updated_at = new Date().toISOString();

    CLIENTS_DB.set(id, clientData);

    sendResponse(res, 200, true, 'Client updated successfully', clientData);

  } catch (error) {
    console.error('❌ Update client error:', error);
    sendResponse(res, 500, false, 'Failed to update client');
  }
});

// Create client company
app.post('/api/v1/client-companies', authenticateToken, (req, res) => {
  console.log('📍 Create client company endpoint hit');
  
  try {
    const { company_name, industry, size } = req.body;
    
    if (!company_name) {
      return sendResponse(res, 400, false, 'Company name is required');
    }

    const companyId = uuidv4();
    const newCompany = {
      _id: companyId,
      company_name,
      industry: industry || null,
      size: size || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      owner_id: req.user.userId,
      status: 'active'
    };

    CLIENT_COMPANIES_DB.set(companyId, newCompany);
    console.log(`🏢 New client company created: ${company_name}`);

    sendResponse(res, 201, true, 'Client company created successfully', newCompany);

  } catch (error) {
    console.error('❌ Create client company error:', error);
    sendResponse(res, 500, false, 'Failed to create client company');
  }
});

// Update client company
app.put('/api/v1/client-companies/:id', authenticateToken, (req, res) => {
  console.log('📍 Update client company endpoint hit');
  
  try {
    const { id } = req.params;
    const companyData = CLIENT_COMPANIES_DB.get(id);
    
    if (!companyData) {
      return sendResponse(res, 404, false, 'Client company not found');
    }

    const { company_name, industry, size, status } = req.body;

    // Update fields
    if (company_name) companyData.company_name = company_name;
    if (industry !== undefined) companyData.industry = industry;
    if (size !== undefined) companyData.size = size;
    if (status) companyData.status = status;
    companyData.updated_at = new Date().toISOString();

    CLIENT_COMPANIES_DB.set(id, companyData);

    sendResponse(res, 200, true, 'Client company updated successfully', companyData);

  } catch (error) {
    console.error('❌ Update client company error:', error);
    sendResponse(res, 500, false, 'Failed to update client company');
  }
});

// Get single client company
app.get('/api/v1/client-companies/:id', authenticateToken, (req, res) => {
  console.log('📍 Get single client company endpoint hit');
  
  try {
    const { id } = req.params;
    const companyData = CLIENT_COMPANIES_DB.get(id);
    
    if (!companyData) {
      return sendResponse(res, 404, false, 'Client company not found');
    }

    sendResponse(res, 200, true, 'Client company retrieved successfully', companyData);

  } catch (error) {
    console.error('❌ Get client company error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve client company');
  }
});

// Delete client company
app.delete('/api/v1/client-companies/:id', authenticateToken, authorizeRoles('admin', 'super_admin', 'accounting_firm_owner'), (req, res) => {
  console.log('📍 Delete client company endpoint hit');
  
  try {
    const { id } = req.params;
    const companyData = CLIENT_COMPANIES_DB.get(id);
    
    if (!companyData) {
      return sendResponse(res, 404, false, 'Client company not found');
    }

    CLIENT_COMPANIES_DB.delete(id);
    console.log(`🗑️ Client company deleted: ${companyData.company_name}`);

    sendResponse(res, 200, true, 'Client company deleted successfully', companyData);

  } catch (error) {
    console.error('❌ Delete client company error:', error);
    sendResponse(res, 500, false, 'Failed to delete client company');
  }
});

// =================== ADVANCED SEARCH AND FILTERING ===================

// Advanced search across multiple entities
app.get('/api/v1/search', authenticateToken, (req, res) => {
  console.log('📍 Advanced search endpoint hit');
  
  try {
    const { q, type, limit = 20, offset = 0 } = req.query;
    
    if (!q) {
      return sendResponse(res, 400, false, 'Search query is required');
    }

    const searchQuery = q.toLowerCase();
    const results = {
      users: [],
      clients: [],
      companies: [],
      profiles: [],
      total: 0
    };

    // Search users (if authorized)
    if (!type || type === 'users') {
      if (['super_admin', 'admin'].includes(req.user.user_type)) {
        for (const [userId, userData] of USERS_DB.entries()) {
          if (userData.first_name?.toLowerCase().includes(searchQuery) ||
              userData.last_name?.toLowerCase().includes(searchQuery) ||
              userData.email?.toLowerCase().includes(searchQuery)) {
            results.users.push({
              _id: userData._id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              email: userData.email,
              user_type: userData.user_type,
              status: userData.status
            });
          }
        }
      }
    }

    // Search clients
    if (!type || type === 'clients') {
      for (const [clientId, clientData] of CLIENTS_DB.entries()) {
        if (clientData.name?.toLowerCase().includes(searchQuery) ||
            clientData.email?.toLowerCase().includes(searchQuery)) {
          results.clients.push(clientData);
        }
      }
    }

    // Search companies
    if (!type || type === 'companies') {
      for (const [companyId, companyData] of CLIENT_COMPANIES_DB.entries()) {
        if (companyData.company_name?.toLowerCase().includes(searchQuery) ||
            companyData.industry?.toLowerCase().includes(searchQuery)) {
          results.companies.push(companyData);
        }
      }
    }

    // Search profiles
    if (!type || type === 'profiles') {
      for (const [profileId, profileData] of FINAID_PROFILES_DB.entries()) {
        if (profileData.name?.toLowerCase().includes(searchQuery) ||
            profileData.description?.toLowerCase().includes(searchQuery) ||
            profileData.category?.toLowerCase().includes(searchQuery)) {
          results.profiles.push(profileData);
        }
      }
    }

    results.total = results.users.length + results.clients.length + 
                   results.companies.length + results.profiles.length;

    sendResponse(res, 200, true, `Found ${results.total} results`, results);

  } catch (error) {
    console.error('❌ Advanced search error:', error);
    sendResponse(res, 500, false, 'Search failed');
  }
});

// =================== EMAIL TESTING ENDPOINT ===================

// Send test email
app.post('/api/v1/test/send-email', authenticateToken, authorizeRoles('super_admin', 'admin'), async (req, res) => {
  console.log('📍 Test email endpoint hit');
  
  try {
    const { to, type = 'test' } = req.body;
    
    if (!to) {
      return sendResponse(res, 400, false, 'Recipient email is required');
    }

    let result;
    
    if (type === 'otp') {
      result = await sendOTPEmail(to, '123456');
    } else if (type === 'invitation') {
      result = await sendInvitationEmail(to, 'Test', 'User', 'Admin', 'temp123');
    } else {
      result = await sendEmail(to, 'Test Email from FinAid Hub', 
        '<h2>Test Email</h2><p>This is a test email from your FinAid Hub backend server.</p>'
      );
    }

    if (result.success) {
      sendResponse(res, 200, true, 'Test email sent successfully', result);
    } else {
      sendResponse(res, 500, false, 'Failed to send test email', result);
    }

  } catch (error) {
    console.error('❌ Test email error:', error);
    sendResponse(res, 500, false, 'Test email failed');
  }
});

// Fallback for other API endpoints
app.use('/api/v1', (req, res) => {
  console.log(`📍 Unimplemented API endpoint: ${req.method} ${req.path}`);
  
  // Return a helpful error for unimplemented endpoints
  sendResponse(res, 501, false, `Endpoint ${req.method} ${req.path} is not implemented yet`, {
    endpoint: `${req.method} ${req.path}`,
    note: 'This endpoint is documented but not yet implemented in the backend'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
console.log(`🔧 Attempting to start server on port ${PORT}...`);
console.log(`🔧 Environment: ${NODE_ENV}`);
console.log(`🔧 CORS Origin: ${CORS_ORIGIN}`);

// For Render deployment, listen on all interfaces
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 FinAidHub Backend Server SUCCESSFULLY STARTED!');
  console.log(`📍 Server running on port: ${PORT}`);
  console.log(`📍 Health check: /health`);
  console.log(`📍 API Base: /api/v1`);
  console.log('✅ Server is ready to accept connections!');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log('💡 Trying port 9001...');
    
    const server2 = app.listen(9001, () => {
      console.log('🚀 Server started on backup port 9001');
      console.log(`📍 Server running on: http://localhost:9001`);
      console.log(`📍 Health check: http://localhost:9001/health`);
      console.log(`📍 API Base: http://localhost:9001/api/v1`);
      console.log('✅ Backup server is ready to accept connections!');
    });
    
    server2.on('error', (err2) => {
      console.error('❌ Backup server also failed:', err2);
      console.log('💡 Trying port 9002...');
      
      const server3 = app.listen(9002, () => {
        console.log('🚀 Server started on backup port 9002');
        console.log(`📍 Server running on: http://localhost:9002`);
        console.log(`📍 Health check: http://localhost:9002/health`);
        console.log('✅ Final backup server is ready!');
      });
    });
  }
});

server.on('listening', () => {
  console.log('🎯 Server is now listening for connections!');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

console.log('🔧 Server setup complete, waiting for startup...');