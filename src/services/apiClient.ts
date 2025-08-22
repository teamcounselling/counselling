import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authService } from './auth/authService';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip authentication for login and register endpoints
    const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/register');
    
    console.log('API Request:', config.url);
    console.log('Is Auth Endpoint:', isAuthEndpoint);
    
    if (!isAuthEndpoint) {
      const token = authService.getAccessToken();
      console.log('Token found:', !!token);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header added');
      }
    }
    return config;
  },
  (error: AxiosError) => {
    console.log('API Error:', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Skip token refresh for login and register endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/login') || originalRequest.url?.includes('/register');

    // If error is 401 and we haven't retried yet and it's not an auth endpoint
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await authService.refreshToken();
        
        // Retry the original request with new token
        const newToken = authService.getAccessToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        console.error('Token refresh failed:', refreshError);
        // authService.logout();
        
        // Redirect to login page
        // window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient }; 