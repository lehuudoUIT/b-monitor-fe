import React from "react";
import { Video, Wifi, AlertTriangle, TrendingUp } from "lucide-react";
import CameraCard from "../components/CameraCard";
import { mockCameras, dashboardStats } from "../data/mockData";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-purple mb-2">
            Camera Dashboard
          </h1>
          <p className="text-cosmic-text-dim">
            Monitor and manage all traffic cameras in real-time
          </p>
        </div>

        <button className="cosmic-btn bg-gradient-to-r from-cosmic-purple to-cosmic-purple-dark text-white hover:shadow-glow-purple border border-cosmic-purple-light/50">
          <Video className="w-5 h-5" />
          Add Camera
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cameras */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-cosmic-purple/20 flex items-center justify-center border border-cosmic-purple-light/30">
              <Video className="w-6 h-6 text-cosmic-purple" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-cosmic-purple/20 text-cosmic-purple border border-cosmic-purple-light/30">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {dashboardStats.totalCameras}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Total Cameras</p>
        </div>

        {/* Online Cameras */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-cosmic-cyan/20 flex items-center justify-center border border-cosmic-cyan/30">
              <Wifi className="w-6 h-6 text-cosmic-cyan" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-cosmic-cyan/20 text-cosmic-cyan border border-cosmic-cyan/30">
              Active
            </span>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {dashboardStats.onlineCameras}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Online Cameras</p>
        </div>

        {/* Offline Cameras */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              Offline
            </span>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {dashboardStats.offlineCameras}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Offline Cameras</p>
        </div>

        {/* Active Alerts */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              Alerts
            </span>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {dashboardStats.alerts}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Active Alerts</p>
        </div>
      </div>

      {/* Camera Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-cosmic-text">
            All Cameras
          </h2>
          <div className="flex items-center gap-2 text-sm text-cosmic-text-dim">
            <span>Showing {mockCameras.length} cameras</span>
          </div>
        </div>

        {/* Camera Cards Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCameras.map((camera) => (
            <CameraCard key={camera.id} camera={camera} />
          ))}
        </div>
      </div>

      {/* Empty State (if no cameras) */}
      {mockCameras.length === 0 && (
        <div className="cosmic-card p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-cosmic-purple/20 flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-cosmic-purple" />
          </div>
          <h3 className="text-xl font-semibold text-cosmic-text mb-2">
            No cameras found
          </h3>
          <p className="text-cosmic-text-dim mb-6">
            Get started by adding your first traffic camera
          </p>
          <button className="cosmic-btn bg-gradient-to-r from-cosmic-purple to-cosmic-purple-dark text-white hover:shadow-glow-purple border border-cosmic-purple-light/50">
            <Video className="w-5 h-5" />
            Add Your First Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
