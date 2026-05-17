// Base API URL - Empty because Vite proxy handles routing
export const API_BASE_URL = '';

// API Timeout (30 seconds)
export const API_TIMEOUT = 30000;

// API Endpoints - Full paths with /api prefix for proxy
export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    VERIFY_EMAIL: '/api/auth/verify-email',
    LOGIN: '/api/auth/login',
    VERIFY_OTP: '/api/auth/login/verify',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    REFRESH_TOKEN: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    GET_ME: '/api/auth/me',
  },
  
  // Chat Endpoints
  CHAT: {
    SEND: '/api/chat/send',
    SEND_NEW: '/api/chat/send/new',
    REGENERATE: '/api/chat/:id/regenerate',
  },
  
  // Conversation Endpoints
  CONVERSATIONS: {
    BASE: '/api/conversations',
    ALL: '/api/conversations/all',
    BY_ID: '/api/conversations/:id',
    COUNT: '/api/conversations/count',
    MESSAGES: '/api/conversations/:id/messages',
    RECENT_MESSAGES: '/api/conversations/:id/messages/recent',
    MESSAGE_COUNT: '/api/conversations/:id/messages/count',
    DELETE_MESSAGE: '/api/conversations/:id/messages/:messageId',
  },
  
  // User Endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Request Headers
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  TEXT: 'text/plain',
} as const;