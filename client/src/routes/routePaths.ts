export const ROUTE_PATHS = {
  // Public Routes
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Protected Routes (require authentication)
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  CHAT: '/chat',
  CHAT_CONVERSATION: '/chat/:conversationId',
  NOT_FOUND: '*',
} as const;