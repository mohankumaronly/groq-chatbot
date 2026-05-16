import { API_ENDPOINTS } from '../../constants/api.constants';

export const endpoints = {
  auth: {
    register: API_ENDPOINTS.AUTH.REGISTER,
    verifyEmail: API_ENDPOINTS.AUTH.VERIFY_EMAIL,
    login: API_ENDPOINTS.AUTH.LOGIN,
    verifyOtp: API_ENDPOINTS.AUTH.VERIFY_OTP,
    forgotPassword: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    resetPassword: API_ENDPOINTS.AUTH.RESET_PASSWORD,
    refreshToken: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    logout: API_ENDPOINTS.AUTH.LOGOUT,
    getMe: API_ENDPOINTS.AUTH.GET_ME,
  },
  chat: {
    send: API_ENDPOINTS.CHAT.SEND,
    conversations: API_ENDPOINTS.CHAT.CONVERSATIONS,
    messages: API_ENDPOINTS.CHAT.MESSAGES,
    deleteConversation: API_ENDPOINTS.CHAT.DELETE_CONVERSATION,
  },
  user: {
    profile: API_ENDPOINTS.USER.PROFILE,
    updateProfile: API_ENDPOINTS.USER.UPDATE_PROFILE,
    changePassword: API_ENDPOINTS.USER.CHANGE_PASSWORD,
  },
} as const;