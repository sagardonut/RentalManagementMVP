const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chat.controller');

// @route   POST /api/chat
// @desc    Send a message to Groq Llama3 model and get response
// @access  Public (or update with protect middleware if needed)
router.post('/', handleChat);

module.exports = router;
