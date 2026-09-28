import api from './api.js';

export const taskService = {
  async getTasks(params = {}) {
    const res = await api.get('/tasks', { params });
    const data = res.data?.data || res.data;
    return data?.tasks || data;
  },

  async getTaskById(id) {
    const res = await api.get(`/tasks/${id}`);
    const data = res.data?.data || res.data;
    return data?.task || data;
  },

  async createTask(taskData) {
    const res = await api.post('/tasks', taskData);
    const data = res.data?.data || res.data;
    return data?.task || data;
  },

  async updateTask(id, taskData) {
    const res = await api.put(`/tasks/${id}`, taskData);
    const data = res.data?.data || res.data;
    return data?.task || data;
  },

  async updateTaskStatus(id, status) {
    const res = await api.patch(`/tasks/${id}/status`, { status });
    const data = res.data?.data || res.data;
    return data?.task || data;
  },

  async deleteTask(id) {
    const res = await api.delete(`/tasks/${id}`);
    return res.data?.data || res.data;
  },

  async addSubtask(taskId, title) {
    const res = await api.post(`/tasks/${taskId}/subtasks`, { title });
    const data = res.data?.data || res.data;
    return data?.subtask || data;
  },

  async toggleSubtask(subtaskId) {
    const res = await api.patch(`/tasks/subtasks/${subtaskId}/toggle`);
    const data = res.data?.data || res.data;
    return data?.subtask || data;
  },

  async deleteSubtask(subtaskId) {
    const res = await api.delete(`/tasks/subtasks/${subtaskId}`);
    return res.data?.data || res.data;
  }
};

export default taskService;