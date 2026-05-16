import React, { useState, useEffect, useCallback } from 'react';
import { MessageCircle, X, Trash2, Minus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import * as chatbotService from '../../services/chatbotService';
import sanctuaryLogo from '../../assets/sanctuary-ai-logo.svg';
import './ChatBot.css';

// ─── Role Badge ──────────────────────────────────────────────
function RoleBadge({ role }) {
  const labels = {
    admin: 'Admin',
    superadmin: 'SuperAdmin',
    agency: 'Agency',
    agent: 'Agent',
    user: 'User',
    anonymous: 'Guest',
  };

  return (
    <span className={`chatbot-user-badge badge-${role || 'anonymous'}`}>
      {labels[role] || labels.anonymous}
    </span>
  );
}

// ─── Main ChatBot Component ──────────────────────────────────
export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const userRole = user?.role || 'anonymous';

  // Load history and suggestions when opened
  useEffect(() => {
    if (isOpen && !hasLoaded) {
      loadInitialData();
    }
  }, [isOpen, hasLoaded]);

  // Reload suggestions when user changes (login/logout)
  useEffect(() => {
    if (isOpen) {
      setHasLoaded(false);
      loadSuggestions();
    }
  }, [user?.token]);

  const loadInitialData = async () => {
    try {
      const [historyRes, suggestionsRes] = await Promise.all([
        chatbotService.getHistory(),
        chatbotService.getSuggestions(),
      ]);

      if (historyRes.success && historyRes.messages.length > 0) {
        setMessages(historyRes.messages);
      }

      if (suggestionsRes.success) {
        setSuggestions(suggestionsRes.suggestions);
      }

      setHasLoaded(true);
    } catch (err) {
      console.error('Failed to load chatbot data:', err);
      setHasLoaded(true);
    }
  };

  const loadSuggestions = async () => {
    try {
      const res = await chatbotService.getSuggestions();
      if (res.success) {
        setSuggestions(res.suggestions);
      }
    } catch (err) { /* silent */ }
  };

  const handleToggle = useCallback(() => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 250);
    } else {
      setIsOpen(true);
    }
  }, [isOpen]);

  const handleSend = async (message) => {
    // Optimistically add user message
    const userMsg = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    // Clear suggestions after first message
    setSuggestions([]);

    try {
      const response = await chatbotService.sendMessage(message);
      
      const botMsg = {
        role: 'model',
        content: response.reply || 'I couldn\'t process that. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        role: 'model',
        content: err.message || 'I am having trouble reaching the assistant service right now. Please refresh once, or try again in a moment.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  const handleClearHistory = async () => {
    try {
      await chatbotService.clearHistory();
      setMessages([]);
      setSuggestions([]);
      setHasLoaded(false);
      // Reload suggestions
      loadSuggestions();
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        className={`chatbot-fab ${isOpen ? 'is-open' : ''}`}
        onClick={handleToggle}
        title={isOpen ? 'Close chat' : 'Chat with Sanctuary AI'}
        id="chatbot-fab"
      >
        {!isOpen && <span className="chatbot-fab-pulse" />}
        <MessageCircle className="fab-chat-icon" size={28} />
        <X className="fab-close-icon" size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isClosing ? 'closing' : ''}`} id="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar">
                <img src={sanctuaryLogo} alt="" />
                <div className="chatbot-avatar-pulse" />
              </div>
              <div className="chatbot-header-info">
                <h3>Sanctuary AI</h3>
                <span>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  Online now
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <RoleBadge role={userRole} />
              <button
                className="chatbot-header-btn"
                onClick={handleClearHistory}
                title="Clear chat history"
                id="chatbot-clear-btn"
              >
                <Trash2 size={16} />
              </button>
              <button
                className="chatbot-header-btn"
                onClick={handleToggle}
                title="Minimize"
                id="chatbot-minimize-btn"
              >
                <Minus size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ChatWindow messages={messages} isTyping={isTyping} />

          {/* Quick Suggestions */}
          {suggestions.length > 0 && messages.length === 0 && (
            <div className="chatbot-suggestions">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      )}
    </>
  );
}
