const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'model'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSessionSchema = new mongoose.Schema({
  // For logged-in users
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  // For anonymous users (browser-generated UUID)
  sessionId: {
    type: String,
    default: null,
  },
  userRole: {
    type: String,
    enum: ['user', 'agent', 'agency', 'admin', 'superadmin', 'anonymous'],
    default: 'anonymous',
  },
  messages: [messageSchema],
  metadata: {
    userName: { type: String, default: 'Guest' },
    userEmail: { type: String, default: null },
    lastActivity: { type: Date, default: Date.now },
  },
}, { timestamps: true });

// Index for quick lookup
chatSessionSchema.index({ userId: 1 });
chatSessionSchema.index({ sessionId: 1 });
// Auto-delete anonymous sessions after 24 hours of inactivity
chatSessionSchema.index({ 'metadata.lastActivity': 1 }, { expireAfterSeconds: 86400, partialFilterExpression: { userId: null } });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
