import api from './api.js';

export const authService = {
  async register(arg1, arg2, arg3) {
    let payload = {};
    if (typeof arg1 === 'object') {
      payload = arg1;
    } else if (typeof arg1 === 'string' && arg1.includes('@')) {
      // (email, password, name)
      payload = { email: arg1, password: arg2, name: arg3 || 'Student' };
    } else if (typeof arg2 === 'string' && arg2.includes('@')) {
      // (name, email, password)
      payload = { name: arg1, email: arg2, password: arg3 };
    } else {
      payload = { name: arg1, email: arg2, password: arg3 };
    }

    const res = await api.post('/auth/register', payload);
    const data = res.data?.data || res.data;
    if (data?.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },

  async login(arg1, arg2) {
    let payload = {};
    if (typeof arg1 === 'object') {
      payload = arg1;
    } else {
      payload = { email: arg1, password: arg2 };
    }

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