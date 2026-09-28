import { GoalModel } from '../models/Goal.js';

export const GoalService = {
  async getGoals(userId) {
    return await GoalModel.getAll(userId);
  },

  async getGoalById(id, userId) {
    const goal = await GoalModel.findById(id, userId);
    if (!goal) {
      const error = new Error('Goal not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return goal;
  },

  async createGoal(userId, goalData) {
    return await GoalModel.create(userId, goalData);
  },

  async updateGoal(id, userId, updates) {
    const existing = await GoalModel.findById(id, userId);
    if (!existing) {
      const error = new Error('Goal not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return await GoalModel.update(id, userId, updates);
  },

  async deleteGoal(id, userId) {
    const existing = await GoalModel.findById(id, userId);
    if (!existing) {
      const error = new Error('Goal not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return await GoalModel.delete(id, userId);
  }
};