/**
 * API Service
 *
 * Handles all HTTP requests to the backend with authentication headers
 * and enhanced network error diagnostics.
 */

import axios from 'axios';
import API_BASE_URL from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000 // 30s timeout for cold start tolerance (Render free tier)
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized handling (avoid redirect loops on login/register pages)
    if (error.response?.status === 401) {
      const pathname = window.location.pathname;
      const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
      if (!isAuthPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('taskflow_token');
        window.location.href = '/login';
      }
    }

    // Enhance error message for UI consumption
    if (error.response?.data?.message) {
      error.userMessage = error.response.data.message;
    } else if (error.code === 'ERR_NETWORK') {
      error.userMessage = 'Unable to connect to the backend server. The server might be waking up or offline. Please retry in a few seconds.';
    } else if (error.code === 'ECONNABORTED') {
      error.userMessage = 'Request timed out. Please try again.';
    } else {
      error.userMessage = error.message || 'An unexpected error occurred.';
    }

    return Promise.reject(error);
  }
);

export default api;