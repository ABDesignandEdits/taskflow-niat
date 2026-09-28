import { verifyToken } from '../utils/jwtUtils.js';
import { sendError } from '../utils/responseHandler.js';

/**
 * Authentication Middleware
 * Validates the Authorization Bearer JWT header and extracts the user object.
 * Protects private endpoints from unauthorized access.
 */
export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Authentication required. Please log in to continue.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 401, 'Authentication token missing.');
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return sendError(res, 401, 'Invalid or expired session. Please log in again.');
    }

    // Attach verified user payload to request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return sendError(res, 401, 'Failed to authenticate user.', error.message);
  }
};
