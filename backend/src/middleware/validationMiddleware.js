import { sendError } from '../utils/responseHandler.js';

/**
 * Validates User Registration Payload
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return sendError(res, 400, 'Name is required and must be at least 2 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return sendError(res, 400, 'A valid email address is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return sendError(res, 400, 'Password must be at least 6 characters long.');
  }

  next();
};

/**
 * Validates User Login Payload
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, 'Email and password are required.');
  }

  next();
};

/**
 * Validates Task Creation/Update Payload
 */
export const validateTask = (req, res, next) => {
  const { title, priority, status, estimated_minutes } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return sendError(res, 400, 'Task title is required.');
  }

  const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
  if (priority && !validPriorities.includes(priority)) {
    return sendError(res, 400, `Priority must be one of: ${validPriorities.join(', ')}`);
  }

  const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
  if (status && !validStatuses.includes(status)) {
    return sendError(res, 400, `Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (estimated_minutes !== undefined && (isNaN(estimated_minutes) || Number(estimated_minutes) < 0)) {
    return sendError(res, 400, 'Estimated minutes must be a positive number.');
  }

  next();
};

/**
 * Validates Goal Creation/Update Payload
 */
export const validateGoal = (req, res, next) => {
  const { title, progress } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return sendError(res, 400, 'Goal title is required.');
  }

  if (progress !== undefined) {
    const num = Number(progress);
    if (isNaN(num) || num < 0 || num > 100) {
      return sendError(res, 400, 'Goal progress must be an integer between 0 and 100.');
    }
  }

  next();
};

/**
 * Validates Category Payload
 */
export const validateCategory = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return sendError(res, 400, 'Category name is required.');
  }

  next();
};
