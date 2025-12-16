import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-cosmic-deep">
      {/* Animated cosmic background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-glow-purple rounded-full blur-3xl opacity-10 animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-glow-cyan rounded-full blur-3xl opacity-10 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-glow-purple rounded-full blur-3xl opacity-5 animate-pulse-glow"></div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-auto cosmic-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
