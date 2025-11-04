import axios from "axios";
import {
  clearAuth,
  getAuthState,
  getToken,
  saveAuthState,
} from "./auth-storage";
import { AuthResponse } from "@/@types/auth";

// Base URL for API - change this to your actual API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://ally-be.onrender.com/v1";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to track ongoing refresh
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

// Helper to process queued requests after refresh
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from auth storage
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for refresh token flow
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request failed with 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get current refresh token
        const { refreshToken, user } = getAuthState();

        if (!refreshToken) {
          clearAuth();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Call refresh endpoint
        const response = (await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })) as AuthResponse;

        const newToken = response.data?.tokens?.access?.token;
        const newRefreshToken = response.data?.tokens?.refresh?.token;

        if (newToken) {
          // Save new tokens
          saveAuthState(user!, newToken, newRefreshToken);
          if (newRefreshToken) {
            localStorage.setItem("refresh_token", newRefreshToken);
          }

          axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }

        throw new Error("No new token received");
      } catch (err) {
        processQueue(err, null);
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other error codes
    if (error.response) {
      const { status } = error.response;
      if (status === 403) console.error("Access forbidden");
      if (status === 500) console.error("Server error");
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
