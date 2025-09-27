import axios from 'axios';

// Base API URL: configurable via env, defaults to local backend
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance for chat-related endpoints
const chatAPI = axios.create({
  baseURL: API_BASE_URL,
  // Gemini responses can take longer; use a higher timeout
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Frontend-local session id used only for header logging/tracing
function getOrCreateSessionId() {
  try {
    const key = 'chat_session_id';
    let id = localStorage.getItem(key);
    if (!id) {
      id = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

// Request interceptor
chatAPI.interceptors.request.use(
  (config) => {
    // Log outgoing request details for debugging
    console.log('🚀 [chatAPI] Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL
    });
    const sessionId = getOrCreateSessionId();
    config.headers = config.headers || {};
    config.headers['x-session-id'] = sessionId;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
chatAPI.interceptors.response.use(
  (response) => {
    // Log success responses with status
    console.log('✅ [chatAPI] Response', { status: response.status, url: response.config?.url });
    return response;
  },
  (error) => {
    // Log error payloads for easier diagnosis
    console.error('❌ [chatAPI] Error', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Chat API functions
// Backend session id maintained by server; ensures context continuity
const BACKEND_SESSION_KEY = 'chat_backend_session_id';

function getBackendSessionId() {
  try {
    return localStorage.getItem(BACKEND_SESSION_KEY) || null;
  } catch {
    return null;
  }
}

function setBackendSessionId(id) {
  try {
    if (id) localStorage.setItem(BACKEND_SESSION_KEY, id);
  } catch {}
}

export const sendChatMessage = async (message, city, isJapanese = false) => {
  // Send chat message; include backend sessionId in body for continuity
  console.log('✉️ [chatAPI] sendChatMessage', { message, city, isJapanese });
  try {
    const sessionId = getBackendSessionId();
    const response = await chatAPI.post('/chat', {
      message,
      sessionId,
      city,
      preferBilingual: true // Always request bilingual responses
    });
    // Persist returned backend sessionId for continuity
    const returnedSessionId = response?.data?.data?.sessionId;
    console.log('🧭 [chatAPI] Returned sessionId', returnedSessionId);
    if (returnedSessionId) setBackendSessionId(returnedSessionId);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to send message');
  }
};


export const checkAPIHealth = async () => {
  try {
    const response = await chatAPI.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API health check failed');
  }
};
