// Base API URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// API Timeout (30 seconds)
export const API_TIMEOUT = 30000;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth Endpoints
  AUTH: {
    REGISTER: '/auth/register',
    VERIFY_EMAIL: '/auth/verify-email',
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/login/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    GET_ME: '/auth/me',
  },
  
  // Chat Endpoints (for future use)
  CHAT: {
    SEND: '/chat/send',
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/messages',
    DELETE_CONVERSATION: '/chat/conversations/:id',
  },
  
  // User Endpoints (for future use)
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
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

// Request Headers - Fixed: These are header NAMES, not values
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',      // Fixed: This should be 'Content-Type', not 'application/json'
  AUTHORIZATION: 'Authorization',
  BEARER: 'Bearer',
} as const;

// Content Types - Separate constant for values
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  TEXT: 'text/plain',
} as const;