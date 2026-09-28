import { TaskModel } from '../models/Task.js';
import { SubtaskModel } from '../models/Subtask.js';

export const TaskService = {
  async getTasks(userId, filters) {
    return await TaskModel.getAll(userId, filters);
  },

  async getTaskById(id, userId) {
    const task = await TaskModel.findById(id, userId);
    if (!task) {
      const error = new Error('Task not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return task;
  },

  async createTask(userId, taskData) {
    return await TaskModel.create(userId, taskData);
  },

  async updateTask(id, userId, updates) {
    const existing = await TaskModel.findById(id, userId);
    if (!existing) {
      const error = new Error('Task not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return await TaskModel.update(id, userId, updates);
  },

  async updateTaskStatus(id, userId, status) {
    const existing = await TaskModel.findById(id, userId);
    if (!existing) {
      const error = new Error('Task not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return await TaskModel.update(id, userId, { status });
  },

  async deleteTask(id, userId) {
    const existing = await TaskModel.findById(id, userId);
    if (!existing) {
      const error = new Error('Task not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return await TaskModel.delete(id, userId);
  },

  async addSubtask(taskId, userId, title) {
    const existing = await TaskModel.findById(taskId, userId);
    if (!existing) {
      const error = new Error('Task not found or access denied.');
      error.statusCode = 404;
      throw error;
    }
    return await SubtaskModel.create(taskId, { title });
  },

  async toggleSubtask(subtaskId, userId) {
    return await SubtaskModel.toggle(subtaskId);
  },

  async deleteSubtask(subtaskId, userId) {
    return await SubtaskModel.delete(subtaskId);
  }
};