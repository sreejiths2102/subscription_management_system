import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
  getToken: () => localStorage.getItem('access_token'),
  getUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};

export const dashboardService = {
  getAdmin: async () => {
    const response = await api.get('/api/dashboard/admin');
    return response.data;
  },
  getStaff: async () => {
    const response = await api.get('/api/dashboard/staff');
    return response.data;
  },
  getCustomer: async () => {
    const response = await api.get('/api/dashboard/customer');
    return response.data;
  },
};

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/products', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/products/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/products', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/products/${id}`, data);
    return response.data;
  },
  delete: async (id, hard = false) => {
    const response = await api.delete(`/api/products/${id}`, { params: { hard_delete: hard } });
    return response.data;
  },
  addVariant: async (productId, data) => {
    const response = await api.post(`/api/products/${productId}/variants`, data);
    return response.data;
  },
  updateVariant: async (productId, variantId, data) => {
    const response = await api.put(`/api/products/${productId}/variants/${variantId}`, data);
    return response.data;
  },
  deleteVariant: async (productId, variantId) => {
    const response = await api.delete(`/api/products/${productId}/variants/${variantId}`);
    return response.data;
  },
};

export const planService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/plans', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/plans/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/plans', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/plans/${id}`, data);
    return response.data;
  },
  delete: async (id, hard = false) => {
    const response = await api.delete(`/api/plans/${id}`, { params: { hard_delete: hard } });
    return response.data;
  },
};

export const customerService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/customers', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/customers', data);
    return response.data;
  },
};

export const subscriptionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/subscriptions', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/subscriptions', data);
    return response.data;
  },
  updateAction: async (id, action) => {
    const response = await api.put(`/api/subscriptions/${id}/action`, null, { params: { action } });
    return response.data;
  },
};

export const invoiceService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/invoices', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/invoices', data);
    return response.data;
  },
};

export const paymentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/payments', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/payments', data);
    return response.data;
  },
};

export const quotationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/quotations', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/quotations', data);
    return response.data;
  },
  getTemplates: async () => {
    const response = await api.get('/api/quotations/templates');
    return response.data;
  },
  createTemplate: async (data) => {
    const response = await api.post('/api/quotations/templates', data);
    return response.data;
  },
  convert: async (id) => {
    const response = await api.post(`/api/quotations/${id}/convert`);
    return response.data;
  },
};

export const taxService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/taxes', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/taxes', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/taxes/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/taxes/${id}`);
    return response.data;
  },
};

export const discountService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/discounts', { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/api/discounts', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/discounts/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/discounts/${id}`);
    return response.data;
  },
};

export const taskService = {
  getAll: async () => {
    const response = await api.get('/api/tasks');
    return response.data;
  },
  toggle: async (id) => {
    const response = await api.put(`/api/tasks/${id}/toggle`);
    return response.data;
  },
};

export const userService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/users', { params });
    return response.data;
  },
};

export const reportService = {
  get: async (params = {}) => {
    const response = await api.get('/api/reports', { params });
    return response.data;
  },
};

export default api;
