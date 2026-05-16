import React, { useState } from 'react';

const MessageBubble = ({ message }) => {
  const isBot = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-start mb-4 ${isBot ? 'max-w-[85%]' : 'max-w-[85%] ml-auto justify-end'}`}>
      
      {isBot && (
        <div className="flex-shrink-0 mr-2 mt-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      )}

      <div className={`group relative flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`relative px-4 py-2 shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${
            isBot
              ? 'bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none border border-gray-200'
              : 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
          }`}
        >
          {message.content}
        </div>
        
        <div className={`flex items-center mt-1 space-x-2 ${isBot ? 'justify-start ml-1' : 'justify-end mr-1'}`}>
          <span className="text-[10px] text-gray-400 font-medium">{formattedTime}</span>
          
          {isBot && (
            <button
              onClick={handleCopy}
              className="text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
              title="Copy message"
            >
              {copied ? (
                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default MessageBubble;
