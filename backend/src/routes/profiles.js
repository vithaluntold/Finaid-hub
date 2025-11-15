const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');

const router = express.Router();

// Profile routes placeholder
router.get('/:id', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'Profile endpoint working', { endpoint: 'profile', id: req.params.id });
});

router.put('/:id', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'Profile update endpoint working', { endpoint: 'profile update', id: req.params.id });
});

module.exports = router;