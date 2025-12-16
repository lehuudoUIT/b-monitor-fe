import React, { useState, useEffect } from "react";
import { Play, Pause, Maximize2, Volume2 } from "lucide-react";

const VideoStream = ({ cameraId, detectionBoxes = [] }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showDetections, setShowDetections] = useState(true);

  // Simulate live stream with animated detection boxes
  return (
    <div className="cosmic-card overflow-hidden h-full flex flex-col">
      {/* Video Controls Header */}
      <div className="px-4 py-3 border-b border-cosmic-purple-light/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/20 border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-medium text-red-400">LIVE</span>
          </div>
          <span className="text-sm text-cosmic-text-dim">
            Camera: <span className="text-cosmic-cyan">{cameraId}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDetections(!showDetections)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showDetections
                ? "bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple-light/30"
                : "bg-cosmic-darker/50 text-cosmic-text-dim border border-cosmic-purple-light/20"
            }`}
          >
            {showDetections ? "Hide" : "Show"} Detections
          </button>
        </div>
      </div>

      {/* Video Stream Area */}
      <div className="relative flex-1 bg-cosmic-darker/50">
        {/* Placeholder Video Stream (Using animated background) */}
        <div className="absolute inset-0 bg-gradient-to-br from-cosmic-darker via-cosmic-deep to-cosmic-darker">
          {/* Simulated traffic scene with grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          ></div>

          {/* Simulated road lanes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-2/3 bg-gradient-to-b from-gray-700/30 via-gray-600/40 to-gray-700/30 relative">
              {/* Lane markings */}
              <div className="absolute top-1/2 left-0 right-0 h-1 border-t-2 border-dashed border-yellow-400/30"></div>

              {/* Traffic light simulation */}
              <div className="absolute top-4 right-8 flex flex-col gap-2 p-2 bg-cosmic-dark/80 rounded-lg border border-cosmic-purple-light/30">
                <div className="w-6 h-6 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                <div className="w-6 h-6 rounded-full bg-gray-700/50"></div>
                <div className="w-6 h-6 rounded-full bg-gray-700/50"></div>
              </div>
            </div>
          </div>

          {/* Detection Boxes Overlay */}
          {showDetections &&
            detectionBoxes.map((detection) => (
              <div
                key={detection.id}
                className="absolute animate-pulse-glow"
                style={{
                  left: `${detection.bbox.x}px`,
                  top: `${detection.bbox.y}px`,
                  width: `${detection.bbox.width}px`,
                  height: `${detection.bbox.height}px`,
                  border: `2px solid ${detection.color}`,
                  boxShadow: `0 0 15px ${detection.color}80, inset 0 0 15px ${detection.color}20`,
                  borderRadius: "4px",
                }}
              >
                {/* Label */}
                <div
                  className="absolute -top-7 left-0 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm"
                  style={{
                    backgroundColor: `${detection.color}40`,
                    border: `1px solid ${detection.color}`,
                    color: detection.color,
                  }}
                >
                  {detection.label} {(detection.confidence * 100).toFixed(0)}%
                </div>
              </div>
            ))}

          {/* FPS Counter */}
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-cosmic-dark/80 backdrop-blur-sm border border-cosmic-cyan/30">
            <span className="text-xs font-mono text-cosmic-cyan">30 FPS</span>
          </div>

          {/* Resolution Info */}
          <div className="absolute top-4 left-24 px-3 py-1.5 rounded-lg bg-cosmic-dark/80 backdrop-blur-sm border border-cosmic-purple-light/30">
            <span className="text-xs font-mono text-cosmic-text">
              1920x1080
            </span>
          </div>
        </div>
      </div>

      {/* Video Controls Footer */}
      <div className="px-4 py-3 border-t border-cosmic-purple-light/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-lg bg-cosmic-purple/20 hover:bg-cosmic-purple/30 flex items-center justify-center transition-colors border border-cosmic-purple-light/30"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-cosmic-purple" />
            ) : (
              <Play className="w-5 h-5 text-cosmic-purple" />
            )}
          </button>

          <button className="w-10 h-10 rounded-lg bg-cosmic-darker/50 hover:bg-cosmic-purple/20 flex items-center justify-center transition-colors border border-cosmic-purple-light/30">
            <Volume2 className="w-5 h-5 text-cosmic-text-dim" />
          </button>
        </div>

        <button className="w-10 h-10 rounded-lg bg-cosmic-darker/50 hover:bg-cosmic-purple/20 flex items-center justify-center transition-colors border border-cosmic-purple-light/30">
          <Maximize2 className="w-5 h-5 text-cosmic-text-dim" />
        </button>
      </div>
    </div>
  );
};

export default VideoStream;
