import React, { useState, useEffect } from "react";
import { X, Video, MapPin, Link2, Clock, Monitor, Edit } from "lucide-react";
import Button from "./Button";

const UpdateCameraModal = ({ isOpen, onClose, onSuccess, camera }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    url: "",
    fps: 30,
    resolution: "1280x720",
    status: "inactive",
    type: "youtube",
    thumbnail: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load camera data when modal opens
  useEffect(() => {
    if (camera) {
      setFormData({
        name: camera.name || "",
        location: camera.location || "",
        url: camera.url || "",
        fps: camera.fps || 30,
        resolution: camera.resolution || "1280x720",
        status: camera.status || "inactive",
        type: camera.type || "youtube",
        thumbnail: camera.thumbnail || "",
      });
    }
  }, [camera]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSuccess(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update camera:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="cosmic-card max-w-2xl w-full p-6 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-cosmic-purple/20 flex items-center justify-center border border-cosmic-purple-light/30">
              <Edit className="w-6 h-6 text-cosmic-purple" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-cosmic-text">
                Cập Nhật Camera
              </h3>
              <p className="text-sm text-cosmic-text-dim">
                Chỉnh sửa thông tin camera YouTube
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-cosmic-purple/20 hover:bg-cosmic-purple/30 flex items-center justify-center transition-colors border border-cosmic-purple-light/30"
          >
            <X className="w-5 h-5 text-cosmic-purple" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Camera Name */}
          <div>
            <label className="block text-sm font-medium text-cosmic-text mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cosmic-purple" />
                Tên Camera <span className="text-red-400">*</span>
              </div>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Camera Ngã Tư Lê Lợi"
              className="w-full px-4 py-3 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text placeholder-cosmic-text-dim focus:outline-none focus:border-cosmic-purple transition-colors"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-cosmic-text mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cosmic-cyan" />
                Vị Trí <span className="text-red-400">*</span>
              </div>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Ví dụ: Quận 1, TP.HCM"
              className="w-full px-4 py-3 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text placeholder-cosmic-text-dim focus:outline-none focus:border-cosmic-cyan transition-colors"
            />
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium text-cosmic-text mb-2">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-red-400" />
                YouTube URL <span className="text-red-400">*</span>
              </div>
            </label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text placeholder-cosmic-text-dim focus:outline-none focus:border-red-400 transition-colors"
            />
            <p className="text-xs text-cosmic-text-dim mt-1">
              Nhập URL của livestream hoặc video YouTube
            </p>
          </div>

          {/* Resolution & FPS Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Resolution */}
            <div>
              <label className="block text-sm font-medium text-cosmic-text mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cosmic-purple" />
                  Độ Phân Giải
                </div>
              </label>
              <select
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text focus:outline-none focus:border-cosmic-purple transition-colors"
              >
                <option value="640x480">640x480 (SD)</option>
                <option value="1280x720">1280x720 (HD)</option>
                <option value="1920x1080">1920x1080 (Full HD)</option>
              </select>
            </div>

            {/* FPS */}
            <div>
              <label className="block text-sm font-medium text-cosmic-text mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cosmic-cyan" />
                  FPS
                </div>
              </label>
              <input
                type="number"
                name="fps"
                value={formData.fps}
                onChange={handleChange}
                min="1"
                max="60"
                className="w-full px-4 py-3 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text focus:outline-none focus:border-cosmic-cyan transition-colors"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-cosmic-text mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-cosmic-purple" />
                Trạng Thái
              </div>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text focus:outline-none focus:border-cosmic-purple transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-cosmic-purple to-cosmic-purple-dark text-white border-cosmic-purple-light/50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Cập Nhật
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCameraModal;
