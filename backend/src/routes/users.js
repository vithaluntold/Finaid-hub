const express = require('express');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { USERS_DB } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendResponse, generateRandomPassword } = require('../utils/helpers');
const { schemas, validate } = require('../utils/validation');

const router = express.Router();

// Get all users (Admin/Super Admin only)
router.get('/', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Get users endpoint hit');
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Convert Map to Array and exclude passwords
    const users = Array.from(USERS_DB.values()).map(user => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_type: user.user_type,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at
    }));

    const paginatedUsers = users.slice(offset, offset + limit);
    
    const response = {
      users: paginatedUsers,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(users.length / limit),
        total_users: users.length,
        per_page: limit
      }
    };

    sendResponse(res, 200, true, 'Users retrieved successfully', response);
  } catch (error) {
    console.error('❌ Get users error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve users');
  }
});

// Create new user (Admin/Super Admin only)
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), validate(schemas.createUser), async (req, res) => {
  console.log('📍 Create user endpoint hit');
  
  try {
    const { first_name, last_name, email, user_type, department } = req.body;

    // Check if user already exists
    const existingUser = Array.from(USERS_DB.values()).find(user => user.email === email);
    if (existingUser) {
      return sendResponse(res, 400, false, 'User with this email already exists');
    }

    // Generate temporary password
    const temporaryPassword = generateRandomPassword();
    const hashedPassword = await bcryptjs.hash(temporaryPassword, 12);

    // Create new user
    const userId = uuidv4();
    const newUser = {
      _id: userId,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      user_type,
      department: department || null,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: req.user.userId
    };

    USERS_DB.set(userId, newUser);

    // Return user without password
    const userResponse = {
      _id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      user_type: newUser.user_type,
      status: newUser.status,
      temporary_password: temporaryPassword, // Send once for initial login
      created_at: newUser.created_at
    };

    console.log(`✅ User created: ${email}`);
    sendResponse(res, 201, true, 'User created successfully', userResponse);
  } catch (error) {
    console.error('❌ Create user error:', error);
    sendResponse(res, 500, false, 'Failed to create user');
  }
});


// Get all accounting firm owners (Admin/Super Admin only) - MUST be before /:id route
router.get('/accounting-owner', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Get accounting firm owners endpoint hit');
  
  try {
    // Filter users by accounting_firm_owner type
    const accountingOwners = Array.from(USERS_DB.values())
      .filter(user => user.user_type === 'accounting_firm_owner')
      .map(user => ({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: user.mobile || '',
        user_type: user.user_type,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at
      }));

    console.log(`✅ Found ${accountingOwners.length} accounting firm owners`);
    sendResponse(res, 200, true, 'Accounting firm owners retrieved successfully', accountingOwners);
  } catch (error) {
    console.error('❌ Get accounting firm owners error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve accounting firm owners');
  }
});

// Get user by ID
router.get('/:id', authenticateToken, (req, res) => {
  console.log('📍 Get user by ID endpoint hit');
  
  try {
    const { id } = req.params;
    const user = USERS_DB.get(id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Check authorization (users can only see their own data unless admin)
    if (req.user.userId !== id && !['admin', 'super_admin'].includes(req.user.user_type)) {
      return sendResponse(res, 403, false, 'Access denied');
    }

    const userResponse = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_type: user.user_type,
      status: user.status,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    sendResponse(res, 200, true, 'User retrieved successfully', userResponse);
  } catch (error) {
    console.error('❌ Get user by ID error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve user');
  }
});

// Update user
router.put('/:id', authenticateToken, validate(schemas.updateUser), async (req, res) => {
  console.log('📍 Update user endpoint hit');
  
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = USERS_DB.get(id);
    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Check authorization
    if (req.user.userId !== id && !['admin', 'super_admin'].includes(req.user.user_type)) {
      return sendResponse(res, 403, false, 'Access denied');
    }

    // Update user data
    const updatedUser = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString()
    };

    USERS_DB.set(id, updatedUser);

    const userResponse = {
      _id: updatedUser._id,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      user_type: updatedUser.user_type,
      status: updatedUser.status,
      updated_at: updatedUser.updated_at
    };

    console.log(`✅ User updated: ${user.email}`);
    sendResponse(res, 200, true, 'User updated successfully', userResponse);
  } catch (error) {
    console.error('❌ Update user error:', error);
    sendResponse(res, 500, false, 'Failed to update user');
  }
});

// Delete user (Admin/Super Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Delete user endpoint hit');
  
  try {
    const { id } = req.params;
    const user = USERS_DB.get(id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Prevent self-deletion
    if (req.user.userId === id) {
      return sendResponse(res, 400, false, 'Cannot delete your own account');
    }

    USERS_DB.delete(id);

    console.log(`✅ User deleted: ${user.email}`);
    sendResponse(res, 200, true, 'User deleted successfully');
  } catch (error) {
    console.error('❌ Delete user error:', error);
    sendResponse(res, 500, false, 'Failed to delete user');
  }
});

module.exports = router;