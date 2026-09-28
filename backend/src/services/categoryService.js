import { CategoryModel } from '../models/Category.js';

export const CategoryService = {
  async getCategories(userId) {
    return await CategoryModel.getAll(userId);
  },

  async createCategory(userId, categoryData) {
    return await CategoryModel.create(userId, categoryData);
  },

  async updateCategory(id, userId, updates) {
    const existing = await CategoryModel.findById(id, userId);
    if (!existing || existing.user_id === null) {
      const error = new Error('Default system categories cannot be modified, or category not found.');
      error.statusCode = 403;
      throw error;
    }
    return await CategoryModel.update(id, userId, updates);
  },

  async deleteCategory(id, userId) {
    const existing = await CategoryModel.findById(id, userId);
    if (!existing || existing.user_id === null) {
      const error = new Error('Default system categories cannot be deleted, or category not found.');
      error.statusCode = 403;
      throw error;
    }
    return await CategoryModel.delete(id, userId);
  }
};