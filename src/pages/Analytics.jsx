import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Activity,
  Calendar,
  Clock,
} from "lucide-react";
import {
  weeklyViolationsData,
  violationTypesData,
  analyticsStats,
} from "../data/analyticsData";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Custom tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="cosmic-card p-3 border border-cosmic-purple-light/30">
          <p className="text-cosmic-text font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-cosmic-text-dim">{entry.name}:</span>
                <span className="text-cosmic-cyan font-medium">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="cosmic-card p-3 border border-cosmic-purple-light/30">
          <p className="text-cosmic-text font-semibold mb-1">{data.name}</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-cosmic-text-dim">Count:</span>
              <span className="text-cosmic-cyan font-medium">{data.value}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cosmic-text-dim">Percentage:</span>
              <span className="text-cosmic-purple font-medium">
                {data.payload.percentage}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label for Pie Chart
  const renderCustomLabel = (entry) => {
    return `${entry.percentage}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-purple mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-cosmic-text-dim">
            Traffic violation insights and statistics
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 cosmic-card p-1">
          {["day", "week", "month"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                selectedPeriod === period
                  ? "bg-gradient-to-r from-cosmic-purple to-cosmic-cyan text-white shadow-glow-purple"
                  : "text-cosmic-text-dim hover:text-cosmic-text"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Violations */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-cosmic-cyan/20 flex items-center justify-center border border-cosmic-cyan/30">
              <Activity className="w-6 h-6 text-cosmic-cyan" />
            </div>
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
              <TrendingUp className="w-3 h-3" />
              <span>{analyticsStats.trendPercentage}%</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {analyticsStats.totalViolations}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Total Violations</p>
        </div>

        {/* Critical Violations */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
              High Risk
            </span>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {analyticsStats.criticalViolations}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Critical Cases</p>
        </div>

        {/* Average Per Day */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-cosmic-purple/20 flex items-center justify-center border border-cosmic-purple-light/30">
              <Calendar className="w-6 h-6 text-cosmic-purple" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {analyticsStats.averagePerDay}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Average Per Day</p>
        </div>

        {/* Peak Hour */}
        <div className="cosmic-card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-cosmic-text mb-1">
            {analyticsStats.peakHour}
          </h3>
          <p className="text-sm text-cosmic-text-dim">Peak Hour</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Weekly Violations */}
        <div className="cosmic-card p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-cosmic-text mb-2">
              Weekly Violations
            </h3>
            <p className="text-sm text-cosmic-text-dim">
              Violations by day of the week
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyViolationsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(168, 85, 247, 0.1)"
              />
              <XAxis
                dataKey="day"
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
              <Tooltip
                content={<CustomBarTooltip />}
                cursor={{ fill: "rgba(168, 85, 247, 0.1)" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
                iconType="circle"
              />
              <Bar
                dataKey="critical"
                stackId="a"
                fill="#ef4444"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="high"
                stackId="a"
                fill="#f97316"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="medium"
                stackId="a"
                fill="#eab308"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="low"
                stackId="a"
                fill="#22d3ee"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Legend Summary */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-cosmic-purple-light/20">
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mx-auto mb-1"></div>
              <p className="text-xs text-cosmic-text-dim">Critical</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mx-auto mb-1"></div>
              <p className="text-xs text-cosmic-text-dim">High</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mx-auto mb-1"></div>
              <p className="text-xs text-cosmic-text-dim">Medium</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 mx-auto mb-1"></div>
              <p className="text-xs text-cosmic-text-dim">Low</p>
            </div>
          </div>
        </div>

        {/* Pie Chart - Violation Types */}
        <div className="cosmic-card p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-cosmic-text mb-2">
              Violation Types
            </h3>
            <p className="text-sm text-cosmic-text-dim">
              Distribution by violation type
            </p>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={violationTypesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {violationTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Violation Types Legend */}
          <div className="space-y-2 mt-4 pt-4 border-t border-cosmic-purple-light/20">
            {violationTypesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-cosmic-text-dim">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-cosmic-cyan">
                    {item.value}
                  </span>
                  <span className="text-xs text-cosmic-text-dim">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Common Violation Card */}
      <div className="cosmic-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-cosmic-text mb-1">
              Most Common Violation
            </h3>
            <p className="text-sm text-cosmic-text-dim">
              This week's leading violation type
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gradient-purple mb-1">
              {analyticsStats.mostCommonViolation}
            </div>
            <div className="text-sm text-cosmic-text-dim">
              {violationTypesData[0].value} occurrences (
              {violationTypesData[0].percentage}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
