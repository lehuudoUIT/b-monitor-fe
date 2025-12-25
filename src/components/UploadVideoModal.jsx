import React, { useState } from "react";
import { X, Upload, Video, MapPin } from "lucide-react";
import Button from "./Button";

const UploadVideoModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    file: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file || !formData.name) {
      return;
    }

    setIsUploading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", formData.file);
      uploadFormData.append("name", formData.name);
      uploadFormData.append("location", formData.location);

      await onUploadSuccess(uploadFormData);

      // Reset form
      setFormData({ name: "", location: "", file: null });
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cosmic-deep/80 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="cosmic-card w-full max-w-2xl mx-4 relative animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cosmic-purple-light/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cosmic-purple to-cosmic-cyan flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-cosmic-text">
                Upload Video
              </h2>
              <p className="text-sm text-cosmic-text-dim">
                Upload a new video for analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cosmic-purple/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-cosmic-text-dim" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Video Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cosmic-text flex items-center gap-2">
              <Video className="w-4 h-4 text-cosmic-purple" />
              Video Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter video name"
              className="w-full px-4 py-3 bg-cosmic-darker/50 border border-cosmic-purple-light/30 rounded-lg text-cosmic-text placeholder-cosmic-text-dim focus:outline-none focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-all"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cosmic-text flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cosmic-cyan" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter location (optional)"
              className="w-full px-4 py-3 bg-cosmic-darker/50 border border-cosmic-purple-light/30 rounded-lg text-cosmic-text placeholder-cosmic-text-dim focus:outline-none focus:border-cosmic-cyan focus:ring-2 focus:ring-cosmic-cyan/20 transition-all"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cosmic-text flex items-center gap-2">
              <Upload className="w-4 h-4 text-cosmic-purple" />
              Video File <span className="text-red-400">*</span>
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? "border-cosmic-purple bg-cosmic-purple/10"
                  : "border-cosmic-purple-light/30 hover:border-cosmic-purple/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />

              {formData.file ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-cyan flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-cosmic-text font-medium">
                    {formData.file.name}
                  </p>
                  <p className="text-sm text-cosmic-text-dim">
                    {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, file: null }))
                    }
                    className="text-sm text-cosmic-purple hover:text-cosmic-purple-light transition-colors"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-cosmic-purple/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-cosmic-purple" />
                  </div>
                  <div>
                    <p className="text-cosmic-text font-medium">
                      Drag and drop your video here
                    </p>
                    <p className="text-sm text-cosmic-text-dim mt-1">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-xs text-cosmic-text-dim">
                    Supported formats: MP4, AVI, MOV, MKV
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={!formData.file || !formData.name || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideoModal;
