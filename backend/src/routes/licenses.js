const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');

const router = express.Router();

// License routes placeholder
router.get('/', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'Licenses endpoint working', { endpoint: 'licenses' });
});

router.post('/', authenticateToken, (req, res) => {
  sendResponse(res, 201, true, 'License creation endpoint working', { endpoint: 'create license' });
});

module.exports = router;