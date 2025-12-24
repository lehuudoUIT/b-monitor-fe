import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <div className="min-h-screen w-full cosmic-bg-animated flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated cosmic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-glow-purple rounded-full blur-3xl opacity-20 animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-96 h-96 bg-glow-cyan rounded-full blur-3xl opacity-20 animate-float"
          style={{ animationDelay: "3s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-glow-purple rounded-full blur-3xl opacity-10 animate-pulse-glow"></div>
      </div>

      {/* Register Card */}
      <div className="cosmic-card w-full max-w-md p-8 relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-cyan shadow-glow-purple">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-purple mb-2">
            Create Account
          </h1>
          <p className="text-cosmic-text-dim">Join B-Monitor System</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-cosmic-text"
            >
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-text-dim" />
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="cosmic-input w-full pl-11"
                required
              />
            </div>
          </div>

          {/* Full Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-cosmic-text"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-text-dim" />
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="John Doe"
                className="cosmic-input w-full pl-11"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-cosmic-text"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-text-dim" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="cosmic-input w-full pl-11"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-cosmic-text"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cosmic-text-dim" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="cosmic-input w-full pl-11 pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-text-dim hover:text-cosmic-cyan transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-cosmic-text-dim">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cosmic-purple hover:text-cosmic-purple-light transition-colors font-medium"
          >
            Sign in
          </a>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-purple to-transparent opacity-50"></div>
    </div>
  );
};

export default Register;
