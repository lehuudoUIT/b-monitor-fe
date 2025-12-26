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
  const anomaliesByFrameRef = useRef(new Map()); // Map<frameId, anomalies[]>

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [videoInfo, setVideoInfo] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoType, setVideoType] = useState("video/mp4");
  const [isLoadingAnomalies, setIsLoadingAnomalies] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);

  // No fetch interval - render every frame
  const FETCH_INTERVAL = 1;

  // Load video stream with Authorization header
  useEffect(() => {
    let objectUrl = null;

    const loadVideoStream = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const baseURL = axiosInstance.defaults.baseURL;
        const url = `${baseURL}cameras/${cameraId}/stream/`;

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

  // Load all anomalies for this camera once
  useEffect(() => {
    const loadAllAnomalies = async () => {
      setIsLoadingAnomalies(true);
      try {
        const data = await videoAPI.getAllAnomalies(cameraId);
        const anomalies = data.items || [];

        // Organize anomalies by frame_id
        const byFrame = new Map();
        anomalies.forEach((anomaly) => {
          const frameId = anomaly.frame_id;
          if (!byFrame.has(frameId)) {
            byFrame.set(frameId, []);
          }
          byFrame.get(frameId).push(anomaly);
        });

        anomaliesByFrameRef.current = byFrame;
        console.log(
          `Loaded ${anomalies.length} anomalies across ${byFrame.size} frames`
        );
      } catch (error) {
        console.error("Failed to load anomalies:", error);
        anomaliesByFrameRef.current = new Map();
      } finally {
        setIsLoadingAnomalies(false);
      }
    };

    loadAllAnomalies();
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

      // Calculate actual video display dimensions (accounting for object-fit: contain)
      const videoAspect = video.videoWidth / video.videoHeight;
      const canvasAspect = canvas.width / canvas.height;

      let renderWidth, renderHeight, offsetX, offsetY;

      if (videoAspect > canvasAspect) {
        // Video is wider - fit to width
        renderWidth = canvas.width;
        renderHeight = canvas.width / videoAspect;
        offsetX = 0;
        offsetY = (canvas.height - renderHeight) / 2;
      } else {
        // Video is taller - fit to height
        renderHeight = canvas.height;
        renderWidth = canvas.height * videoAspect;
        offsetX = (canvas.width - renderWidth) / 2;
        offsetY = 0;
      }

      // Calculate scale factors based on actual render size
      const scaleX = renderWidth / video.videoWidth;
      const scaleY = renderHeight / video.videoHeight;

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

          // Scale coordinates and apply offset
          const scaledX = x1 * scaleX + offsetX;
          const scaledY = y1 * scaleY + offsetY;
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

    // Get anomalies for current frame from pre-loaded data
    const frameAnomalies = anomaliesByFrameRef.current.get(frame) || [];

    // Draw bounding boxes for current frame
    drawBoundingBoxes(frameAnomalies);

    // Continue animation
    if (videoRef.current && !videoRef.current.paused) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [getCurrentFrame, drawBoundingBoxes]);

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

  // Sync canvas size with video container
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const syncCanvasSize = () => {
      // Set canvas size to match the video element's display size (container)
      const rect = video.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Draw current frame's anomalies after canvas resize
      const frame = getCurrentFrame();
      const frameAnomalies = anomaliesByFrameRef.current.get(frame) || [];
      drawBoundingBoxes(frameAnomalies);
    };

    // Sync on metadata load and window resize
    video.addEventListener("loadedmetadata", syncCanvasSize);
    window.addEventListener("resize", syncCanvasSize);

    // Initial sync
    syncCanvasSize();

    return () => {
      video.removeEventListener("loadedmetadata", syncCanvasSize);
      window.removeEventListener("resize", syncCanvasSize);
    };
  }, [drawBoundingBoxes, getCurrentFrame]);

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
      const frame = getCurrentFrame();
      const frameAnomalies = anomaliesByFrameRef.current.get(frame) || [];
      drawBoundingBoxes(frameAnomalies);
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

  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
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
            className="absolute inset-0 w-full h-full object-contain"
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

              {/* Playback Speed */}
              <div className="relative group/speed">
                <button className="px-3 py-1.5 text-sm hover:bg-cosmic-purple/20 rounded-lg transition-colors text-white">
                  {playbackRate}x
                </button>
                <div className="absolute bottom-full left-0 mb-2 bg-cosmic-deep border border-cosmic-purple-light/30 rounded-lg p-2 opacity-0 group-hover/speed:opacity-100 transition-opacity pointer-events-none group-hover/speed:pointer-events-auto shadow-lg">
                  <div className="flex flex-col gap-1 min-w-[80px]">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`px-3 py-1.5 text-sm rounded transition-colors text-left ${
                          playbackRate === rate
                            ? "bg-cosmic-purple text-white"
                            : "text-cosmic-text hover:bg-cosmic-purple/20"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
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
            {showOverlay &&
              anomaliesByFrameRef.current.get(currentFrame)?.length > 0 && (
                <div className="px-3 py-1.5 rounded-full bg-cosmic-purple/80 backdrop-blur-sm border border-cosmic-purple-light/30 text-white text-xs font-medium">
                  {anomaliesByFrameRef.current.get(currentFrame).length}{" "}
                  Detection(s)
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
