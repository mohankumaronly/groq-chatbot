// User type
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  avatar?: string;
}

// Registration data
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Registration response
export interface RegisterResponse {
  accessToken: string;
  refreshToken: string | null;
  message: string;
  requiresOtp: null;
  email: null;
  sessionId: null;
  expiresIn: null;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  accessToken: string | null;
  refreshToken: string | null;
  message: string;
  requiresOtp: boolean;
  email: string | null;
  sessionId: string | null;
  expiresIn: number | null;
}

// OTP verification request
export interface OtpVerifyRequest {
  sessionId: string;
  otpCode: string;
}

// OTP verification response
export interface OtpVerifyResponse {
  accessToken: string;
  refreshToken: string | null;
  message: string;
  requiresOtp: null;
  email: null;
  sessionId: null;
  expiresIn: null;
}

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Auth state for store
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // OTP flow state
  requiresOtp: boolean;
  maskedEmail: string | null;
  sessionId: string | null;
  otpExpiresIn: number | null;
  
  // Actions
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<LoginResult>;
  verifyOtp: (otpCode: string) => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  fetchCurrentUser: () => Promise<void>;
  clearOtpState: () => void;
}

// Login result type
export interface LoginResult {
  success: boolean;
  requiresOtp?: boolean;
  message?: string;
  email?: string;
  expiresIn?: number;
}