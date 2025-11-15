const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');
const { FINAID_PROFILES_DB } = require('../config/database');

const router = express.Router();

// Get all Fin(AI)d profiles
router.get('/', (req, res) => {
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
router.get('/filter', (req, res) => {
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
router.post('/', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
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

// Update Fin(AI)d profile
router.put('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
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

// Delete Fin(AI)d profile
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin'), (req, res) => {
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

module.exports = router;
