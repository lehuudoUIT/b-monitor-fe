import axiosInstance from './axios';
import { toast } from 'react-toastify';

/**
 * Video/Camera APIs
 */
export const videoAPI = {
  // Get all videos (local type)
  getAllVideos: async (params = { skip: 0, limit: 10 }) => {
    try {
      const response = await axiosInstance.get('/cameras/', {
        params: {
          ...params,
          camera_type: 'local',
        },
      });
      return response.data;
    } catch (error) {
      toast.error('Không thể tải danh sách video');
      throw error;
    }
  },

  // Get video by ID
  getVideoById: async (cameraId) => {
    try {
      const response = await axiosInstance.get(`/cameras/${cameraId}`);
      return response.data;
    } catch (error) {
      toast.error('Không thể tải thông tin video');
      throw error;
    }
  },

  // Upload video
  uploadVideo: async (formData) => {
    try {
      const response = await axiosInstance.post('/cameras/upload-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Upload video thành công');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Upload video thất bại';
      toast.error(errorMessage);
      throw error;
    }
  },

  // Update video
  updateVideo: async (videoId, videoData) => {
    try {
      const response = await axiosInstance.put(`/cameras/${videoId}`, videoData);
      toast.success('Cập nhật video thành công');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Cập nhật video thất bại';
      toast.error(errorMessage);
      throw error;
    }
  },


  // Get frame metadata
  getFrameMetadata: async (frameId, cameraId) => {
    try {
          const response = await axiosInstance.get(`/anomalies/frame/${frameId}` , {
        params: { camera_id: cameraId },
      });
      return response.data;
    } catch (error) {
      // Silent fail for metadata - don't show toast for every frame
      console.error('Failed to fetch metadata:', error);
      throw error;
    }
  },

  // Get all anomalies for a camera
  getAllAnomalies: async (cameraId, order = 'asc') => {
    try {
      const response = await axiosInstance.get(`/anomalies/camera/${cameraId}`, {
        params: { order },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch anomalies:', error);
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (cameraId) => {
    try {
      const response = await axiosInstance.delete(`/cameras/${cameraId}`);
      toast.success('Xóa video thành công');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Xóa video thất bại';
      toast.error(errorMessage);
      throw error;
    }
  },
}