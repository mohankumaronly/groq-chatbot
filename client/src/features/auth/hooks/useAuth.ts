import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    requiresOtp,
    maskedEmail,
    sessionId,
    otpExpiresIn,
    register,
    login,
    verifyOtp,
    logout,
    refreshToken,
    fetchCurrentUser,
    clearOtpState,
  } = useAuthStore();

  return {
    // State
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    requiresOtp,
    maskedEmail,
    sessionId,
    otpExpiresIn,
    
    // Actions
    register,
    login,
    verifyOtp,
    logout,
    refreshToken,
    fetchCurrentUser,
    clearOtpState,
  };
};