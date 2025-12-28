import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, Edit, Trash2 } from "lucide-react";
import CameraStream from "../components/CameraStream";
import AnomalyPanel from "../components/AnomalyPanel";
import UpdateCameraModal from "../components/UpdateCameraModal";
import Button from "../components/Button";
import { cameraAPI } from "../api/cameraService";
import { videoAPI } from "../api/videoService";

const CameraDetail = () => {
  const { cameraId } = useParams();
  const navigate = useNavigate();

  const [camera, setCamera] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [anomalies, setAnomalies] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Load camera data
  useEffect(() => {
    const loadCameraData = async () => {
      setIsLoading(true);
      try {
        const cameraData = await cameraAPI.getCameraById(cameraId);
        setCamera(cameraData);

        console.log("camera data", camera);
        setAnomalies([]);
        // Try to load anomalies
        // try {
        //   const anomalyData = await videoAPI.getAllAnomalies(cameraId);
        //   setAnomalies(anomalyData || []);
        // } catch (error) {
        //   console.error("Failed to load anomalies:", error);
        //   setAnomalies([]);
        // }
      } catch (error) {
        console.error("Failed to load camera:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCameraData();
  }, [cameraId]);

  const handleUpdateCamera = async (updatedData) => {
    try {
      const updated = await cameraAPI.updateCamera(cameraId, updatedData);
      setCamera(updated);
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Failed to update camera:", error);
    }
  };

  const handleDeleteCamera = async () => {
    setIsDeleting(true);
    try {
      await cameraAPI.deleteCamera(cameraId);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete camera:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cosmic-purple/30 border-t-cosmic-purple rounded-full animate-spin mx-auto"></div>
          <p className="text-cosmic-text-dim">Loading camera...</p>
        </div>
      </div>
    );
  }

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
                    camera.status === "active"
                      ? "text-cosmic-cyan"
                      : "text-red-400"
                  }
                >
                  {camera.status === "active" ? "Online" : "Offline"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpdateModal(true)}
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="hover:bg-red-500/10 hover:border-red-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 gap-4 min-h-0">
        {/* Left Column - Video Stream (70%) */}
        <div className="lg:col-span-7 h-full min-h-[600px]">
          <CameraStream cameraId={camera.id} />
        </div>

        {/* Right Column - Anomaly Panel (30%) */}
        <div className="lg:col-span-3 h-full min-h-[600px]">
          <AnomalyPanel cameraId={camera.id} anomalies={anomalies} />
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

      {/* Update Camera Modal */}
      <UpdateCameraModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={handleUpdateCamera}
        camera={camera}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="cosmic-card max-w-md w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-cosmic-text">
                  Xóa Camera
                </h3>
                <p className="text-sm text-cosmic-text-dim">
                  Bạn có chắc chắn muốn xóa camera này?
                </p>
              </div>
            </div>

            <div className="bg-cosmic-card-dark rounded-lg p-4 border border-cosmic-border">
              <p className="text-sm text-cosmic-text-dim mb-2">
                Camera sẽ bị xóa:
              </p>
              <p className="text-cosmic-text font-semibold">{camera?.name}</p>
            </div>

            <p className="text-sm text-red-400">
              ⚠️ Hành động này không thể hoàn tác!
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                onClick={handleDeleteCamera}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-red-500"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraDetail;
