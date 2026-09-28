import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt
 * @param {string} password 
 * @returns {Promise<string>} hashed password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain-text password with a stored bcrypt hash
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>} true if match, false otherwise
 */
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
