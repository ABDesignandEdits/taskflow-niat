import { AuthService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return sendError(res, 400, 'Name, email, and password are required.');
    }
    const result = await AuthService.register({ name, email, password });
    return sendSuccess(res, 201, 'Account created successfully! Welcome to TaskFlow.', result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, 'Email and password are required.');
    }
    const result = await AuthService.login({ email, password });
    return sendSuccess(res, 200, 'Login successful!', result);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await AuthService.getCurrentUser(req.user.id);
    return sendSuccess(res, 200, 'User profile retrieved.', { user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const profile = await AuthService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, 200, 'Profile updated successfully.', { profile });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  return sendSuccess(res, 200, 'Logged out successfully.');
};