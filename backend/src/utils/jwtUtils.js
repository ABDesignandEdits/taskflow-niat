import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generates a signed JWT authentication token
 * @param {object} payload - { id, email }
 * @returns {string} Signed JWT token
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

/**
 * Verifies a JWT token and returns decoded payload
 * @param {string} token 
 * @returns {object|null} Decoded payload or null
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return null;
  }
};
