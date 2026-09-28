import api from './api.js';

export const categoryService = {
  async getCategories() {
    const res = await api.get('/categories');
    const data = res.data?.data || res.data;
    return data?.categories || data;
  },

  async createCategory(catData) {
    const res = await api.post('/categories', catData);
    const data = res.data?.data || res.data;
    return data?.category || data;
  },

  async updateCategory(id, catData) {
    const res = await api.put(`/categories/${id}`, catData);
    const data = res.data?.data || res.data;
    return data?.category || data;
  },

  async deleteCategory(id) {
    const res = await api.delete(`/categories/${id}`);
    return res.data?.data || res.data;
  }
};

export default categoryService;