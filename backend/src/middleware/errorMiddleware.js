import { sendError } from '../utils/responseHandler.js';

/**
 * Global 404 Route Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  return sendError(res, 404, `Endpoint not found: ${req.method} ${req.originalUrl}`);
};

/**
 * Centralized Global Error Handling Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
  console.error('💥 Unhandled Exception:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, statusCode, message, err);
};
