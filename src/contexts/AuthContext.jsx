import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";

// Create AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check for existing token and restore session on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          // Call GET /users/me to verify token and get user info
          const response = await axiosInstance.get("/users/me");

          if (response.status === 200) {
            setUser(response.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          // If 403 or any error, clear token and require login
          if (error.response?.status === 403) {
            console.log("Token expired or invalid");
            localStorage.removeItem("accessToken");
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      // Step 1: Call POST /auth/login
      const loginResponse = await axiosInstance.post(
        "/auth/login",
        credentials
      );

      if (loginResponse.status === 200) {
        const { access_token } = loginResponse.data;

        // Save access_token to localStorage
        localStorage.setItem("accessToken", access_token);

        // Step 2: Call GET /users/me to get user info
        const userResponse = await axiosInstance.get("/users/me");

        if (userResponse.status === 200) {
          setUser(userResponse.data);
          setIsAuthenticated(true);

          // Show success message
          toast.success("Đăng nhập thành công");

          // Navigate to dashboard
          navigate("/dashboard");

          return { success: true, data: userResponse.data };
        }
      }
    } catch (error) {
      // Handle login errors
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Đăng nhập thất bại";

      toast.error(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      // Call POST /auth/register
      const response = await axiosInstance.post("/auth/register", userData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");

        // Navigate to login page
        navigate("/login");

        return { success: true, data: response.data };
      }
    } catch (error) {
      // Handle specific 400 errors (duplicate username/email)
      if (error.response?.status === 400) {
        const errorDetail =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Đăng ký thất bại";

        // Show specific error message from API
        if (typeof errorDetail === "string") {
          toast.error(errorDetail);
        } else if (Array.isArray(errorDetail)) {
          // Handle validation errors array
          errorDetail.forEach((err) => {
            toast.error(err.msg || err.message || "Lỗi validation");
          });
        } else if (typeof errorDetail === "object") {
          // Handle object error details
          Object.values(errorDetail).forEach((msg) => {
            toast.error(msg);
          });
        }

        return {
          success: false,
          error: errorDetail,
        };
      }

      // Handle other errors
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Đăng ký thất bại";

      toast.error(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear token from localStorage
    localStorage.removeItem("accessToken");

    // Clear user state
    setUser(null);
    setIsAuthenticated(false);

    // Show info message
    toast.info("Đã đăng xuất");

    // Redirect to login page
    navigate("/login");
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
