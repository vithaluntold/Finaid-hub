const jwt = require('jsonwebtoken');
const { TOKENS_DB } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

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

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  authorizeRoles
};