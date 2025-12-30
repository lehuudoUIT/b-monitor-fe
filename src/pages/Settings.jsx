import React, { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { mockSystemParameters, categoryConfig } from "../data/settingsData";
import { toast } from "react-toastify";

const Settings = () => {
  const [parameters, setParameters] = useState(mockSystemParameters);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Group parameters by category
  const groupedParameters = parameters.reduce((acc, param) => {
    if (!acc[param.category]) {
      acc[param.category] = [];
    }
    acc[param.category].push(param);
    return acc;
  }, {});

  const handleValueChange = (id, newValue) => {
    setParameters((prev) =>
      prev.map((param) =>
        param.id === id ? { ...param, value: newValue } : param
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Settings saved successfully");
    setHasChanges(false);
    setIsSaving(false);
  };

  const handleReset = () => {
    setParameters(mockSystemParameters);
    setHasChanges(false);
    toast.info("Settings reset to default");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-purple mb-2">
            System Settings
          </h1>
          <p className="text-cosmic-text-dim">
            Configure system parameters and detection settings
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-cosmic-card border border-cosmic-border text-cosmic-text hover:bg-cosmic-purple/10 hover:border-cosmic-purple transition-colors"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              hasChanges && !isSaving
                ? "bg-gradient-to-r from-cosmic-purple to-cosmic-purple-dark text-white border border-cosmic-purple-light/50 hover:shadow-glow-purple"
                : "bg-cosmic-card-dark border border-cosmic-border text-cosmic-text-dim cursor-not-allowed"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Cards by Category */}
      {Object.entries(groupedParameters).map(([category, params]) => {
        const config = categoryConfig[category];

        return (
          <div key={category} className="cosmic-card p-6">
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cosmic-border">
              <div
                className={`w-12 h-12 rounded-lg bg-${config.color}/20 flex items-center justify-center border border-${config.color}/30`}
              >
                <span className="text-2xl">{config.icon}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-cosmic-text">
                  {config.label}
                </h2>
                <p className="text-sm text-cosmic-text-dim">
                  {params.length} parameter{params.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {params.map((param) => (
                <div
                  key={param.id}
                  className="bg-cosmic-card-dark rounded-lg p-4 border border-cosmic-border hover:border-cosmic-purple/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-cosmic-text block mb-1">
                        {param.label}
                      </label>
                      <p className="text-xs text-cosmic-text-dim">
                        {param.description}
                      </p>
                    </div>
                  </div>

                  {/* Input based on type */}
                  {param.type === "boolean" && (
                    <div className="flex items-center justify-between mt-4">
                      <span
                        className={`text-sm font-medium ${
                          param.value
                            ? "text-cosmic-cyan"
                            : "text-cosmic-text-dim"
                        }`}
                      >
                        {param.value ? "Enabled" : "Disabled"}
                      </span>
                      <button
                        onClick={() =>
                          handleValueChange(param.id, !param.value)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          param.value
                            ? "bg-cosmic-cyan"
                            : "bg-cosmic-deeper border border-cosmic-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            param.value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  )}

                  {param.type === "number" && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <input
                          type="number"
                          value={param.value}
                          onChange={(e) =>
                            handleValueChange(
                              param.id,
                              parseFloat(e.target.value)
                            )
                          }
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          className="w-24 px-3 py-2 rounded-lg bg-cosmic-deeper border border-cosmic-border text-cosmic-text focus:outline-none focus:border-cosmic-purple transition-colors"
                        />
                        {param.unit && (
                          <span className="text-sm text-cosmic-text-dim">
                            {param.unit}
                          </span>
                        )}
                      </div>
                      <input
                        type="range"
                        value={param.value}
                        onChange={(e) =>
                          handleValueChange(
                            param.id,
                            parseFloat(e.target.value)
                          )
                        }
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-cosmic-deeper"
                        style={{
                          background: `linear-gradient(to right, rgb(6, 182, 212) 0%, rgb(6, 182, 212) ${
                            ((param.value - param.min) /
                              (param.max - param.min)) *
                            100
                          }%, rgb(17, 24, 39) ${
                            ((param.value - param.min) /
                              (param.max - param.min)) *
                            100
                          }%, rgb(17, 24, 39) 100%)`,
                        }}
                      />
                      <div className="flex justify-between text-xs text-cosmic-text-dim">
                        <span>{param.min}</span>
                        <span>{param.max}</span>
                      </div>
                    </div>
                  )}

                  {param.type === "select" && (
                    <div className="mt-4">
                      <select
                        value={param.value}
                        onChange={(e) =>
                          handleValueChange(param.id, e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-cosmic-deeper border border-cosmic-border text-cosmic-text focus:outline-none focus:border-cosmic-purple transition-colors"
                      >
                        {param.options.map((option) => (
                          <option key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Info Card */}
      <div className="cosmic-card p-6 bg-cosmic-purple/10 border-cosmic-purple/30">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-cosmic-purple flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-cosmic-text mb-2">
              💡 Settings Information
            </h3>
            <p className="text-sm text-cosmic-text-dim">
              Changes to these parameters will affect system behavior
              immediately after saving. Some settings may require restarting
              active streams for optimal performance. Make sure to test changes
              in a controlled environment before deploying to production.
            </p>
          </div>
        </div>
      </div>

      {/* Save Reminder */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 cosmic-card p-4 shadow-xl border-cosmic-purple animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cosmic-purple animate-pulse"></div>
            <span className="text-sm font-medium text-cosmic-text">
              You have unsaved changes
            </span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cosmic-purple to-cosmic-purple-dark text-white text-sm font-medium hover:shadow-glow-purple transition-all"
            >
              {isSaving ? "Saving..." : "Save Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
