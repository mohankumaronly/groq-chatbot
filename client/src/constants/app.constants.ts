// App Information
export const APP_NAME = 'Qroq AI Chatbot';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Next-generation AI chatbot powered by advanced language models';

// Default Settings
export const DEFAULT_SETTINGS = {
  theme: 'dark',
  language: 'en',
  fontSize: 'medium',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Date Formats
export const DATE_FORMATS = {
  full: 'MMMM Do YYYY, h:mm:ss a',
  short: 'MM/DD/YYYY',
  time: 'h:mm a',
  chat: 'h:mm a',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  CHAT_HISTORY: 'chatHistory',
} as const;

// Session Storage Keys
export const SESSION_KEYS = {
  SESSION_ID: 'loginSessionId',
  OTP_EXPIRY: 'otpExpiryTimestamp',
} as const;

// Route Paths
export const ROUTES = {
  LANDING: '/',
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHAT: '/chat',
} as const;

// API Timeouts
export const API_TIMEOUT = 30000; // 30 seconds
export const OTP_EXPIRY_TIME = 300; // 5 minutes in seconds

// Validation Rules
export const VALIDATION_RULES = {
  FIRST_NAME: {
    MIN: 2,
    MAX: 50,
  },
  LAST_NAME: {
    MIN: 2,
    MAX: 50,
  },
  PASSWORD: {
    MIN: 8,
    MAX: 50,
  },
  OTP: {
    LENGTH: 6,
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  OTP_EXPIRED: 'OTP expired. Please login again.',
  OTP_INVALID: 'Invalid OTP. Please try again.',
  REGISTRATION_FAILED: 'Registration failed. Please try again.',
  LOGIN_FAILED: 'Invalid email or password.',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in.',
  SOMETHING_WRONG: 'Something went wrong. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION: 'Registration successful! Please check your email for verification link.',
  EMAIL_VERIFIED: 'Email verified successfully! You can now login.',
  PASSWORD_RESET_SENT: 'Password reset instructions sent to your email.',
  PASSWORD_RESET: 'Password reset successful! Please login with your new password.',
  LOGOUT: 'Logged out successfully.',
} as const;