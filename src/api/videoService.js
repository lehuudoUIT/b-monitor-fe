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

  // Get video stream URL (without token in query)
  getStreamUrl: (cameraId) => {
    const baseURL = axiosInstance.defaults.baseURL;
    // Ensure proper URL formation with /
    const url = baseURL.endsWith('/') 
      ? `${baseURL}cameras/${cameraId}/stream/`
      : `${baseURL}/cameras/${cameraId}/stream/`;
    return url;
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
};
