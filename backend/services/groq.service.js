const Groq = require('groq-sdk');
const Room = require('../models/Room.model');
const Booking = require('../models/Booking.model');
const User = require('../models/User.model');

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const MODEL_NAME = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const SITE_MAP = {
  public: [
    { label: 'Browse rooms', path: '/rooms' },
    { label: 'Sign in', path: '/signin' },
    { label: 'Create account', path: '/signup' },
    { label: 'Agent sign in', path: '/agent/signin' },
    { label: 'Agency sign in', path: '/agency/signin' },
  ],
  user: [
    { label: 'User dashboard', path: '/user/dashboard' },
    { label: 'Browse rooms', path: '/rooms' },
    { label: 'Payment setup', path: '/payment-setup' },
  ],
  agent: [
    { label: 'Agent dashboard', path: '/agent/dashboard' },
    { label: 'Add or manage listings', path: '/agent/dashboard' },
  ],
  agency: [
    { label: 'Agency dashboard', path: '/admin/agency' },
    { label: 'Manage agents', path: '/admin/agency' },
  ],
  admin: [
    { label: 'SuperAdmin dashboard', path: '/admin/super' },
    { label: 'Room verification', path: '/admin/super' },
  ],
};

const BRAND_IDENTITY = `
You are Sanctuary AI, the website assistant for The Urban Sanctuary, a rental management platform in Kathmandu, Nepal.

Your job is to be practically useful on this website:
- Help visitors find relevant rooms by location, budget, amenities, and next action.
- Explain booking flow, payment options, account setup, and dashboard tasks.
- For logged-in users, use only their permitted role-scoped information.
- For admins, summarize aggregate platform data and workflow guidance.
- Give direct next steps and mention relevant site paths when useful.

Style:
- Be concise, warm, and specific.
- Use the live platform data provided. Do not invent listings, prices, counts, booking statuses, users, agents, or agencies.
- Ask one focused follow-up question only when it is needed to narrow room recommendations.
- Do not claim you completed bookings, payments, account changes, verification, or edits. Direct users to the correct page instead.
- Never reveal secrets, passwords, raw database internals, API keys, or implementation details.
`;

function roleInstructions(role, userData = null) {
  switch (role) {
    case 'admin':
    case 'superadmin':
      return `Current user: SuperAdmin ${userData?.fullName || 'Admin'}.
Access: aggregate platform and admin workflow guidance. Help with room verification, agencies, agents, bookings, and dashboard interpretation.`;
    case 'agency':
      return `Current user: Agency Admin ${userData?.fullName || 'Agency'}.
Access: agency-scoped guidance. Help with agent management, agency listings, and performance. Do not discuss other agencies.`;
    case 'agent':
      return `Current user: Agent ${userData?.fullName || 'Agent'}.
Access: own listings and booking guidance. Help improve listings, pricing, descriptions, photos, and verification readiness.`;
    case 'user':
      return `Current user: Registered renter ${userData?.fullName || 'User'}.
Access: own booking data and public listings. Help find rooms, explain payments, and guide dashboard use.`;
    default:
      return `Current user: Guest.
Access: public information only. Help with room discovery, sign up, sign in, and general platform questions.`;
  }
}

