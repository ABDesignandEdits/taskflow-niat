import api from './api.js';

export const authService = {
  async register(emailOrObj, password, name) {
    const payload = typeof emailOrObj === 'object'
      ? emailOrObj
      : { email: emailOrObj, password, name };
    const res = await api.post('/auth/register', payload);
    const data = res.data?.data || res.data;
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async login(emailOrObj, password) {
    const payload = typeof emailOrObj === 'object'
      ? emailOrObj
      : { email: emailOrObj, password };
    const res = await api.post('/auth/login', payload);
    const data = res.data?.data || res.data;
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    const data = res.data?.data || res.data;
    return data?.user || data;
  },

  async getMe() {
    return this.getCurrentUser();
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout network errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
    }
  },

  async updateProfile(data) {
    const res = await api.put('/user/profile', data);
    return res.data?.data || res.data;
  },

  async seedDemoData() {
    const res = await api.post('/user/seed-demo');
    return res.data?.data || res.data;
  }
};

export default authService;