import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window Container */}
      <div 
        className={`transition-all duration-300 ease-in-out transform origin-bottom-right ${
          isOpen 
            ? 'scale-100 opacity-100 translate-y-0 mb-4' 
            : 'scale-0 opacity-0 translate-y-10 pointer-events-none absolute bottom-16 right-0'
        }`}
        style={{ width: '350px', height: '500px', maxWidth: 'calc(100vw - 48px)', maxHeight: 'calc(100vh - 120px)' }}
      >
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-gray-800 rotate-90 scale-90' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
        } text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-500/30`}
        aria-label="Toggle Chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

    </div>
  );
};

export default FloatingChatbot;
