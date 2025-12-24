import axiosInstance from './axios';
import { toast } from 'react-toastify';

// Example API service functions

/**
 * Authentication APIs
 */
export const authAPI = {
  // Register
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Đăng ký thất bại';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      
      // Save token to localStorage
      if (response.data.access_token) {
        localStorage.setItem('accessToken', response.data.access_token);
      }
      
      toast.success('Đăng nhập thành công!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Đăng nhập thất bại';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    toast.info('Đã đăng xuất');
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/users/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 403) {
        localStorage.removeItem('accessToken');
      }
      toast.error('Không thể lấy thông tin người dùng');
      throw error;
    }
  },
};

/**
 * Camera APIs
 */
export const cameraAPI = {
  // Get all cameras
  getAllCameras: async () => {
    try {
      const response = await axiosInstance.get('/cameras');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch cameras');
      throw error;
    }
  },

  // Get camera by ID
  getCameraById: async (cameraId) => {
    try {
      const response = await axiosInstance.get(`/cameras/${cameraId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch camera details');
      throw error;
    }
  },

  // Create new camera
  createCamera: async (cameraData) => {
    try {
      const response = await axiosInstance.post('/cameras', cameraData);
      toast.success('Camera added successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to add camera');
      throw error;
    }
  },

  // Update camera
  updateCamera: async (cameraId, cameraData) => {
    try {
      const response = await axiosInstance.put(`/cameras/${cameraId}`, cameraData);
      toast.success('Camera updated successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to update camera');
      throw error;
    }
  },

  // Delete camera
  deleteCamera: async (cameraId) => {
    try {
      const response = await axiosInstance.delete(`/cameras/${cameraId}`);
      toast.success('Camera deleted successfully');
      return response.data;
    } catch (error) {
      toast.error('Failed to delete camera');
      throw error;
    }
  },
};

/**
 * Violation/Anomaly APIs
 */
export const violationAPI = {
  // Get all violations
  getAllViolations: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/violations', { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch violations');
      throw error;
    }
  },

  // Get violations by camera
  getViolationsByCamera: async (cameraId, params = {}) => {
    try {
      const response = await axiosInstance.get(`/violations/camera/${cameraId}`, { params });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch camera violations');
      throw error;
    }
  },

  // Get violation by ID
  getViolationById: async (violationId) => {
    try {
      const response = await axiosInstance.get(`/violations/${violationId}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch violation details');
      throw error;
    }
  },
};

/**
 * Analytics APIs
 */
export const analyticsAPI = {
  // Get statistics
  getStatistics: async (period = 'week') => {
    try {
      const response = await axiosInstance.get('/analytics/statistics', {
        params: { period },
      });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch statistics');
      throw error;
    }
  },

  // Get weekly violations
  getWeeklyViolations: async () => {
    try {
      const response = await axiosInstance.get('/analytics/weekly');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch weekly data');
      throw error;
    }
  },

  // Get violation types distribution
  getViolationTypes: async () => {
    try {
      const response = await axiosInstance.get('/analytics/violation-types');
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch violation types');
      throw error;
    }
  },
};

export default axiosInstance;
