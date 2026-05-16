const ChatSession = require('../models/ChatSession.model');
const aiService = require('../services/groq.service');

// ─── Send Message ─────────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Determine user identity
    const isAuthenticated = !!req.user;
    const userId = isAuthenticated ? req.user._id : null;
    const userRole = isAuthenticated ? req.user.role : 'anonymous';
    const userData = isAuthenticated ? {
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
    } : null;

    // Find or create chat session
    let chatSession;
    
    if (isAuthenticated) {
      chatSession = await ChatSession.findOne({ userId });
    } else if (sessionId) {
      chatSession = await ChatSession.findOne({ sessionId });
    }
    
    if (!chatSession) {
      chatSession = new ChatSession({
        userId: userId,
        sessionId: !isAuthenticated ? (sessionId || generateSessionId()) : null,
        userRole: userRole,
        messages: [],
        metadata: {
          userName: userData?.fullName || 'Guest',
          userEmail: userData?.email || null,
          lastActivity: new Date(),
        },
      });
    }

    // Update last activity
    chatSession.metadata.lastActivity = new Date();

    // Get recent conversation history (last 20 messages for context window)
    const recentHistory = chatSession.messages.slice(-20).map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Call AI assistant
    const aiResponse = await aiService.chat(
      message.trim(),
      recentHistory,
      userRole,
      userData,
      userId
    );

    // Save user message
    chatSession.messages.push({
      role: 'user',
      content: message.trim(),
    });

    // Save AI response
    chatSession.messages.push({
      role: 'model',
      content: aiResponse.reply,
    });

    // Keep only last 100 messages per session to prevent unbounded growth
    if (chatSession.messages.length > 100) {
      chatSession.messages = chatSession.messages.slice(-100);
    }

    await chatSession.save();

    return res.json({
      success: true,
      reply: aiResponse.reply,
      provider: aiResponse.provider,
      model: aiResponse.model,
      sessionId: chatSession.sessionId,
      messageCount: chatSession.messages.length,
    });

  } catch (error) {
    console.error('❌ Chatbot Controller Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.',
      reply: 'I am having trouble reaching the assistant service right now. Please refresh once, or try again in a moment.',
    });
  }
};

// ─── Get Chat History ─────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const isAuthenticated = !!req.user;
    const { sessionId } = req.query;
    
    let chatSession;
    
    if (isAuthenticated) {
      chatSession = await ChatSession.findOne({ userId: req.user._id });
    } else if (sessionId) {
      chatSession = await ChatSession.findOne({ sessionId });
    }

    if (!chatSession) {
      return res.json({
        success: true,
        messages: [],
        sessionId: sessionId || null,
      });
    }

    // Return last 50 messages
    const messages = chatSession.messages.slice(-50).map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    }));

    return res.json({
      success: true,
      messages,
      sessionId: chatSession.sessionId,
    });

  } catch (error) {
    console.error('❌ Chat History Error:', error);
    return res.status(500).json({ success: false, error: 'Failed to load chat history' });
  }
};

// ─── Get Quick Suggestions ────────────────────────────────────
const getSuggestions = async (req, res) => {
  try {
    const role = req.user?.role || 'anonymous';
    const suggestions = aiService.getQuickSuggestions(role);
    
    return res.json({ success: true, suggestions });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to get suggestions' });
  }
};

// ─── Clear Chat History ───────────────────────────────────────
const clearHistory = async (req, res) => {
  try {
    const isAuthenticated = !!req.user;
    const { sessionId } = req.body;

    if (isAuthenticated) {
      await ChatSession.deleteOne({ userId: req.user._id });
    } else if (sessionId) {
      await ChatSession.deleteOne({ sessionId });
    }

    return res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to clear history' });
  }
};

// ─── Helper ───────────────────────────────────────────────────
function generateSessionId() {
  return 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
}

module.exports = { sendMessage, getHistory, getSuggestions, clearHistory };
