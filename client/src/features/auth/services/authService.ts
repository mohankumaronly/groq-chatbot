import apiClient from '../../../services/api/apiClient';
import { endpoints } from '../../../services/api/endpoints';
import { tokenManager } from '../utils/tokenManager';
import { STORAGE_KEYS } from '../../../constants/app.constants';
import {
  RegisterData,
  RegisterResponse,
  LoginCredentials,
  LoginResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
} from '../types/auth.types';

class AuthService {
  // User Registration
  async register(data: RegisterData): Promise<RegisterResponse> {
    console.log('AuthService.register called with:', data);
    
    try {
      const response = await apiClient.post<RegisterResponse>(
        endpoints.auth.register,
        data
      );
      
      console.log('Registration response:', response.data);
      
      // Store access token if provided
      if (response.data.accessToken) {
        tokenManager.setAccessToken(response.data.accessToken);
        console.log('Access token stored');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  // Email Verification (POST method)
  async verifyEmail(token: string): Promise<string> {
    console.log('AuthService.verifyEmail called with token:', token);
    
    try {
      const response = await apiClient.post<string>(
        endpoints.auth.verifyEmail,
        { token }
      );
      console.log('Verify email response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Verify email error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  // Login
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    console.log('AuthService.login called with:', credentials.email);
    
    try {
      const response = await apiClient.post<LoginResponse>(
        endpoints.auth.login,
        credentials
      );
      
      console.log('Login response:', response.data);
      
      // If direct login (no OTP required) - store token
      if (response.data.accessToken) {
        tokenManager.setAccessToken(response.data.accessToken);
        console.log('Access token stored');
      }
      
      // If OTP required - store session data
      if (response.data.requiresOtp && response.data.sessionId) {
        tokenManager.setSessionId(response.data.sessionId);
        if (response.data.expiresIn) {
          tokenManager.setOtpExpiry(response.data.expiresIn);
        }
        console.log('OTP session stored');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  // Verify OTP
  async verifyOtp(otpCode: string): Promise<OtpVerifyResponse> {
    const sessionId = tokenManager.getSessionId();
    console.log('AuthService.verifyOtp called with sessionId:', sessionId, 'otpCode:', otpCode);
    
    if (!sessionId) {
      console.error('No session ID found');
      throw new Error('Session expired. Please login again.');
    }
    
    const request: OtpVerifyRequest = { sessionId, otpCode };
    
    try {
      const response = await apiClient.post<OtpVerifyResponse>(
        endpoints.auth.verifyOtp,
        request
      );
      
      console.log('Verify OTP response:', response.data);
      
      // Store access token on successful OTP verification
      if (response.data.accessToken) {
        tokenManager.setAccessToken(response.data.accessToken);
        // Clear OTP session data
        tokenManager.removeSessionId();
        tokenManager.removeOtpExpiry();
        console.log('Access token stored, OTP session cleared');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Verify OTP error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  // Forgot Password
  async forgotPassword(email: string): Promise<string> {
    console.log('AuthService.forgotPassword called with:', email);
    
    try {
      const request: ForgotPasswordRequest = { email };
      const response = await apiClient.post<string>(
        endpoints.auth.forgotPassword,
        request
      );
      console.log('Forgot password response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Forgot password error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  // Reset Password
  async resetPassword(token: string, newPassword: string): Promise<string> {
    console.log('AuthService.resetPassword called with token:', token);
    
    try {
      const request: ResetPasswordRequest = { token, newPassword };
      const response = await apiClient.post<string>(
        endpoints.auth.resetPassword,
        request
      );
      console.log('Reset password response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Reset password error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  // Refresh Token
  async refreshToken(): Promise<string | null> {
    console.log('AuthService.refreshToken called');
    
    try {
      const response = await apiClient.post<{ accessToken: string }>(
        endpoints.auth.refreshToken,
        {}
      );
      
      if (response.data.accessToken) {
        tokenManager.setAccessToken(response.data.accessToken);
        console.log('Token refreshed successfully');
        return response.data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Refresh token error:', error);
      return null;
    }
  }
  
  // Logout
  async logout(): Promise<string> {
    console.log('AuthService.logout called');
    
    try {
      const response = await apiClient.post<string>(endpoints.auth.logout, {});
      console.log('Logout response:', response.data);
      return response.data;
    } finally {
      // Always clear local tokens
      tokenManager.clearAll();
      localStorage.removeItem(STORAGE_KEYS.USER);
      console.log('All tokens cleared');
    }
  }
  
  // Get Current User
  async getCurrentUser(): Promise<User> {
    console.log('AuthService.getCurrentUser called');
    
    try {
      const response = await apiClient.get<{ user: User }>(
        endpoints.auth.getMe
      );
      
      console.log('Get current user response:', response.data);
      
      // Store user in localStorage for persistence
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      
      return response.data.user;
    } catch (error: any) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  // Get stored user (from localStorage)
  getStoredUser(): User | null {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('Stored user retrieved:', user);
        return user;
      } catch {
        return null;
      }
    }
    return null;
  }
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    const isAuth = tokenManager.isAuthenticated();
    console.log('isAuthenticated check:', isAuth);
    return isAuth;
  }
}

export const authService = new AuthService();
export default authService;