/**
 * Standardized API Response Helpers
 * Follows the unified JSON envelope structure:
 * Success: { success: true, message: string, data: any }
 * Error:   { success: false, message: string, error?: any }
 */

export const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', error = null) => {
  const response = {
    success: false,
    message
  };

  if (error && process.env.NODE_ENV !== 'production') {
    response.error = typeof error === 'string' ? { detail: error } : error;
  }

  return res.status(statusCode).json(response);
};
