import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Video,
  MapPin,
  Calendar,
  Activity,
  Clock,
} from "lucide-react";
import OptimizedVideoStream from "../components/OptimizedVideoStream";
import AnomalyPanel from "../components/AnomalyPanel";
import Button from "../components/Button";
import { videoAPI } from "../api/videoService";
import { format } from "date-fns";

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideoInfo = async () => {
      setIsLoading(true);
      try {
        const data = await videoAPI.getVideoById(videoId);
        setVideoInfo(data);
      } catch (error) {
        console.error("Failed to load video info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoInfo();
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cosmic-purple/30 border-t-cosmic-purple rounded-full animate-spin mx-auto"></div>
          <p className="text-cosmic-text-dim">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!videoInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-cosmic-purple/20 flex items-center justify-center mx-auto">
            <Video className="w-10 h-10 text-cosmic-purple" />
          </div>
          <h3 className="text-xl font-semibold text-cosmic-text">
            Video not found
          </h3>
          <Button variant="primary" onClick={() => navigate("/local-video")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Videos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/local-video")}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gradient-purple">
            {videoInfo.name}
          </h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-cosmic-text-dim">
            {videoInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {videoInfo.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(videoInfo.created_at), "MMM dd, yyyy")}
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status */}
        <div className="cosmic-card p-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                videoInfo.status === "active"
                  ? "bg-cosmic-cyan/20"
                  : "bg-yellow-500/20"
              }`}
            >
              <Activity
                className={`w-5 h-5 ${
                  videoInfo.status === "active"
                    ? "text-cosmic-cyan"
                    : "text-yellow-400"
                }`}
              />
            </div>
            <div>
              <p className="text-xs text-cosmic-text-dim">Status</p>
              <p
                className={`text-sm font-semibold ${
                  videoInfo.status === "active"
                    ? "text-cosmic-cyan"
                    : "text-yellow-400"
                }`}
              >
                {videoInfo.status === "active" ? "Ready" : "Processing"}
              </p>
            </div>
          </div>
        </div>

        {/* FPS */}
        <div className="cosmic-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cosmic-purple/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-cosmic-purple" />
            </div>
            <div>
              <p className="text-xs text-cosmic-text-dim">Frame Rate</p>
              <p className="text-sm font-semibold text-cosmic-purple">
                {videoInfo.fps} FPS
              </p>
            </div>
          </div>
        </div>

        {/* Resolution */}
        <div className="cosmic-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cosmic-purple to-cosmic-cyan flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-cosmic-text-dim">Resolution</p>
              <p className="text-sm font-semibold text-cosmic-text">
                {videoInfo.resolution}
              </p>
            </div>
          </div>
        </div>

        {/* Type */}
        <div className="cosmic-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cosmic-cyan/20 flex items-center justify-center">
              <Video className="w-5 h-5 text-cosmic-cyan" />
            </div>
            <div>
              <p className="text-xs text-cosmic-text-dim">Type</p>
              <p className="text-sm font-semibold text-cosmic-cyan capitalize">
                {videoInfo.type}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Video Player + Anomaly Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Video Player - 70% */}
        <div className="lg:col-span-7">
          <OptimizedVideoStream cameraId={videoId} />
        </div>

        {/* Anomaly Panel - 30% */}
        <div className="lg:col-span-3">
          <AnomalyPanel cameraId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
