const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendMessage, getHistory, getSuggestions, clearHistory } = require('../controllers/chatbot.controller');

// ─── Optional Auth Middleware ─────────────────────────────────
// Unlike `protect`, this middleware does NOT reject unauthenticated requests.
// It attaches req.user if a valid token exists, otherwise continues as anonymous.
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer')) {
      const token = authHeader.split(' ')[1];
      
      if (token && process.env.JWT_SECRET) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user) {
          req.user = user;
        }
      }
    }
  } catch (error) {
    // Token invalid or expired — continue as anonymous, don't block the request
    req.user = null;
  }
  
  next();
};

// ─── Routes ───────────────────────────────────────────────────

// POST /api/chatbot/message — Send a message to the AI
router.post('/message', optionalAuth, sendMessage);

// GET /api/chatbot/history — Get chat history
router.get('/history', optionalAuth, getHistory);

// GET /api/chatbot/suggestions — Get quick suggestion chips
router.get('/suggestions', optionalAuth, getSuggestions);

// POST /api/chatbot/clear — Clear chat history
router.post('/clear', optionalAuth, clearHistory);

module.exports = router;
