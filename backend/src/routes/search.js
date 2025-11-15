const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { sendResponse } = require('../utils/helpers');
const { USERS_DB, CLIENTS_DB } = require('../config/database');

const router = express.Router();

// Search endpoint
router.get('/', authenticateToken, (req, res) => {
  console.log('📍 Search endpoint hit');
  
  try {
    const { query, type = 'all', page = 1, limit = 10 } = req.query;

    if (!query) {
      return sendResponse(res, 400, false, 'Search query is required');
    }

    const searchQuery = query.toLowerCase();
    const results = {
      users: [],
      clients: []
    };

    // Search users
    if (type === 'all' || type === 'users') {
      const users = Array.from(USERS_DB.values())
        .filter(user => 
          user.first_name.toLowerCase().includes(searchQuery) ||
          user.last_name.toLowerCase().includes(searchQuery) ||
          user.email.toLowerCase().includes(searchQuery)
        )
        .map(user => ({
          _id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          user_type: user.user_type,
          type: 'user'
        }));
      
      results.users = users;
    }

    // Search clients
    if (type === 'all' || type === 'clients') {
      const clients = Array.from(CLIENTS_DB.values())
        .filter(client => 
          client.name.toLowerCase().includes(searchQuery) ||
          client.email.toLowerCase().includes(searchQuery)
        )
        .map(client => ({
          _id: client._id,
          name: client.name,
          email: client.email,
          type: 'client'
        }));
      
      results.clients = clients;
    }

    const totalResults = results.users.length + results.clients.length;

    sendResponse(res, 200, true, 'Search completed successfully', {
      query,
      results,
      total_results: totalResults,
      search_type: type
    });

  } catch (error) {
    console.error('❌ Search error:', error);
    sendResponse(res, 500, false, 'Search failed');
  }
});

module.exports = router;