async function fetchContextData(role, userId = null, message = '') {
  const context = {};
  const filters = parseRoomFilters(message);

  try {
    const publicRoomQuery = { isVerified: true };
    const matchingRoomQuery = { ...publicRoomQuery };

    if (filters.maxPrice) {
      matchingRoomQuery.pricePerMonth = { $lte: filters.maxPrice };
    }

    if (filters.location) {
      matchingRoomQuery.location = { $regex: filters.location, $options: 'i' };
    }

    if (filters.amenities.length) {
      matchingRoomQuery.amenities = { $all: filters.amenities.map((amenity) => new RegExp(amenity, 'i')) };
    }

    const [totalRooms, verifiedRooms, locations, priceRange, matchingRooms, recentRooms] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments(publicRoomQuery),
      Room.distinct('location', publicRoomQuery),
      Room.aggregate([
        { $match: publicRoomQuery },
        { $group: { _id: null, min: { $min: '$pricePerMonth' }, max: { $max: '$pricePerMonth' }, avg: { $avg: '$pricePerMonth' } } },
      ]),
      Room.find(matchingRoomQuery)
        .select('title description location pricePerMonth amenities images isVerified')
        .sort({ pricePerMonth: 1, createdAt: -1 })
        .limit(8)
        .lean(),
      Room.find(publicRoomQuery)
        .select('title location pricePerMonth amenities')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    context.platform = {
      name: 'The Urban Sanctuary',
      totalListings: totalRooms,
      verifiedListings: verifiedRooms,
      locations,
      priceRange: priceRange[0]
        ? {
            min: priceRange[0].min,
            max: priceRange[0].max,
            avg: Math.round(priceRange[0].avg),
          }
        : null,
      paymentMethods: ['eSewa', 'Khalti'],
      bookingPathPattern: '/booking/:roomId',
      siteMap: getRoleSiteMap(role),
    };

    context.roomSearch = {
      detectedFilters: filters,
      matchingRooms: matchingRooms.map(formatRoomForContext),
      recentVerifiedRooms: recentRooms.map(formatRoomForContext),
    };

    if (role === 'superadmin' || role === 'admin') {
      const [totalUsers, totalBookings, usersByRole, recentBookings, pendingRooms] = await Promise.all([
        User.countDocuments(),
        Booking.countDocuments(),
        User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
        Booking.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
        Room.countDocuments({ isVerified: false }),
      ]);

      context.admin = {
        totalUsers,
        totalBookings,
        usersByRole: Object.fromEntries(usersByRole.map((r) => [r._id, r.count])),
        bookingsLast7Days: recentBookings,
        pendingRoomVerifications: pendingRooms,
      };
    }

    if (role === 'agency' && userId) {
      const agentIds = await User.find({ agencyId: userId, role: 'agent' }).select('_id fullName email').lean();
      const rooms = await Room.find({ agentId: { $in: agentIds.map((agent) => agent._id) } })
        .select('title location pricePerMonth isVerified agentId')
        .lean();

      context.agency = {
        agents: agentIds.map((agent) => ({ id: agent._id, name: agent.fullName, email: agent.email })),
        totalAgents: agentIds.length,
        totalRooms: rooms.length,
        verifiedRooms: rooms.filter((room) => room.isVerified).length,
        rooms: rooms.slice(0, 10).map(formatRoomForContext),
      };
    }

    if (role === 'agent' && userId) {
      const agentRooms = await Room.find({ agentId: userId })
        .select('title location pricePerMonth amenities isVerified description')
        .sort({ createdAt: -1 })
        .lean();
      const agentBookings = await Booking.countDocuments({ roomId: { $in: agentRooms.map((room) => room._id) } });

      context.agent = {
        totalRooms: agentRooms.length,
        verifiedRooms: agentRooms.filter((room) => room.isVerified).length,
        pendingRooms: agentRooms.filter((room) => !room.isVerified).length,
        totalBookings: agentBookings,
        rooms: agentRooms.slice(0, 10).map(formatRoomForContext),
      };
    }

    if (role === 'user' && userId) {
      const userBookings = await Booking.find({ userId })
        .populate('roomId', 'title location pricePerMonth')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      context.user = {
        recentBookings: userBookings.map((booking) => ({
          room: booking.roomId?.title,
          location: booking.roomId?.location,
          amount: booking.totalAmount,
          status: booking.status,
          paymentMethod: booking.paymentMethod,
          date: booking.createdAt,
        })),
      };
    }
  } catch (err) {
    console.error('Chatbot context fetch error:', err.message);
  }

  return context;
}

