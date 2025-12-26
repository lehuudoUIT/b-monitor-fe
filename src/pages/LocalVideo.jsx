import React, { useState, useEffect } from "react";
import { Video, Upload, Search, Filter } from "lucide-react";
import VideoCard from "../components/VideoCard";
import Button from "../components/Button";
import UploadVideoModal from "../components/UploadVideoModal";
import { videoAPI } from "../api/videoService";

const LocalVideo = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 12,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Load videos
  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const data = await videoAPI.getAllVideos({
        skip: pagination.skip,
        limit: pagination.limit,
      });

      setVideos(data.items || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
      }));
    } catch (error) {
      console.error("Failed to load videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [pagination.skip]);

  // Handle video upload
  const handleUploadSuccess = async (formData) => {
    try {
      await videoAPI.uploadVideo(formData);
      // Reload videos after successful upload
      loadVideos();
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  // Filter videos by search term
  const filteredVideos = videos.filter(
    (video) =>
      video.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const stats = {
    total: pagination.total,
    ready: videos.filter((v) => v.status === "active").length,
    processing: videos.filter((v) => v.status !== "active").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-purple">
            Local Videos
          </h1>
          <p className="text-cosmic-text-dim mt-1">
            Manage and analyze uploaded video files
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsUploadModalOpen(true)}
          className="w-full lg:w-auto"
        >
          <Upload className="w-4 h-4" />
          Upload Video
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Videos */}
        <div className="cosmic-card p-6 hover:border-cosmic-purple hover:shadow-glow-purple transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cosmic-text-dim text-sm font-medium">
                Total Videos
              </p>
              <p className="text-3xl font-bold text-gradient-purple mt-2">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cosmic-purple to-cosmic-cyan flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Ready Videos */}
        <div className="cosmic-card p-6 hover:border-cosmic-cyan hover:shadow-glow-cyan transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cosmic-text-dim text-sm font-medium">Ready</p>
              <p className="text-3xl font-bold text-cosmic-cyan mt-2">
                {stats.ready}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cosmic-cyan/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-cosmic-cyan" />
            </div>
          </div>
        </div>

        {/* Processing Videos */}
        <div className="cosmic-card p-6 hover:border-yellow-500 hover:shadow-glow-yellow transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cosmic-text-dim text-sm font-medium">
                Processing
              </p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">
                {stats.processing}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="cosmic-card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cosmic-text-dim" />
            <input
              type="text"
              placeholder="Search videos by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cosmic-darker/50 border border-cosmic-purple-light/30 rounded-lg text-cosmic-text placeholder-cosmic-text-dim focus:outline-none focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-all"
            />
          </div>

          {/* Filter Button */}
          <Button variant="outline">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Videos Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-cosmic-purple/30 border-t-cosmic-purple rounded-full animate-spin mx-auto"></div>
            <p className="text-cosmic-text-dim">Loading videos...</p>
          </div>
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="cosmic-card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-cosmic-purple/20 flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-cosmic-purple" />
          </div>
          <h3 className="text-xl font-semibold text-cosmic-text mb-2">
            {searchTerm ? "No videos found" : "No videos yet"}
          </h3>
          <p className="text-cosmic-text-dim mb-6">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Upload your first video to get started"}
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="w-4 h-4" />
              Upload Video
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading &&
        filteredVideos.length > 0 &&
        pagination.total > pagination.limit && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  skip: Math.max(0, prev.skip - prev.limit),
                }))
              }
              disabled={pagination.skip === 0}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-cosmic-text-dim">
              Page {Math.floor(pagination.skip / pagination.limit) + 1} of{" "}
              {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  skip: prev.skip + prev.limit,
                }))
              }
              disabled={pagination.skip + pagination.limit >= pagination.total}
            >
              Next
            </Button>
          </div>
        )}

      {/* Upload Modal */}
      <UploadVideoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default LocalVideo;
