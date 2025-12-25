import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CameraDetail from "./pages/CameraDetail";
import Analytics from "./pages/Analytics";
import LocalVideo from "./pages/LocalVideo";
import VideoDetail from "./pages/VideoDetail";
import MainLayout from "./layouts/MainLayout";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Register Route */}
            <Route path="/register" element={<Register />} />

            {/* Dashboard Route with Layout */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Camera Detail Route */}
            <Route
              path="/camera/:cameraId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CameraDetail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Local Video Route */}
            <Route
              path="/local-video"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <LocalVideo />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Video Detail Route */}
            <Route
              path="/video/:videoId"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <VideoDetail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Analytics Route */}
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/live"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>

      {/* Toast Notifications Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </>
  );
}

export default App;
