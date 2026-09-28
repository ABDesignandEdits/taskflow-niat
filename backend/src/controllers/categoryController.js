import { CategoryService } from '../services/categoryService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryService.getCategories(req.user.id);
    return sendSuccess(res, 200, 'Categories retrieved successfully.', { categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    if (!name || name.trim().length === 0) {
      return sendError(res, 400, 'Category name is required.');
    }
    const category = await CategoryService.createCategory(req.user.id, { name, color, icon });
    return sendSuccess(res, 201, 'Category created successfully.', { category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.updateCategory(req.params.id, req.user.id, req.body);
    return sendSuccess(res, 200, 'Category updated successfully.', { category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await CategoryService.deleteCategory(req.params.id, req.user.id);
    return sendSuccess(res, 200, 'Category deleted successfully.');
  } catch (error) {
    next(error);
  }
};