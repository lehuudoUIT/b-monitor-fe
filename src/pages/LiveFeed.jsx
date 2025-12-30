import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Bell,
  X,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Filter,
} from "lucide-react";
import {
  mockLiveAlerts,
  severityConfig,
  statusConfig,
} from "../data/liveFeedData";

const LiveFeed = () => {
  const [alerts, setAlerts] = useState(mockLiveAlerts);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity !== "all" && alert.severity !== filterSeverity)
      return false;
    if (filterStatus !== "all" && alert.status !== filterStatus) return false;
    return true;
  });

  // Stats
  const stats = {
    total: alerts.length,
    new: alerts.filter((a) => a.status === "new").length,
    critical: alerts.filter((a) => a.severity === "critical").length,
  };

  const handleAcknowledge = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "acknowledged" } : alert
      )
    );
  };

  const handleResolve = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" } : alert
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-cyan mb-2">
            Live Anomaly Feed
          </h1>
          <p className="text-cosmic-text-dim">
            Real-time traffic violations and anomaly detection
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-red-400 text-sm font-medium">LIVE</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Alerts */}
        <div className="cosmic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cosmic-text-dim text-sm font-medium">
                Total Alerts
              </p>
              <p className="text-3xl font-bold text-gradient-cyan mt-2">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cosmic-cyan/20 flex items-center justify-center">
              <Bell className="w-6 h-6 text-cosmic-cyan" />
            </div>
          </div>
        </div>

        {/* New Alerts */}
        <div className="cosmic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cosmic-text-dim text-sm font-medium">
                New Alerts
              </p>
              <p className="text-3xl font-bold text-cosmic-purple mt-2">
                {stats.new}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cosmic-purple/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-cosmic-purple" />
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="cosmic-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cosmic-text-dim text-sm font-medium">
                Critical
              </p>
              <p className="text-3xl font-bold text-red-400 mt-2">
                {stats.critical}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="cosmic-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cosmic-text-dim" />
            <span className="text-sm font-medium text-cosmic-text">
              Filters:
            </span>
          </div>

          {/* Severity Filter */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text text-sm focus:outline-none focus:border-cosmic-purple"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text text-sm focus:outline-none focus:border-cosmic-purple"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>

          <span className="text-sm text-cosmic-text-dim ml-auto">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const severity = severityConfig[alert.severity];
          const status = statusConfig[alert.status];

          return (
            <div
              key={alert.id}
              className="cosmic-card p-6 hover:border-cosmic-purple transition-all cursor-pointer"
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start gap-4">
                {/* Alert Icon */}
                <div
                  className={`w-12 h-12 rounded-lg ${severity.bgColor} flex items-center justify-center border ${severity.borderColor} flex-shrink-0`}
                >
                  <AlertTriangle className={`w-6 h-6 ${severity.textColor}`} />
                </div>

                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-cosmic-text mb-1">
                        {alert.type}
                      </h3>
                      <p className="text-cosmic-text-dim text-sm">
                        {alert.description}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${severity.bgColor} ${severity.textColor} border ${severity.borderColor}`}
                      >
                        {severity.label}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor} border ${status.borderColor}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Alert Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-cosmic-text-dim">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.cameraName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(alert.timestamp, {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-cosmic-cyan">
                        {alert.vehicleType}
                      </span>
                      {alert.licensePlate && (
                        <>
                          <span>•</span>
                          <span className="font-mono">
                            {alert.licensePlate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                      className="px-4 py-2 rounded-lg bg-cosmic-purple/20 hover:bg-cosmic-purple/30 text-cosmic-purple text-sm font-medium transition-colors border border-cosmic-purple/30"
                    >
                      <Eye className="w-4 h-4 inline mr-2" />
                      View Details
                    </button>

                    {alert.status === "new" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcknowledge(alert.id);
                        }}
                        className="px-4 py-2 rounded-lg bg-cosmic-cyan/20 hover:bg-cosmic-cyan/30 text-cosmic-cyan text-sm font-medium transition-colors border border-cosmic-cyan/30"
                      >
                        Acknowledge
                      </button>
                    )}

                    {alert.status === "acknowledged" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResolve(alert.id);
                        }}
                        className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium transition-colors border border-green-500/30"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-2" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="cosmic-card p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-cosmic-cyan/20 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-cosmic-cyan" />
            </div>
            <h3 className="text-xl font-semibold text-cosmic-text mb-2">
              No alerts found
            </h3>
            <p className="text-cosmic-text-dim">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="cosmic-card max-w-4xl w-full p-6 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-lg ${
                    severityConfig[selectedAlert.severity].bgColor
                  } flex items-center justify-center border ${
                    severityConfig[selectedAlert.severity].borderColor
                  }`}
                >
                  <AlertTriangle
                    className={`w-6 h-6 ${
                      severityConfig[selectedAlert.severity].textColor
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-cosmic-text">
                    {selectedAlert.type}
                  </h3>
                  <p className="text-sm text-cosmic-text-dim">
                    Alert #{selectedAlert.id} • Frame #{selectedAlert.frameId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="w-10 h-10 rounded-lg bg-cosmic-purple/20 hover:bg-cosmic-purple/30 flex items-center justify-center transition-colors border border-cosmic-purple-light/30"
              >
                <X className="w-5 h-5 text-cosmic-purple" />
              </button>
            </div>

            {/* Capture Image */}
            <div className="relative rounded-lg overflow-hidden border-2 border-cosmic-purple/30">
              <img
                src={selectedAlert.captureUrl}
                alt="Anomaly capture"
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    severityConfig[selectedAlert.severity].bgColor
                  } ${
                    severityConfig[selectedAlert.severity].textColor
                  } border ${
                    severityConfig[selectedAlert.severity].borderColor
                  } backdrop-blur-sm`}
                >
                  {severityConfig[selectedAlert.severity].label}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    statusConfig[selectedAlert.status].bgColor
                  } ${statusConfig[selectedAlert.status].textColor} border ${
                    statusConfig[selectedAlert.status].borderColor
                  } backdrop-blur-sm`}
                >
                  {statusConfig[selectedAlert.status].label}
                </span>
              </div>
            </div>

            {/* Alert Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="cosmic-card p-4 bg-cosmic-card-dark">
                <p className="text-xs text-cosmic-text-dim mb-1">Camera</p>
                <p className="text-cosmic-text font-semibold">
                  {selectedAlert.cameraName}
                </p>
                <p className="text-sm text-cosmic-text-dim">
                  {selectedAlert.location}
                </p>
              </div>

              <div className="cosmic-card p-4 bg-cosmic-card-dark">
                <p className="text-xs text-cosmic-text-dim mb-1">Timestamp</p>
                <p className="text-cosmic-text font-semibold">
                  {selectedAlert.timestamp.toLocaleString("vi-VN")}
                </p>
                <p className="text-sm text-cosmic-text-dim">
                  {formatDistanceToNow(selectedAlert.timestamp, {
                    addSuffix: true,
                    locale: vi,
                  })}
                </p>
              </div>

              <div className="cosmic-card p-4 bg-cosmic-card-dark">
                <p className="text-xs text-cosmic-text-dim mb-1">
                  Vehicle Info
                </p>
                <p className="text-cosmic-text font-semibold">
                  {selectedAlert.vehicleType}
                </p>
                {selectedAlert.licensePlate && (
                  <p className="text-sm text-cosmic-cyan font-mono">
                    {selectedAlert.licensePlate}
                  </p>
                )}
              </div>

              <div className="cosmic-card p-4 bg-cosmic-card-dark">
                <p className="text-xs text-cosmic-text-dim mb-1">Confidence</p>
                <p className="text-cosmic-text font-semibold">
                  {(selectedAlert.confidence * 100).toFixed(1)}%
                </p>
                <div className="w-full bg-cosmic-deeper rounded-full h-2 mt-2">
                  <div
                    className="bg-cosmic-cyan h-2 rounded-full transition-all"
                    style={{ width: `${selectedAlert.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="cosmic-card p-4 bg-cosmic-card-dark">
              <p className="text-xs text-cosmic-text-dim mb-2">Description</p>
              <p className="text-cosmic-text">{selectedAlert.description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedAlert(null)}
                className="flex-1 px-4 py-3 rounded-lg bg-cosmic-card-dark border border-cosmic-border text-cosmic-text hover:bg-cosmic-purple/10 hover:border-cosmic-purple transition-colors"
              >
                Close
              </button>
              {selectedAlert.status === "new" && (
                <button
                  onClick={() => {
                    handleAcknowledge(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-cosmic-cyan/20 hover:bg-cosmic-cyan/30 text-cosmic-cyan border border-cosmic-cyan/30 transition-colors"
                >
                  Acknowledge
                </button>
              )}
              {selectedAlert.status === "acknowledged" && (
                <button
                  onClick={() => {
                    handleResolve(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveFeed;
