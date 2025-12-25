import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Activity,
  Video,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: Video,
      label: "Local Video",
      path: "/local-video",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/analytics",
    },
    {
      icon: Activity,
      label: "Live Feed",
      path: "/live",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="w-20 cosmic-card flex flex-col items-center py-6 gap-2 sticky top-0 h-screen">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `w-14 h-14 flex flex-col items-center justify-center rounded-xl transition-all duration-300 group relative
            ${
              isActive
                ? "bg-gradient-to-br from-cosmic-purple to-cosmic-cyan shadow-glow-purple"
                : "hover:bg-cosmic-purple/10 border border-transparent hover:border-cosmic-purple-light/30"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                className={`w-6 h-6 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-cosmic-text-dim group-hover:text-cosmic-purple"
                }`}
              />

              {/* Tooltip */}
              <span className="absolute left-full ml-4 px-3 py-2 cosmic-card text-sm text-cosmic-text whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}

      {/* Decorative line at bottom */}
      <div className="flex-1"></div>
      <div className="w-10 h-px bg-gradient-to-r from-transparent via-cosmic-purple to-transparent"></div>
    </aside>
  );
};

export default Sidebar;
