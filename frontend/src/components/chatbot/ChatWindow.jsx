import React, { useEffect, useRef } from 'react';
import { Bot, UserRound } from 'lucide-react';
import { RobotIcon } from './ChatBot';

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function MessageText({ content }) {
  const blocks = String(content || '').split(/\n{2,}/).filter(Boolean);

  return blocks.map((block, blockIndex) => {
    const lines = block.split('\n').filter(Boolean);
    const isList = lines.every((line) => /^\s*(?:[-*•]|\d+\.)\s+/.test(line));

    if (isList) {
      return (
        <ul key={blockIndex}>
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>{renderInline(line.replace(/^\s*(?:[-*•]|\d+\.)\s+/, ''))}</li>
          ))}
        </ul>
      );
    }

    return (
      <p key={blockIndex}>
        {lines.map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {renderInline(line)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

// ─── Time Formatter ──────────────────────────────────────────
function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export default function ChatWindow({ messages, isTyping }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="chatbot-messages" ref={containerRef}>
      {messages.length === 0 && !isTyping && (
        <>
          <div className="chatbot-empty-spacer" />
          <div className="chatbot-welcome">
            <div className="welcome-icon">
              <RobotIcon size={28} className="welcome-robot-icon" />
            </div>
            <h4>Namaste. I'm Sanctuary AI.</h4>
            <p>
              Ask about rooms, Kathmandu neighborhoods, pricing, bookings, or the next best action in your dashboard.
            </p>
          </div>
        </>
      )}

      {messages.map((msg, index) => (
        <div
          key={index}
          className={`chat-message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
        >
          <div className="message-avatar">
            {msg.role === 'user' ? <UserRound size={16} /> : <Bot size={16} />}
          </div>
          <div>
            {msg.role === 'user' ? (
              <div className="message-bubble">{msg.content}</div>
            ) : (
              <div className="message-bubble">
                <MessageText content={msg.content} />
              </div>
            )}
            <div className="message-time">{formatTime(msg.timestamp)}</div>
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="typing-indicator">
          <div className="message-avatar">
            <Bot size={16} />
          </div>
          <div className="typing-bubble">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
