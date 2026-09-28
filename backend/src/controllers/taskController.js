import { TaskService } from '../services/taskService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getTasks = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      category_id: req.query.category_id,
      due_date: req.query.due_date,
      time_block: req.query.time_block,
      search: req.query.search || req.query.q
    };
    const tasks = await TaskService.getTasks(req.user.id, filters);
    return sendSuccess(res, 200, 'Tasks retrieved successfully.', { tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskById(req.params.id, req.user.id);
    return sendSuccess(res, 200, 'Task retrieved successfully.', { task });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
      return sendError(res, 400, 'Task title is required.');
    }
    const task = await TaskService.createTask(req.user.id, req.body);
    return sendSuccess(res, 201, 'Task created successfully!', { task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await TaskService.updateTask(req.params.id, req.user.id, req.body);
    return sendSuccess(res, 200, 'Task updated successfully.', { task });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return sendError(res, 400, 'Status is required.');
    }
    const task = await TaskService.updateTaskStatus(req.params.id, req.user.id, status);
    return sendSuccess(res, 200, 'Task status updated.', { task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await TaskService.deleteTask(req.params.id, req.user.id);
    return sendSuccess(res, 200, 'Task deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const addSubtask = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || title.trim().length === 0) {
      return sendError(res, 400, 'Subtask title is required.');
    }
    const subtask = await TaskService.addSubtask(req.params.id, req.user.id, title);
    return sendSuccess(res, 201, 'Subtask added successfully.', { subtask });
  } catch (error) {
    next(error);
  }
};

export const toggleSubtask = async (req, res, next) => {
  try {
    const subtask = await TaskService.toggleSubtask(req.params.id, req.user.id);
    return sendSuccess(res, 200, 'Subtask toggled.', { subtask });
  } catch (error) {
    next(error);
  }
};

export const deleteSubtask = async (req, res, next) => {
  try {
    await TaskService.deleteSubtask(req.params.id, req.user.id);
    return sendSuccess(res, 200, 'Subtask deleted.');
  } catch (error) {
    next(error);
  }
};