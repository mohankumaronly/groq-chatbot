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
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
  },
  withCredentials: true,
});

// Request interceptor - Add access token to headers
apiClient.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers[HEADERS.AUTHORIZATION] = `${HEADERS.BEARER} ${token}`;
    }
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Body:', config.data);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('📤 Request Error:', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => {
    console.log(`📥 API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Log detailed error
    console.error('📥 API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
    
    // Check if error is 401 and request hasn't been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('🔄 Attempting to refresh token...');
        const newToken = await refreshAccessToken();
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers[HEADERS.AUTHORIZATION] = `${HEADERS.BEARER} ${newToken}`;
          console.log('🔄 Retrying original request with new token');
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('🔄 Token refresh failed:', refreshError);
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
      '/api/auth/refresh',
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
      console.log('✅ Token refreshed successfully');
      return accessToken;
    }
    return null;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    return null;
  }
};

// Handle logout on token refresh failure
const handleLogout = (): void => {
  console.log('🚪 Logging out due to token refresh failure');
  tokenManager.clearAll();
  localStorage.removeItem(STORAGE_KEYS.USER);
  window.location.href = '/login';
};

export default apiClient;