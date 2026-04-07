import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import SecureStoreService from '../services/secureStore';
import { auth } from '../services/firebaseConfig';

const API_BASE_URL = 'https://api.yourbackend.com'; // Placeholder

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Bearer token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // 1. Get token from Secure Storage
      let token = await SecureStoreService.getToken();

      // 2. If token is missing or near expiry, refresh it from Firebase
      if (!token && auth.currentUser) {
        token = await auth.currentUser.getIdToken(true);
        if (token) await SecureStoreService.saveToken(token);
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Silently fail or log if needed (no tokens in logs!)
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and global errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized globally
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token directly from Firebase if 401 occurs
        if (auth.currentUser) {
          const newToken = await auth.currentUser.getIdToken(true);
          await SecureStoreService.saveToken(newToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, probably session expired. Force logout.
        await auth.signOut();
        await SecureStoreService.removeToken();
        // Redirect logic handled by AuthContext listener
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
