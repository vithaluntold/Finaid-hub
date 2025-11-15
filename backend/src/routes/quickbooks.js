const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');

const router = express.Router();

// QuickBooks routes placeholders
router.get('/auth', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'QuickBooks auth endpoint working', { endpoint: 'quickbooks auth' });
});

router.post('/callback', (req, res) => {
  sendResponse(res, 200, true, 'QuickBooks callback endpoint working', { endpoint: 'quickbooks callback' });
});

router.get('/companies', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'QuickBooks companies endpoint working', { endpoint: 'quickbooks companies' });
});

router.get('/customers', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'QuickBooks customers endpoint working', { endpoint: 'quickbooks customers' });
});

router.get('/items', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'QuickBooks items endpoint working', { endpoint: 'quickbooks items' });
});

router.get('/transactions', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'QuickBooks transactions endpoint working', { endpoint: 'quickbooks transactions' });
});

router.post('/disconnect', authenticateToken, (req, res) => {
  sendResponse(res, 200, true, 'QuickBooks disconnect endpoint working', { endpoint: 'quickbooks disconnect' });
});

module.exports = router;