import { create } from 'zustand';
import { authService } from '../services/authService';
import { tokenManager } from '../utils/tokenManager';
import { AuthState, User, LoginResult } from '../types/auth.types';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../constants/app.constants';

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: authService.getStoredUser(),
  accessToken: tokenManager.getAccessToken(),
  isAuthenticated: tokenManager.isAuthenticated(),
  isLoading: false,
  requiresOtp: false,
  maskedEmail: null,
  sessionId: null,
  otpExpiresIn: null,
  
  // Register user
  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authService.register(data);
      return { success: true, message: response.message };
    } catch (error: any) {
      const message = error.response?.data?.message || ERROR_MESSAGES.REGISTRATION_FAILED;
      return { success: false, message };
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Login
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });
      
      // Case 1: Direct login (first time user)
      if (response.accessToken) {
        const user = await authService.getCurrentUser();
        set({
          user,
          accessToken: response.accessToken,
          isAuthenticated: true,
          isLoading: false,
          requiresOtp: false,
        });
        return { success: true };
      }
      
      // Case 2: OTP required (existing user)
      if (response.requiresOtp) {
        set({
          requiresOtp: true,
          maskedEmail: response.email,
          sessionId: response.sessionId,
          otpExpiresIn: response.expiresIn,
          isLoading: false,
        });
        return {
          success: true,
          requiresOtp: true,
          email: response.email || undefined,
          expiresIn: response.expiresIn || undefined,
        };
      }
      
      return { success: false, message: response.message };
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || ERROR_MESSAGES.LOGIN_FAILED;
      return { success: false, message };
    }
  },
  
  // Verify OTP
  verifyOtp: async (otpCode) => {
    set({ isLoading: true });
    try {
      const response = await authService.verifyOtp(otpCode);
      
      if (response.accessToken) {
        const user = await authService.getCurrentUser();
        set({
          user,
          accessToken: response.accessToken,
          isAuthenticated: true,
          isLoading: false,
          requiresOtp: false,
          maskedEmail: null,
          sessionId: null,
          otpExpiresIn: null,
        });
        return { success: true };
      }
      
      return { success: false, message: response.message };
    } catch (error: any) {
      set({ isLoading: false });
      const message = error.response?.data?.message || ERROR_MESSAGES.OTP_INVALID;
      return { success: false, message };
    }
  },
  
  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear state regardless of API response
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        requiresOtp: false,
        maskedEmail: null,
        sessionId: null,
        otpExpiresIn: null,
      });
    }
  },
  
  // Refresh token
  refreshToken: async () => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        set({ accessToken: newToken, isAuthenticated: true });
        return newToken;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
  
  // Fetch current user
  fetchCurrentUser: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ user });
    } catch (error) {
      console.error('Fetch user error:', error);
    }
  },
  
  // Clear OTP state
  clearOtpState: () => {
    set({
      requiresOtp: false,
      maskedEmail: null,
      sessionId: null,
      otpExpiresIn: null,
    });
    tokenManager.removeSessionId();
    tokenManager.removeOtpExpiry();
  },
}));