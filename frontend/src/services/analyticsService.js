import api from './api.js';

export const analyticsService = {
  async getOverview() {
    const res = await api.get('/analytics/overview');
    return res.data?.data || res.data;
  }
};

export default analyticsService;