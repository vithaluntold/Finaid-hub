const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { CLIENTS_DB } = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');
const { schemas, validate } = require('../utils/validation');

const router = express.Router();

// Get all clients
router.get('/', authenticateToken, (req, res) => {
  console.log('📍 Get clients endpoint hit');
  
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const clients = Array.from(CLIENTS_DB.values());
    const paginatedClients = clients.slice(offset, offset + limit);
    
    const response = {
      clients: paginatedClients,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(clients.length / limit),
        total_clients: clients.length,
        per_page: limit
      }
    };

    sendResponse(res, 200, true, 'Clients retrieved successfully', response);
  } catch (error) {
    console.error('❌ Get clients error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve clients');
  }
});

// Create new client
router.post('/', authenticateToken, validate(schemas.createClient), (req, res) => {
  console.log('📍 Create client endpoint hit');
  
  try {
    const clientData = req.body;

    // Check if client already exists with same email
    const existingClient = Array.from(CLIENTS_DB.values()).find(client => client.email === clientData.email);
    if (existingClient) {
      return sendResponse(res, 400, false, 'Client with this email already exists');
    }

    const clientId = uuidv4();
    const newClient = {
      _id: clientId,
      ...clientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: req.user.userId
    };

    CLIENTS_DB.set(clientId, newClient);

    console.log(`✅ Client created: ${clientData.email}`);
    sendResponse(res, 201, true, 'Client created successfully', newClient);
  } catch (error) {
    console.error('❌ Create client error:', error);
    sendResponse(res, 500, false, 'Failed to create client');
  }
});

// Get client by ID
router.get('/:id', authenticateToken, (req, res) => {
  console.log('📍 Get client by ID endpoint hit');
  
  try {
    const { id } = req.params;
    const client = CLIENTS_DB.get(id);

    if (!client) {
      return sendResponse(res, 404, false, 'Client not found');
    }

    sendResponse(res, 200, true, 'Client retrieved successfully', client);
  } catch (error) {
    console.error('❌ Get client by ID error:', error);
    sendResponse(res, 500, false, 'Failed to retrieve client');
  }
});

// Update client
router.put('/:id', authenticateToken, validate(schemas.updateClient), (req, res) => {
  console.log('📍 Update client endpoint hit');
  
  try {
    const { id } = req.params;
    const updates = req.body;

    const client = CLIENTS_DB.get(id);
    if (!client) {
      return sendResponse(res, 404, false, 'Client not found');
    }

    const updatedClient = {
      ...client,
      ...updates,
      updated_at: new Date().toISOString()
    };

    CLIENTS_DB.set(id, updatedClient);

    console.log(`✅ Client updated: ${client.email}`);
    sendResponse(res, 200, true, 'Client updated successfully', updatedClient);
  } catch (error) {
    console.error('❌ Update client error:', error);
    sendResponse(res, 500, false, 'Failed to update client');
  }
});

// Delete client
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'super_admin', 'accounting_firm_owner'), (req, res) => {
  console.log('📍 Delete client endpoint hit');
  
  try {
    const { id } = req.params;
    const client = CLIENTS_DB.get(id);

    if (!client) {
      return sendResponse(res, 404, false, 'Client not found');
    }

    CLIENTS_DB.delete(id);

    console.log(`✅ Client deleted: ${client.email}`);
    sendResponse(res, 200, true, 'Client deleted successfully');
  } catch (error) {
    console.error('❌ Delete client error:', error);
    sendResponse(res, 500, false, 'Failed to delete client');
  }
});

module.exports = router;