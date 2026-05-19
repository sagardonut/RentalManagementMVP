import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {/* Chat Window Container */}
      <div
        className={`transition-all duration-300 ease-in-out transform origin-bottom-right ${isOpen
            ? 'scale-100 opacity-100 translate-y-0 mb-4'
            : 'scale-0 opacity-0 translate-y-10 pointer-events-none absolute bottom-16 right-0'
          }`}
        style={{ width: '350px', height: '500px', maxWidth: 'calc(100vw - 48px)', maxHeight: 'calc(100vh - 120px)' }}
      >
        {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      </div>

      {/* Floating Action Button with Permanent Label */}
      <div className="flex items-center gap-3">
        {/* Permanent Side Greeting */}
        <div className="flex flex-col items-end justify-center pointer-events-none bg-surface/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm border border-outline-variant/20 dark:border-slate-700 transition-colors">
          <span className="text-on-surface dark:text-slate-100 font-medium text-[15px] tracking-tight leading-tight">Namaste!🙏</span>
          <span className="text-on-surface-variant dark:text-slate-400 font-normal text-[13px] tracking-wide leading-tight mt-0.5">Welcome to The Urban Sanctuary!</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${isOpen ? 'bg-slate-800 dark:bg-slate-700 rotate-90 scale-[0.85]' : 'bg-primary dark:bg-blue-600 hover:bg-primary-container dark:hover:bg-blue-700 hover:scale-105'
            } text-white rounded-full w-16 h-16 pb-1 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-primary/30`}
          aria-label="Toggle Chat"
        >
          {isOpen ? (
            <svg className="w-7 h-7 transform -rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
};

export default FloatingChatbot;