async function chat(message, conversationHistory = [], role = 'anonymous', userData = null, userId = null) {
  let contextData = {};

  try {
    contextData = await fetchContextData(role, userId, message);

    if (!groq) {
      return {
        success: true,
        reply: buildFallbackReply(message, contextData, role),
        provider: 'local',
      };
    }

    const messages = [
      {
        role: 'system',
        content: `${BRAND_IDENTITY}\n\n${roleInstructions(role, userData)}\n\nLive website data:\n${JSON.stringify(contextData, null, 2)}`,
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages,
      temperature: 0.35,
      top_p: 0.9,
      max_completion_tokens: 700,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim();

    return {
      success: true,
      reply: reply || buildFallbackReply(message, contextData, role),
      provider: 'groq',
      model: MODEL_NAME,
    };
  } catch (error) {
    console.error('Groq API Error:', error.message);
    return {
      success: true,
      reply: buildFallbackReply(message, contextData, role),
      provider: 'local',
    };
  }
}

function getQuickSuggestions(role) {
  const common = [
    'Find rooms under NPR 30,000',
    'Which Kathmandu area should I choose?',
    'How does booking work?',
  ];

  switch (role) {
    case 'admin':
    case 'superadmin':
      return ['Show platform snapshot', 'What rooms need verification?', 'Summarize bookings this week', ...common];
    case 'agency':
      return ['How is my agency doing?', 'How can I manage agents?', 'Show agency listing tips', ...common];
    case 'agent':
      return ['How can I improve my listings?', 'Which listings are pending?', 'Suggest a better room description', ...common];
    case 'user':
      return ['Show my recent bookings', 'Find rooms near Thamel under NPR 35,000', 'Explain payment options', ...common];
    default:
      return ['Find rooms near Thamel', 'What is The Urban Sanctuary?', 'How do I sign up?', ...common];
  }
}

function parseRoomFilters(message) {
  const text = message.toLowerCase();
  const knownLocations = ['thamel', 'lazimpat', 'baneshwor', 'baluwatar', 'jhamsikhel', 'naxal', 'patan', 'kupondole'];
  const knownAmenities = ['wifi', 'parking', 'kitchen', 'balcony', 'garden', 'rooftop', 'furnished'];
  const budgetMatch = text.match(/(?:under|below|less than|max|budget|up to)\s*(?:npr|rs\.?|रु)?\s*([0-9][0-9,]*(?:k)?)/i)
    || text.match(/([0-9][0-9,]*(?:k)?)\s*(?:npr|rs\.?|रु)?/i);

  return {
    location: knownLocations.find((location) => text.includes(location)) || null,
    maxPrice: budgetMatch ? parseBudget(budgetMatch[1]) : null,
    amenities: knownAmenities.filter((amenity) => text.includes(amenity)),
  };
}

function parseBudget(value) {
  const normalized = String(value).replace(/,/g, '').toLowerCase();
  if (normalized.endsWith('k')) {
    return Number(normalized.slice(0, -1)) * 1000;
  }
  return Number(normalized);
}

function formatRoomForContext(room) {
  return {
    id: room._id,
    title: room.title,
    location: room.location,
    pricePerMonth: room.pricePerMonth,
    amenities: room.amenities || [],
    isVerified: room.isVerified,
    description: room.description ? room.description.slice(0, 220) : undefined,
    bookingPath: room._id ? `/booking/${room._id}` : undefined,
  };
}

function getRoleSiteMap(role) {
  if (role === 'superadmin') return SITE_MAP.admin;
  return SITE_MAP[role] || SITE_MAP.public;
}

function formatPrice(value) {
  return value ? `NPR ${Number(value).toLocaleString()}` : 'price on request';
}

function roomListReply(rooms) {
  return rooms.slice(0, 4).map((room) => (
    `- **${room.title}** in ${room.location} for ${formatPrice(room.pricePerMonth)}/mo. Open ${room.bookingPath || '/rooms'} to continue.`
  )).join('\n');
}

function buildFallbackReply(message, contextData, role) {
  const lowerMessage = message.toLowerCase();
  const roomSearch = contextData.roomSearch || {};
  const matchingRooms = roomSearch.matchingRooms || [];
  const recentRooms = roomSearch.recentVerifiedRooms || [];
  const platform = contextData.platform || {};

  if (lowerMessage.includes('book') || lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
    return `To book a room, open a listing from **/rooms**, choose the booking option, then pay through **eSewa** or **Khalti**. If you already booked, check your dashboard for the latest status.`;
  }

  if (lowerMessage.includes('sign up') || lowerMessage.includes('register') || lowerMessage.includes('account')) {
    return `Create a renter account at **/signup**. Agents can use **/agent/signup**, while existing agencies and admins should use their dedicated sign-in pages.`;
  }

  if (lowerMessage.includes('agent') && (role === 'agent' || lowerMessage.includes('listing'))) {
    const agent = contextData.agent;
    if (agent) {
      return `You have **${agent.totalRooms}** listings, with **${agent.verifiedRooms}** verified and **${agent.pendingRooms}** pending. Use **/agent/dashboard** to update photos, pricing, amenities, and descriptions.`;
    }

    return 'Agents can manage listings from **/agent/dashboard**. Strong listings usually include clear photos, exact location, monthly price, amenities, and a practical description.';
  }

  if (lowerMessage.includes('stat') || lowerMessage.includes('snapshot') || lowerMessage.includes('verification')) {
    if (role !== 'superadmin' && role !== 'admin') {
      return 'Platform-wide stats are available only to admins, but I can still help you with public listings, booking steps, and your own dashboard.';
    }

    const admin = contextData.admin || {};
    return `Platform snapshot: **${platform.totalListings || 0}** total listings, **${platform.verifiedListings || 0}** verified, **${admin.pendingRoomVerifications || 0}** pending verification, **${admin.totalBookings || 0}** total bookings, and **${admin.bookingsLast7Days || 0}** bookings in the last 7 days.`;
  }

  if (lowerMessage.includes('neighborhood') || lowerMessage.includes('area') || lowerMessage.includes('location')) {
    const locations = (platform.locations || []).slice(0, 8);
    return `Current verified listings cover ${locations.length ? locations.join(', ') : 'popular Kathmandu areas'}. Thamel is convenient and active, Lazimpat and Baluwatar are calmer, Baneshwor is practical for commuting, and Jhamsikhel is strong for cafes and lifestyle. What budget should I filter by?`;
  }

  if (lowerMessage.includes('room') || lowerMessage.includes('rent') || lowerMessage.includes('find') || lowerMessage.includes('available') || lowerMessage.includes('under')) {
    const rooms = matchingRooms.length ? matchingRooms : recentRooms;

    if (!rooms.length) {
      return 'I do not see verified rooms matching that yet. Try browsing **/rooms**, or tell me your preferred area, max monthly budget, and any must-have amenities.';
    }

    return `I found these verified options:\n\n${roomListReply(rooms)}\n\nWant me to narrow this by location, budget, or amenities like parking, kitchen, or balcony?`;
  }

  return `I can help with room discovery, booking steps, payments, sign-up, and dashboard tasks. Try asking something like “Find rooms under NPR 30,000 near Thamel” or “How do I book a room?”`;
}

module.exports = { chat, getQuickSuggestions };
