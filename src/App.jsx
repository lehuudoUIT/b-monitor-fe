import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CameraDetail from "./pages/CameraDetail";
import Analytics from "./pages/Analytics";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Route with Layout */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* Camera Detail Route */}
        <Route
          path="/camera/:cameraId"
          element={
            <MainLayout>
              <CameraDetail />
            </MainLayout>
          }
        />

        {/* Default redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Analytics Route */}
        <Route
          path="/analytics"
          element={
            <MainLayout>
              <Analytics />
            </MainLayout>
          }
        />

        <Route
          path="/live"
          element={
            <MainLayout>
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gradient-cyan mb-2">
                    Live Feed
                  </h2>
                  <p className="text-cosmic-text-dim">Coming soon...</p>
                </div>
              </div>
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gradient-purple mb-2">
                    Settings
                  </h2>
                  <p className="text-cosmic-text-dim">Coming soon...</p>
                </div>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
