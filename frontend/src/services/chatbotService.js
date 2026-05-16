const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_BASE = `${API_ROOT.replace(/\/$/, '')}/chatbot`;

// Get stored session ID for anonymous users
function getSessionId() {
  let sessionId = localStorage.getItem('chatbot_session_id');
  if (!sessionId) {
    sessionId = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('chatbot_session_id', sessionId);
  }
  return sessionId;
}

function getAuthHeaders() {
  const stored = localStorage.getItem('user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        };
      }
    } catch (e) { /* ignore */ }
  }
  return { 'Content-Type': 'application/json' };
}

// Send a message to the chatbot
export async function sendMessage(message) {
  const headers = getAuthHeaders();
  const body = { message };
  
  // Include session ID for anonymous users
  if (!headers.Authorization) {
    body.sessionId = getSessionId();
  }

  const response = await fetch(`${API_BASE}/message`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to send message');
  }

  const data = await response.json();
  
  // Store session ID if returned
  if (data.sessionId) {
    localStorage.setItem('chatbot_session_id', data.sessionId);
  }
  
  return data;
}

// Get chat history
export async function getHistory() {
  const headers = getAuthHeaders();
  const params = new URLSearchParams();
  
  if (!headers.Authorization) {
    params.set('sessionId', getSessionId());
  }

  const response = await fetch(`${API_BASE}/history?${params.toString()}`, { headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to load history');
  }

  return response.json();
}

// Get quick suggestions
export async function getSuggestions() {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_BASE}/suggestions`, { headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to load suggestions');
  }

  return response.json();
}

// Clear chat history
export async function clearHistory() {
  const headers = getAuthHeaders();
  const body = {};
  
  if (!headers.Authorization) {
    body.sessionId = getSessionId();
  }

  const response = await fetch(`${API_BASE}/clear`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to clear history');
  }

  return response.json();
}
