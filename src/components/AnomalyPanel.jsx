import React from "react";
import { AlertTriangle, Clock, MapPin, Car, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const AnomalyPanel = ({ anomalies = [] }) => {
  const getSeverityColor = (severity) => {
    const colors = {
      critical: "border-red-500 bg-red-500/10 text-red-400",
      high: "border-orange-500 bg-orange-500/10 text-orange-400",
      medium: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
      low: "border-blue-500 bg-blue-500/10 text-blue-400",
    };
    return colors[severity] || colors.low;
  };

  const getSeverityIcon = (severity) => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangle className="w-4 h-4" />;
    }
    return <AlertCircle className="w-4 h-4" />;
  };

  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), "HH:mm:ss");
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="cosmic-card h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-cosmic-purple-light/20">
        <h3 className="text-lg font-semibold text-cosmic-text flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cosmic-purple" />
          Detected Anomalies
        </h3>
        <p className="text-xs text-cosmic-text-dim mt-1">
          Real-time violation detection
        </p>
      </div>

      {/* Stats Summary */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2 border-b border-cosmic-purple-light/20">
        <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="text-xl font-bold text-red-400">
            {
              anomalies.filter(
                (a) => a.severity === "critical" || a.severity === "high"
              ).length
            }
          </div>
          <div className="text-xs text-cosmic-text-dim">Critical</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-cosmic-cyan/10 border border-cosmic-cyan/30">
          <div className="text-xl font-bold text-cosmic-cyan">
            {anomalies.length}
          </div>
          <div className="text-xs text-cosmic-text-dim">Total Today</div>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="flex-1 overflow-auto cosmic-scrollbar p-4 space-y-3">
        {anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-full bg-cosmic-purple/20 flex items-center justify-center mb-3">
              <AlertCircle className="w-8 h-8 text-cosmic-purple" />
            </div>
            <p className="text-cosmic-text-dim text-sm">
              No anomalies detected
            </p>
          </div>
        ) : (
          anomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className="cosmic-card p-3 hover:border-cosmic-purple transition-all duration-300 cursor-pointer group"
            >
              {/* Severity Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium mb-2 ${getSeverityColor(
                  anomaly.severity
                )}`}
              >
                {getSeverityIcon(anomaly.severity)}
                <span className="uppercase">{anomaly.severity}</span>
              </div>

              {/* Violation Type */}
              <h4 className="text-sm font-semibold text-cosmic-text mb-2 group-hover:text-gradient-purple transition-colors">
                {anomaly.type}
              </h4>

              {/* Details */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-cosmic-text-dim">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(anomaly.timestamp)}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-cosmic-text-dim">
                  <MapPin className="w-3 h-3" />
                  <span>{anomaly.location}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-cosmic-text-dim">
                  <Car className="w-3 h-3" />
                  <span>{anomaly.vehicleType}</span>
                </div>
              </div>

              {/* Confidence Score */}
              <div className="mt-3 pt-2 border-t border-cosmic-purple-light/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cosmic-text-dim">Confidence</span>
                  <span className="text-cosmic-cyan font-medium">
                    {anomaly.confidence}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 bg-cosmic-darker rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full transition-all duration-500"
                    style={{ width: `${anomaly.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 border-t border-cosmic-purple-light/20">
        <button className="w-full cosmic-btn bg-gradient-to-r from-cosmic-purple to-cosmic-purple-dark text-white hover:shadow-glow-purple border border-cosmic-purple-light/50 text-sm">
          View All Reports
        </button>
      </div>
    </div>
  );
};

export default AnomalyPanel;
