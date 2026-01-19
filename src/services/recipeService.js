import api from './api';

export const recipeService = {
  // Lấy danh sách công thức (có thể có query params)
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/recipes', { params });
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  // Lấy công thức theo ID
  getById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  // Tạo công thức mới
  create: async (recipeData) => {
    try {
      const response = await api.post('/recipes', recipeData);
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  // Cập nhật công thức
  update: async (id, recipeData) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  // Xóa công thức
  delete: async (id) => {
    try {
      const response = await api.delete(`/recipes/${id}`);
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  // Lấy các danh mục liên quan (nếu có API riêng)
  getRegions: async () => {
    try {
      // Giả sử có endpoint riêng cho regions
      const response = await api.get('/regions');
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  getDifficulties: async () => {
    try {
      // Giả sử có endpoint riêng cho difficulties
      const response = await api.get('/difficulties');
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  getEvents: async () => {
    try {
      // Giả sử có endpoint riêng cho events
      const response = await api.get('/events');
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      // Giả sử có endpoint riêng cho categories
      const response = await api.get('/recipe-categories');
      return response;
    } catch (error) {
      console.error('Recipe Service Error:', error);
      throw error;
    }
  }
};