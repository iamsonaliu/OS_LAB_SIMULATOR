import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// CPU Scheduling API
export const cpuAPI = {
  simulate: async (data) => {
    try {
      const response = await api.post('/api/simulate/cpu/', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'CPU simulation failed');
    }
  },
  
  getAlgorithms: async () => {
    try {
      const response = await api.get('/api/simulate/cpu/algorithms');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch CPU algorithms');
    }
  },
};

// Page Replacement API
export const pageAPI = {
  simulate: async (data) => {
    try {
      const response = await api.post('/api/simulate/page/', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Page simulation failed');
    }
  },
  
  getAlgorithms: async () => {
    try {
      const response = await api.get('/api/simulate/page/algorithms');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch page algorithms');
    }
  },
};

// Disk Scheduling API
export const diskAPI = {
  simulate: async (data) => {
    try {
      const response = await api.post('/api/simulate/disk/', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Disk simulation failed');
    }
  },
  
  getAlgorithms: async () => {
    try {
      const response = await api.get('/api/simulate/disk/algorithms');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch disk algorithms');
    }
  },
};

export default api;