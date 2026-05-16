import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT, HEADERS, CONTENT_TYPES } from '../../constants/api.constants';
import { tokenManager } from '../../features/auth/utils/tokenManager';
import { STORAGE_KEYS } from '../../constants/app.constants';

// Extend InternalAxiosRequestConfig to include _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,  // Now correct: 'Content-Type': 'application/json'
  },
  withCredentials: true, // Important for cookies (refresh token)
});

// Request interceptor - Add access token to headers
apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers[HEADERS.AUTHORIZATION] = `${HEADERS.BEARER} ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Check if error is 401 and request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers[HEADERS.AUTHORIZATION] = `${HEADERS.BEARER} ${newToken}`;
          }
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        handleLogout();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Refresh token function
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { 
        withCredentials: true,
        headers: {
          [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
        }
      }
    );
    
    const { accessToken } = response.data;
    if (accessToken) {
      tokenManager.setAccessToken(accessToken);
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

// Handle logout on token refresh failure
const handleLogout = (): void => {
  tokenManager.clearAll();
  localStorage.removeItem(STORAGE_KEYS.USER);
  window.location.href = '/login';
};

export default apiClient;