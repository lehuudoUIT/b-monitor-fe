import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logout clicked");
    // Add logout logic here
  };

  return (
    <header className="cosmic-card h-16 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left side - Logo/Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-cyan flex items-center justify-center shadow-glow-purple">
          <span className="text-white font-bold text-lg">B</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gradient-purple">B-Monitor</h1>
          <p className="text-xs text-cosmic-text-dim">Traffic Camera System</p>
        </div>
      </div>

      {/* Right side - User Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-cosmic-purple/10 transition-all duration-300 border border-transparent hover:border-cosmic-purple-light/30"
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-cyan flex items-center justify-center shadow-glow-purple-lg">
            <User className="w-5 h-5 text-white" />
          </div>

          {/* User Info */}
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-cosmic-text">Admin User</p>
            <p className="text-xs text-cosmic-text-dim">admin@bmonitor.com</p>
          </div>

          {/* Dropdown Icon */}
          <ChevronDown
            className={`w-4 h-4 text-cosmic-text-dim transition-transform duration-300 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 cosmic-card py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-cosmic-purple-light/20">
              <p className="text-sm font-medium text-cosmic-text">Admin User</p>
              <p className="text-xs text-cosmic-text-dim mt-1">
                admin@bmonitor.com
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-cosmic-purple/10 transition-colors text-left group"
            >
              <LogOut className="w-4 h-4 text-cosmic-text-dim group-hover:text-red-400 transition-colors" />
              <span className="text-sm text-cosmic-text group-hover:text-red-400 transition-colors">
                Logout
              </span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
