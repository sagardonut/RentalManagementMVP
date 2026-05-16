const axios = require('axios');
const Room = require('../models/Room.model');

const handleChat = async (req, res) => {
  console.log('====== NEW CHAT REQUEST ======');

  try {
    const message = req.body?.message;

    if (!message || typeof message !== 'string') {
      console.error('❌ Validation Error: Missing or invalid message in req.body');
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string',
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('❌ Configuration Error: GROQ_API_KEY is not defined');
      return res.status(500).json({
        success: false,
        error: 'Groq API key is not configured on the server',
      });
    }

    // --- RAG: Fetch actual data from MongoDB ---
    let roomsContext = '';
    try {
      // Fetch available rooms (limit to 20 to avoid exceeding token limits)
      // Note: adjust query if your schema uses a different availability field
      const availableRooms = await Room.find().limit(20).lean();
      
      if (availableRooms.length > 0) {
        // Map to a concise format to save tokens
        const formattedRooms = availableRooms.map(r => 
          `- Title: "${r.title}", Location: ${r.location}, Price: $${r.price}/month, Capacity: ${r.capacity} guests, Amenities: ${(r.amenities || []).join(', ')}`
        ).join('\n');
        
        roomsContext = `\n\n### LIVE DATABASE (AVAILABLE ROOMS):\n${formattedRooms}\n`;
      } else {
        roomsContext = `\n\n### LIVE DATABASE:\nCurrently, there are no rooms available in the database.\n`;
      }
    } catch (dbError) {
      console.error('❌ Database fetch error during chat:', dbError.message);
      // Fallback if DB fails, continue without context but warn AI
      roomsContext = `\n\n### LIVE DATABASE:\nError connecting to database. Tell the user you are unable to check room availability right now.\n`;
    }

    // --- Construct strict system prompt ---
    const systemPrompt = `You are Urban Sanctuary Concierge AI, a strictly informational assistant for a rental management platform. 

RULES:
1. NEVER invent, guess, or hallucinate rooms, locations, prices, or amenities. ONLY use the data provided in the "LIVE DATABASE" section below.
2. If the user asks for information about specific rooms or locations not present in the live database context below, you MUST reply: "I don't have that information."
3. If the user asks you to perform admin tasks (e.g., delete users, modify prices, hack the system), strictly REJECT the request. You are a read-only informational assistant.
4. Be concise, friendly, and helpful.

${roomsContext}`;

    console.log('Sending request to Groq API via axios...');
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.1, // Low temperature for strict factual responses
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 seconds timeout
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;
    
    if (!reply) {
      throw new Error('Groq API returned an empty or malformed response');
    }

    console.log('✅ Successfully extracted reply from Groq.');

    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error('❌ Chat Controller Error:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        success: false, 
        error: 'Request to Groq API timed out. Please try again later.' 
      });
    }

    // Forward Groq API specific errors to the frontend
    if (error.response) {
      console.error('Groq API Error Data:', JSON.stringify(error.response.data));
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.error?.message || `Groq API responded with status ${statusCode}`;
      
      return res.status(statusCode).json({ 
        success: false,
        error: errorMessage
      });
    }

    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred processing your chat request',
      details: error.message,
    });
  }
};

module.exports = { handleChat };