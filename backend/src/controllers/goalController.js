import { GoalService } from '../services/goalService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getGoals = async (req, res, next) => {
  try {
    const goals = await GoalService.getGoals(req.user.id);
    return sendSuccess(res, 200, 'Goals retrieved successfully.', { goals, count: goals.length });
  } catch (error) {
    next(error);
  }
};

export const getGoalById = async (req, res, next) => {
  try {
    const goal = await GoalService.getGoalById(req.params.id, req.user.id);
    return sendSuccess(res, 200, 'Goal retrieved successfully.', { goal });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
      return sendError(res, 400, 'Goal title is required.');
    }
    const goal = await GoalService.createGoal(req.user.id, req.body);
    return sendSuccess(res, 201, 'Goal created successfully!', { goal });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const goal = await GoalService.updateGoal(req.params.id, req.user.id, req.body);
    return sendSuccess(res, 200, 'Goal updated successfully.', { goal });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    await GoalService.deleteGoal(req.params.id, req.user.id);
    return sendSuccess(res, 200, 'Goal deleted successfully.');
  } catch (error) {
    next(error);
  }
};