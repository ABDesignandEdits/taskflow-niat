/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 * Handles login, registration, logout, and token management.
 */

import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('taskflow_token');
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData.user || userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('taskflow_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const token = response.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('taskflow_token', token);
    }
    const userData = response.user || response;
    setUser(userData);
    setIsAuthenticated(true);
    return response;
  };

  const register = async (arg1, arg2, arg3) => {
    const response = await authService.register(arg1, arg2, arg3);
    const token = response.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('taskflow_token', token);
    }
    const userData = response.user || response;
    setUser(userData);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    authService.logout().catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};