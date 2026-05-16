import { STORAGE_KEYS, SESSION_KEYS } from '../../../constants/app.constants';

// Token Manager for secure token handling
export const tokenManager = {
  // Access Token Methods
  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
  
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  },
  
  removeAccessToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  },
  
  // Refresh Token Methods
  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  
  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  },
  
  removeRefreshToken(): void {
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
  
  // OTP Session Methods
  getSessionId(): string | null {
    return sessionStorage.getItem(SESSION_KEYS.SESSION_ID);
  },
  
  setSessionId(sessionId: string): void {
    sessionStorage.setItem(SESSION_KEYS.SESSION_ID, sessionId);
  },
  
  removeSessionId(): void {
    sessionStorage.removeItem(SESSION_KEYS.SESSION_ID);
  },
  
  getOtpExpiry(): number | null {
    const expiry = sessionStorage.getItem(SESSION_KEYS.OTP_EXPIRY);
    return expiry ? parseInt(expiry, 10) : null;
  },
  
  setOtpExpiry(expiresIn: number): void {
    const expiryTime = Date.now() + (expiresIn * 1000);
    sessionStorage.setItem(SESSION_KEYS.OTP_EXPIRY, expiryTime.toString());
  },
  
  removeOtpExpiry(): void {
    sessionStorage.removeItem(SESSION_KEYS.OTP_EXPIRY);
  },
  
  isOtpExpired(): boolean {
    const expiry = this.getOtpExpiry();
    if (!expiry) return true;
    return Date.now() > expiry;
  },
  
  // Clear all auth data
  clearAll(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeSessionId();
    this.removeOtpExpiry();
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  },
  
  // Simple token expiry check (client-side)
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};