const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');
const { LICENSING_MASTER_DB } = require('../config/database');

const router = express.Router();

// Get licensing master by profile ID
router.get('/profile-id/:id', (req, res) => {
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

// Get all licensing master entries
router.get('/', authenticateToken, (req, res) => {
  console.log('📍 Get all licensing master endpoint hit');
  
  try {
    const licensingMaster = [];
    
    for (const [masterId, masterData] of LICENSING_MASTER_DB.entries()) {
      licensingMaster.push(masterData);
    }

    sendResponse(res, 200, true, 'Licensing master data retrieved successfully', licensingMaster);

  } catch (error) {
    console.error('❌ Get licensing master error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve licensing master data');
  }
});

// Create new licensing master entry
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Create licensing master endpoint hit');
  
  try {
    const { finaid_profile_id, license_type, price, duration, features } = req.body;
    
    if (!finaid_profile_id || !license_type) {
      return sendResponse(res, 400, false, 'Profile ID and license type are required');
    }

    const masterId = uuidv4();
    const newMaster = {
      _id: masterId,
      finaid_profile_id,
      license_type,
      price: price || 0,
      duration: duration || 'monthly',
      features: features || [],
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: req.user.userId
    };

    LICENSING_MASTER_DB.set(masterId, newMaster);
    console.log(`📊 New licensing master created for profile: ${finaid_profile_id}`);

    sendResponse(res, 201, true, 'Licensing master created successfully', newMaster);

  } catch (error) {
    console.error('❌ Create licensing master error:', error);
    sendResponse(res, 500, false, 'Failed to create licensing master');
  }
});

// Update licensing master entry
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Update licensing master endpoint hit');
  
  try {
    const { id } = req.params;
    const masterData = LICENSING_MASTER_DB.get(id);
    
    if (!masterData) {
      return sendResponse(res, 404, false, 'Licensing master not found');
    }

    const { license_type, price, duration, features, status } = req.body;

    // Update fields
    if (license_type) masterData.license_type = license_type;
    if (price !== undefined) masterData.price = price;
    if (duration) masterData.duration = duration;
    if (features) masterData.features = features;
    if (status) masterData.status = status;
    masterData.updated_at = new Date().toISOString();

    LICENSING_MASTER_DB.set(id, masterData);

    sendResponse(res, 200, true, 'Licensing master updated successfully', masterData);

  } catch (error) {
    console.error('❌ Update licensing master error:', error);
    sendResponse(res, 500, false, 'Failed to update licensing master');
  }
});

// Delete licensing master entry
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
  console.log('📍 Delete licensing master endpoint hit');
  
  try {
    const { id } = req.params;
    const masterData = LICENSING_MASTER_DB.get(id);
    
    if (!masterData) {
      return sendResponse(res, 404, false, 'Licensing master not found');
    }

    LICENSING_MASTER_DB.delete(id);
    console.log(`🗑️ Licensing master deleted: ${id}`);

    sendResponse(res, 200, true, 'Licensing master deleted successfully', masterData);

  } catch (error) {
    console.error('❌ Delete licensing master error:', error);
    sendResponse(res, 500, false, 'Failed to delete licensing master');
  }
});

module.exports = router;
