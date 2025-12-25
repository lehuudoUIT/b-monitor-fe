import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Eye,
  EyeOff,
} from "lucide-react";
import { videoAPI } from "../api/videoService";
import axiosInstance from "../api/axios";

/**
 * OptimizedVideoStream Component
 *
 * Optimized video player with metadata overlay
 * Features:
 * - Selective metadata fetching (not every frame)
 * - Frame-accurate bbox synchronization
 * - Metadata caching
 * - Smooth bbox rendering with requestAnimationFrame
 */
const OptimizedVideoStream = ({ cameraId }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const metadataCacheRef = useRef(new Map());
  const lastFetchedFrameRef = useRef(-1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [videoInfo, setVideoInfo] = useState(null);
  const [currentMetadata, setCurrentMetadata] = useState([]);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoType, setVideoType] = useState("video/mp4");

  // Fetch interval: fetch metadata every N frames
  const FETCH_INTERVAL = 5; // Fetch every 5 frames
  const METADATA_CACHE_SIZE = 100; // Cache up to 100 frames

  // Load video stream with Authorization header
  useEffect(() => {
    let objectUrl = null;

    const loadVideoStream = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const baseURL = axiosInstance.defaults.baseURL;
        const url = baseURL.endsWith("/")
          ? `${baseURL}cameras/${cameraId}/stream/`
          : `${baseURL}/cameras/${cameraId}/stream/`;

        // Use fetch API for better blob handling
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load video: ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "video/mp4";
        const blob = await response.blob();

        // Create blob with proper content-type
        const typedBlob = new Blob([blob], { type: contentType });
        objectUrl = URL.createObjectURL(typedBlob);
        setVideoSrc(objectUrl);
        setVideoType(contentType);
        console.log(
          "Video loaded successfully:",
          objectUrl,
          "Type:",
          contentType
        );
      } catch (error) {
        console.error("Failed to load video stream:", error);
      }
    };

    loadVideoStream();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [cameraId]);

  // Load video info
  useEffect(() => {
    const loadVideoInfo = async () => {
      try {
        const data = await videoAPI.getVideoById(cameraId);
        setVideoInfo(data);
      } catch (error) {
        console.error("Failed to load video info:", error);
      }
    };

    loadVideoInfo();
  }, [cameraId]);

  // Calculate current frame from video time
  const getCurrentFrame = useCallback(() => {
    if (!videoRef.current || !videoInfo) return 0;
    const fps = videoInfo.fps || 30;
    return Math.floor(videoRef.current.currentTime * fps);
  }, [videoInfo]);

  // Fetch metadata for a specific frame
  const fetchFrameMetadata = useCallback(
    async (frameId) => {
      // Check cache first
      if (metadataCacheRef.current.has(frameId)) {
        return metadataCacheRef.current.get(frameId);
      }

      try {
        const response = await videoAPI.getFrameMetadata(frameId, cameraId);
        const metadata = response.items || [];

        // Update cache
        metadataCacheRef.current.set(frameId, metadata);

        // Limit cache size
        if (metadataCacheRef.current.size > METADATA_CACHE_SIZE) {
          const firstKey = metadataCacheRef.current.keys().next().value;
          metadataCacheRef.current.delete(firstKey);
        }

        return metadata;
      } catch (error) {
        // Silent fail - return empty array
        return [];
      }
    },
    [cameraId]
  );

  // Draw bounding boxes on canvas
  const drawBoundingBoxes = useCallback(
    (metadata) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video || !showOverlay || metadata.length === 0) {
        // Clear canvas if no overlay
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        return;
      }

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check if video dimensions are valid
      if (!video.videoWidth || !video.videoHeight) {
        console.warn("Video dimensions not ready");
        return;
      }

      // Calculate scale factors
      const scaleX = canvas.width / video.videoWidth;
      const scaleY = canvas.height / video.videoHeight;

      metadata.forEach((item) => {
        try {
          if (!item.bounding_box) return;

          // Parse bounding box: "x1,y1,x2,y2"
          const coords = item.bounding_box.split(",").map(Number);

          // Validate coordinates
          if (coords.length !== 4 || coords.some(isNaN)) {
            console.warn("Invalid bounding box format:", item.bounding_box);
            return;
          }

          const [x1, y1, x2, y2] = coords;

          // Scale coordinates
          const scaledX = x1 * scaleX;
          const scaledY = y1 * scaleY;
          const scaledWidth = (x2 - x1) * scaleX;
          const scaledHeight = (y2 - y1) * scaleY;

          // Skip invalid dimensions
          if (scaledWidth <= 0 || scaledHeight <= 0) {
            console.warn("Invalid bbox dimensions");
            return;
          }

          // Determine color based on level
          let color;
          switch (item.level) {
            case "critical":
              color = "#ef4444"; // red
              break;
            case "warning":
              color = "#f59e0b"; // orange
              break;
            default:
              color = "#a855f7"; // purple
          }

          // Draw bounding box
          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);

          // Draw label background
          const label = `${item.class_name || "Unknown"} (${
            item.anomaly_score?.toFixed(2) || "N/A"
          })`;
          ctx.font = "14px Inter, system-ui, sans-serif";
          const textWidth = ctx.measureText(label).width;
          const padding = 6;

          ctx.fillStyle = color;
          ctx.fillRect(scaledX, scaledY - 24, textWidth + padding * 2, 24);

          // Draw label text
          ctx.fillStyle = "#ffffff";
          ctx.fillText(label, scaledX + padding, scaledY - 7);
        } catch (error) {
          console.error("Error drawing bbox:", error, item);
        }
      });
    },
    [showOverlay]
  );

  // Animation loop for smooth rendering
  const animate = useCallback(() => {
    if (!videoRef.current) return;

    const frame = getCurrentFrame();
    setCurrentFrame(frame);

    // Only fetch metadata if video is playing and frame > 0
    if (
      frame > 0 &&
      frame !== lastFetchedFrameRef.current &&
      frame % FETCH_INTERVAL === 0
    ) {
      lastFetchedFrameRef.current = frame;

      fetchFrameMetadata(frame)
        .then((metadata) => {
          setCurrentMetadata(metadata || []);
        })
        .catch((error) => {
          console.error("Error fetching metadata for frame", frame, error);
          // Don't update metadata on error - keep previous
        });
    }

    // Draw current metadata
    drawBoundingBoxes(currentMetadata);

    // Continue animation
    if (videoRef.current && !videoRef.current.paused) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [getCurrentFrame, fetchFrameMetadata, drawBoundingBoxes, currentMetadata]);

  // Handle video play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      animationRef.current = requestAnimationFrame(animate);
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Sync canvas size with video
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const syncCanvasSize = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawBoundingBoxes(currentMetadata);
    };

    video.addEventListener("loadedmetadata", syncCanvasSize);

    return () => {
      video.removeEventListener("loadedmetadata", syncCanvasSize);
    };
  }, [drawBoundingBoxes, currentMetadata]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
    if (!showOverlay) {
      // Re-draw when enabling
      drawBoundingBoxes(currentMetadata);
    } else {
      // Clear when disabling
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (container) {
      if (!document.fullscreenElement) {
        container.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative cosmic-card p-0 overflow-hidden group">
        <div className="relative bg-cosmic-darker aspect-video">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
            playsInline
            controls={false}
          >
            {videoSrc && <source src={videoSrc} type={videoType} />}
          </video>

          {/* Canvas Overlay for Bounding Boxes */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cosmic-deep/90 via-cosmic-deep/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-cosmic-purple/20 rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Volume */}
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-cosmic-purple/20 rounded-lg transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Frame Counter */}
              <div className="text-sm text-cosmic-text-dim">
                Frame: {currentFrame}
              </div>

              <div className="flex-1"></div>

              {/* Overlay Toggle */}
              <button
                onClick={toggleOverlay}
                className={`p-2 rounded-lg transition-colors ${
                  showOverlay
                    ? "bg-cosmic-purple/20 text-cosmic-purple"
                    : "hover:bg-cosmic-purple/20 text-white"
                }`}
                title={showOverlay ? "Hide Overlay" : "Show Overlay"}
              >
                {showOverlay ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-cosmic-purple/20 rounded-lg transition-colors"
              >
                <Maximize className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Overlay Status */}
          <div className="absolute top-4 right-4">
            {showOverlay && currentMetadata.length > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-cosmic-purple/80 backdrop-blur-sm border border-cosmic-purple-light/30 text-white text-xs font-medium">
                {currentMetadata.length} Detection(s)
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Info */}
      {videoInfo && (
        <div className="cosmic-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-cosmic-text-dim">
                Video Information
              </h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-cosmic-text">
                  <span className="text-cosmic-text-dim">Resolution:</span>{" "}
                  {videoInfo.resolution}
                </p>
                <p className="text-sm text-cosmic-text">
                  <span className="text-cosmic-text-dim">FPS:</span>{" "}
                  {videoInfo.fps}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-cosmic-text-dim">Current Frame</div>
              <div className="text-2xl font-bold text-gradient-purple">
                {currentFrame}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedVideoStream;
