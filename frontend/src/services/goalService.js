import api from './api.js';

export const goalService = {
  async getGoals() {
    const res = await api.get('/goals');
    const data = res.data?.data || res.data;
    return data?.goals || data;
  },

  async getGoalById(id) {
    const res = await api.get(`/goals/${id}`);
    const data = res.data?.data || res.data;
    return data?.goal || data;
  },

  async createGoal(goalData) {
    const res = await api.post('/goals', goalData);
    const data = res.data?.data || res.data;
    return data?.goal || data;
  },

  async updateGoal(id, goalData) {
    const res = await api.put(`/goals/${id}`, goalData);
    const data = res.data?.data || res.data;
    return data?.goal || data;
  },

  async deleteGoal(id) {
    const res = await api.delete(`/goals/${id}`);
    return res.data?.data || res.data;
  }
};

export default goalService;