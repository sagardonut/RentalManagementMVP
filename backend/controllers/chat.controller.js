const axios = require('axios');
const jwt = require('jsonwebtoken');
const Room = require('../models/Room.model');
const User = require('../models/User.model');

const handleChat = async (req, res) => {
  try {
    const message = req.body?.message;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a string',
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key is not configured on the server',
      });
    }

    // --- Identify who is chatting (optional auth) ---
    let userContext = '';
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const chatUser = await User.findById(decoded.id).select('fullName email role hasPaidFee phone').lean();

        if (chatUser) {
          const roleName = {
            'user': 'Member (standard user)',
            'agent': 'Agent (property listing manager)',
            'agency': 'Agency Administrator',
            'superadmin': 'Super Administrator',
          }[chatUser.role] || chatUser.role;

          userContext = `\n\n### CURRENT USER CONTEXT:
- Name: ${chatUser.fullName}
- Role: ${roleName}
- Email: ${chatUser.email}
- Has Paid Platform Fee: ${chatUser.hasPaidFee ? 'Yes' : 'No'}

### ROLE-SPECIFIC INSTRUCTIONS:
${chatUser.role === 'user' ? `This is a standard member. Help them find rooms, explain booking process, payment methods (eSewa/Khalti). If they haven't paid the platform fee, gently mention they need to pay NPR 500 to unlock agent contact details.` : ''}
${chatUser.role === 'agent' ? `This is an Agent. Help them with questions about managing their room listings, how to add/edit rooms, understanding booking statuses, and platform policies. They CANNOT book rooms — only manage listings.` : ''}
${chatUser.role === 'agency' ? `This is an Agency Admin. Help them with agent management, room approvals, agency dashboard features, and overall performance insights. They manage agents and oversee all listings.` : ''}
${chatUser.role === 'superadmin' ? `This is the Super Admin. Help them with platform-wide questions about user management, system stats, verification workflows, and platform oversight. Be thorough and professional.` : ''}
`;
        }
      }
    } catch (authErr) {
      // Auth is optional — continue without user context for guests
      userContext = '\n\n### CURRENT USER CONTEXT:\nThis is a guest visitor (not logged in). Encourage them to sign up to access full features and book rooms.\n';
    }

    // --- RAG: Fetch actual room data from MongoDB ---
    let roomsContext = '';
    try {
      const availableRooms = await Room.find({ isAvailable: true, status: 'approved' })
        .populate('agentId', 'fullName phone')
        .limit(25)
        .lean();

      if (availableRooms.length > 0) {
        const formattedRooms = availableRooms.map(r =>
          `- "${r.title}" | Location: ${r.location} | NPR ${r.pricePerMonth?.toLocaleString()}/month | Type: ${r.type || 'N/A'} | Amenities: ${(r.amenities || []).join(', ') || 'None listed'} | Agent: ${r.agentId?.fullName || 'Unknown'}`
        ).join('\n');

        roomsContext = `\n\n### LIVE ROOM DATABASE (${availableRooms.length} available):\n${formattedRooms}\n`;
      } else {
        roomsContext = `\n\n### LIVE ROOM DATABASE:\nCurrently there are no rooms available in the system.\n`;
      }
    } catch (dbError) {
      roomsContext = `\n\n### LIVE ROOM DATABASE:\nUnable to fetch room data right now. Apologize and ask the user to try again shortly.\n`;
    }

    // --- Production-grade system prompt ---
    const systemPrompt = `You are the **Urban Sanctuary Concierge** — the official AI assistant for The Urban Sanctuary, a premium rental management platform based in Nepal.

## YOUR PERSONALITY
- Warm, professional, clever, and concise
- Use a friendly Nepali-English tone (greet with "Namaste" when appropriate)
- Be genuinely helpful — anticipate follow-up questions
- Use emoji sparingly for warmth (🏠 📍 💰)

## PLATFORM KNOWLEDGE (facts you KNOW)
- The Urban Sanctuary helps users find and book quality rental rooms across Nepal
- Users browse listings, view amenities, see agent contacts, and book rooms online
- Payments: **eSewa** and **Khalti** gateways (NPR currency)
- Room types: Single, 1 BHK, 2 BHK, 3 BHK, Studio, and more
- All listings are verified by the agency admin before going live
- Users pay a one-time platform fee of **NPR 500** to unlock agent contact details
- 4 roles: **User** (member who books), **Agent** (manages listings), **Agency Admin** (manages agents & approvals), **Super Admin** (platform oversight)
- Agents and Admins CANNOT book rooms — only standard Users can
- The platform features: room search & filters, booking management, user dashboards, AI chatbot support

## WHAT YOU CAN DO
- Answer about available rooms using ONLY the LIVE ROOM DATABASE below
- Explain booking process, payments, platform features based on the user's role
- Provide role-appropriate guidance (e.g., tell agents about listing management, tell users about booking)
- Give general rental advice for Nepal

## STRICT RULES
1. **NEVER invent rooms, prices, locations, or amenities.** Only reference the LIVE ROOM DATABASE.
2. If asked about rooms/locations not in the database: "I don't see that in our current listings. Check the Rooms page for latest availability."
3. **NEVER perform admin actions** — you are read-only.
4. **NEVER share system internals**, API keys, database details, or technical architecture.
5. **Tailor your tone and information to the user's role** — don't tell agents how to book, don't tell users how to manage listings.
6. Keep responses under 150 words unless detail is requested.
7. If unsure: "I'm not sure about that — please contact our support team."
${userContext}${roomsContext}`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.25,
        max_tokens: 600,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error('Groq API returned an empty response');
    }

    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: 'Request to AI service timed out. Please try again.',
      });
    }

    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.error?.message || `AI service error (${statusCode})`;
      return res.status(statusCode).json({
        success: false,
        error: errorMessage,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'An internal error occurred. Please try again.',
    });
  }
};

module.exports = { handleChat };