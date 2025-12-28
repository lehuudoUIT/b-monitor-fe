import axiosInstance from './axios';
import { toast } from 'react-toastify';

/**
 * Camera APIs
 */
export const cameraAPI = {
  // Get all cameras (youtube type)
  getAllCameras: async (params = { skip: 0, limit: 100 }) => {
    try {
      const response = await axiosInstance.get('/cameras/', {
        params: {
          ...params,
          camera_type: 'youtube',
        },
      });
      return response.data;
    } catch (error) {
      toast.error('Không thể tải danh sách camera');
      throw error;
    }
  },

  // Get camera by ID
  getCameraById: async (cameraId) => {
    try {
      const response = await axiosInstance.get(`/cameras/${cameraId}`);
      return response.data;
    } catch (error) {
      toast.error('Không thể tải thông tin camera');
      throw error;
    }
  },

  // Create new camera
  createCamera: async (cameraData) => {
    try {
      const response = await axiosInstance.post('/cameras/', cameraData);
      toast.success('Tạo camera thành công');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Tạo camera thất bại';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Delete camera
  deleteCamera: async (cameraId) => {
    try {
      const response = await axiosInstance.delete(`/cameras/${cameraId}`);
      toast.success('Xóa camera thành công');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Xóa camera thất bại';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Get stream URL for a camera
  getStreamUrl: (cameraId) => {
    const baseURL = axiosInstance.defaults.baseURL;
    const token = localStorage.getItem('accessToken');
    return `${baseURL}cameras/${cameraId}/stream-youtube?token=${token}`;
  },
};
