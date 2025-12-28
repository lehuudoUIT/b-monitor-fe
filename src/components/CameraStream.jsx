import React, { useRef, useEffect, useState } from "react";
import { Wifi } from "lucide-react";
import axiosInstance from "../api/axios";

/**
 * CameraStream Component
 *
 * Streams camera feed from backend API
 * Backend returns MJPEG stream (multipart/x-mixed-replace)
 * Automatically starts streaming when mounted and stops when unmounted
 *
 * Solution: Uses session_id to track connection and sends abort signal on unmount
 */
const CameraStream = ({ cameraId }) => {
  const imgRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const streamUrlRef = useRef(null);
  const sessionIdRef = useRef(null);
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(false);

  useEffect(() => {
    if (!cameraId) return;

    // Mark as mounted
    isMountedRef.current = true;

    // Generate unique session ID for this stream
    const sessionId = `stream_${cameraId}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionIdRef.current = sessionId;

    // Create AbortController for this session
    abortControllerRef.current = new AbortController();

    // Get the stream URL with auth token and session_id
    const baseURL =
      import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8000/api";
    const token = localStorage.getItem("accessToken");
    const streamUrl = `${baseURL}cameras/${cameraId}/stream-youtube?token=${token}&session_id=${sessionId}`;

    streamUrlRef.current = streamUrl;

    // Set the image source to start streaming
    if (imgRef.current) {
      imgRef.current.src = streamUrl;
      setIsConnected(true);
    }

    console.log("Stream started with session:", sessionId);

    // Cleanup function - stop streaming when component unmounts
    return () => {
      // Only cleanup if component was actually mounted (not in StrictMode double-mount)
      if (!isMountedRef.current) {
        console.log("Skipping cleanup - component not fully mounted");
        return;
      }

      console.log("Cleaning up stream session:", sessionIdRef.current);

      // Stop the stream by clearing image src
      if (imgRef.current) {
        imgRef.current.src = "";
      }
      setIsConnected(false);

      // Abort the stream connection
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Send stop signal to backend using fetch with keepalive
      // This ensures the request completes even if page is unloading
      if (sessionIdRef.current) {
        const stopUrl = `${baseURL}cameras/${cameraId}/stop-stream`;
        const token = localStorage.getItem("accessToken");

        // Use fetch with keepalive instead of axios in cleanup
        // This works better during page unload
        fetch(stopUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_id: sessionIdRef.current,
          }),
          keepalive: true, // Important: keeps request alive during page unload
        })
          .then(() => {
            console.log(
              "Stream stop signal sent for session:",
              sessionIdRef.current
            );
          })
          .catch((error) => {
            console.warn("Failed to send stop signal:", error);
          });
      }

      streamUrlRef.current = null;
      sessionIdRef.current = null;
      isMountedRef.current = false;
    };
  }, [cameraId]);

  const handleImageLoad = () => {
    setIsConnected(true);
    setError(null);
  };

  const handleImageError = (e) => {
    setIsConnected(false);
    setError("Failed to connect to camera stream");
    console.error("Stream error:", e);
  };

  return (
    <div className="cosmic-card overflow-hidden h-full flex flex-col">
      {/* Stream Header */}
      <div className="px-4 py-3 border-b border-cosmic-purple-light/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
              isConnected
                ? "bg-red-600/20 border-red-500/30"
                : "bg-gray-600/20 border-gray-500/30"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-red-500 animate-pulse" : "bg-gray-500"
              }`}
            ></div>
            <span
              className={`text-xs font-medium ${
                isConnected ? "text-red-400" : "text-gray-400"
              }`}
            >
              {isConnected ? "LIVE" : "CONNECTING..."}
            </span>
          </div>
          <span className="text-sm text-cosmic-text-dim">
            Camera: <span className="text-cosmic-cyan">{cameraId}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 ${
              isConnected ? "text-cosmic-cyan" : "text-gray-500"
            }`}
          >
            <Wifi />
          </div>
        </div>
      </div>

      {/* Video Stream Area */}
      <div className="relative flex-1 bg-cosmic-darker/50 min-h-[400px]">
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-cosmic-darker/90 z-10">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto border border-red-500/30">
                <Wifi className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 font-medium">{error}</p>
              <p className="text-sm text-cosmic-text-dim">
                Check camera connection and try again
              </p>
            </div>
          </div>
        )}

        {!isConnected && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-cosmic-darker/90 z-10">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 border-4 border-cosmic-purple/30 border-t-cosmic-purple rounded-full animate-spin mx-auto"></div>
              <p className="text-cosmic-text-dim">
                Connecting to camera stream...
              </p>
            </div>
          </div>
        )}

        {/* MJPEG Stream Image */}
        <img
          ref={imgRef}
          alt="Camera Stream"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="w-full h-full object-contain"
          style={{ display: isConnected ? "block" : "none" }}
        />
      </div>

      {/* Stream Info Bar */}
      <div className="px-4 py-2 border-t border-cosmic-purple-light/20 bg-cosmic-card-dark/50">
        <div className="flex items-center justify-between text-xs text-cosmic-text-dim">
          <span>Detection boxes rendered by backend</span>
          <span className={isConnected ? "text-cosmic-cyan" : "text-gray-500"}>
            {isConnected ? "● Streaming" : "○ Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CameraStream;
