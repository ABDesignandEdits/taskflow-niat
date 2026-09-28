import { UserModel } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hashUtils.js';
import { generateToken } from '../utils/jwtUtils.js';

export const AuthService = {
  async register({ name, email, password }) {
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      const error = new Error('An account with this email already exists.');
      error.statusCode = 409;
      throw error;
    }

    const password_hash = await hashPassword(password);
    const user = await UserModel.create({
      email,
      password_hash,
      name
    });

    const token = generateToken({ id: user.id, email: user.email });
    const profile = user.profile || await UserModel.getProfile(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || name,
        avatar_url: profile?.avatar_url,
        grade_or_role: profile?.grade_or_role,
        bio: profile?.bio,
        timezone: profile?.timezone,
        theme_preference: profile?.theme_preference || 'dark'
      }
    };
  },

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({ id: user.id, email: user.email });
    const profile = await UserModel.getProfile(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.name || 'Student',
        avatar_url: profile?.avatar_url,
        grade_or_role: profile?.grade_or_role,
        bio: profile?.bio,
        timezone: profile?.timezone,
        theme_preference: profile?.theme_preference || 'dark'
      }
    };
  },

  async getCurrentUser(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const profile = await UserModel.getProfile(userId);
    return {
      id: user.id,
      email: user.email,
      name: profile?.name || 'Student',
      avatar_url: profile?.avatar_url,
      grade_or_role: profile?.grade_or_role,
      bio: profile?.bio,
      timezone: profile?.timezone,
      theme_preference: profile?.theme_preference || 'dark'
    };
  },

  async updateProfile(userId, updates) {
    const updated = await UserModel.updateProfile(userId, updates);
    return updated;
  }
};