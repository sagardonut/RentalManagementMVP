import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: user
        ? `Namaste ${user.fullName?.split(' ')[0] || ''}! 🙏 I'm your Urban Sanctuary AI concierge. How can I help you today?`
        : 'Namaste! 🙏 I\'m your Urban Sanctuary AI concierge. Ask me about available rooms, locations, pricing, or how our platform works!',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isTyping) return;

    setInputText('');
    setError('');

    const newUserMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      // Send auth token if user is logged in so backend knows who's talking
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const response = await fetch('http://localhost:5001/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const newBotMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Sorry, I am having trouble understanding right now.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, newBotMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Error connecting to the server. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors">

      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600"></div>
          </div>
          <div>
            <h2 className="text-sm font-semibold">Urban Sanctuary</h2>
            <p className="text-xs text-blue-100 font-medium">
              {user ? `Chatting as ${user.role === 'user' ? 'Member' : user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}` : 'AI Concierge'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 dark:bg-slate-800/50 transition-colors">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-3 py-2 rounded-lg text-center mb-4 transition-colors">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 transition-colors">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder="Type your message..."
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-slate-100 rounded-full pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`absolute right-1.5 p-1.5 rounded-full flex items-center justify-center transition-colors ${
              !inputText.trim() || isTyping
                ? 'text-gray-400 dark:text-slate-600 bg-transparent cursor-not-allowed'
                : 'text-white bg-blue-600 hover:bg-blue-700 shadow-sm'
            }`}
          >
            <svg className="w-4 h-4 transform rotate-90 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19V5m-7 7l7-7 7 7" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatWindow;
