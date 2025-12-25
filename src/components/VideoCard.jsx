import React from "react";
import { Video, MapPin, Play, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const { id, name, location, thumbnail, status, fps, resolution } = video;

  // Default thumbnail if empty
  const defaultThumbnail =
    "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=400&h=300&fit=crop";
  const thumbnailUrl = thumbnail || defaultThumbnail;

  const handleCardClick = () => {
    navigate(`/video/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="cosmic-card overflow-hidden group hover:border-cosmic-purple hover:shadow-glow-purple transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      {/* Thumbnail Image */}
      <div className="relative h-48 bg-cosmic-darker overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-deep/90 via-cosmic-deep/20 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cosmic-dark/80 backdrop-blur-sm border border-cosmic-purple-light/30">
          {status === "active" ? (
            <>
              <Play className="w-3 h-3 text-cosmic-cyan" />
              <span className="text-xs font-medium text-cosmic-cyan">
                Ready
              </span>
            </>
          ) : (
            <>
              <Clock className="w-3 h-3 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-400">
                Processing
              </span>
            </>
          )}
        </div>

        {/* Video Icon */}
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-cosmic-purple/20 backdrop-blur-sm flex items-center justify-center border border-cosmic-purple-light/30">
          <Video className="w-4 h-4 text-cosmic-purple" />
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-cosmic-purple/80 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 shadow-glow-purple">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Video Name */}
        <h3 className="text-lg font-semibold text-cosmic-text group-hover:text-gradient-purple transition-colors truncate">
          {name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-cosmic-text-dim">
          <MapPin className="w-4 h-4" />
          <span className="text-sm truncate">{location || "No location"}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-cosmic-purple-light/20">
          <div className="flex items-center gap-3 text-xs text-cosmic-text-dim">
            <div>
              <span className="text-cosmic-cyan">{fps}</span> FPS
            </div>
            <div>
              <span className="text-cosmic-purple">{resolution}</span>
            </div>
          </div>
          <button className="text-xs text-cosmic-purple hover:text-cosmic-purple-light transition-colors font-medium">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
