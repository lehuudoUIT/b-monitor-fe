import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, Settings } from "lucide-react";
import VideoStream from "../components/VideoStream";
import AnomalyPanel from "../components/AnomalyPanel";
import Button from "../components/Button";
import { mockCameras } from "../data/mockData";
import { mockAnomalies, mockDetectionBoxes } from "../data/anomalyData";

const CameraDetail = () => {
  const { cameraId } = useParams();
  const navigate = useNavigate();

  // Find camera data
  const camera = useMemo(() => {
    return mockCameras.find((cam) => cam.id === cameraId);
  }, [cameraId]);

  // Get anomalies for this camera
  const anomalies = mockAnomalies[cameraId] || [];

  if (!camera) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cosmic-text mb-2">
            Camera Not Found
          </h2>
          <p className="text-cosmic-text-dim mb-4">
            The camera you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="cosmic-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-lg bg-cosmic-purple/20 hover:bg-cosmic-purple/30 flex items-center justify-center transition-colors border border-cosmic-purple-light/30"
            >
              <ArrowLeft className="w-5 h-5 text-cosmic-purple" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gradient-purple">
                {camera.name}
              </h1>
              <p className="text-sm text-cosmic-text-dim flex items-center gap-2 mt-1">
                <span>{camera.location}</span>
                <span className="text-cosmic-purple">•</span>
                <span
                  className={
                    camera.status === "online"
                      ? "text-cosmic-cyan"
                      : "text-red-400"
                  }
                >
                  {camera.status === "online" ? "Online" : "Offline"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-4 min-h-0">
        {/* Left Column - Video Stream (70%) */}
        <div className="lg:col-span-7 h-full min-h-[600px]">
          <VideoStream
            cameraId={camera.id}
            detectionBoxes={mockDetectionBoxes}
          />
        </div>

        {/* Right Column - Anomaly Panel (30%) */}
        <div className="lg:col-span-3 h-full min-h-[600px]">
          <AnomalyPanel anomalies={anomalies} />
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="cosmic-card p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cosmic-cyan">
              {anomalies.length}
            </div>
            <div className="text-xs text-cosmic-text-dim mt-1">
              Total Violations
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {anomalies.filter((a) => a.severity === "critical").length}
            </div>
            <div className="text-xs text-cosmic-text-dim mt-1">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cosmic-purple">
              {anomalies.filter((a) => a.type === "Red Light Violation").length}
            </div>
            <div className="text-xs text-cosmic-text-dim mt-1">Red Light</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {anomalies.filter((a) => a.type === "Speeding").length}
            </div>
            <div className="text-xs text-cosmic-text-dim mt-1">Speeding</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDetail;
