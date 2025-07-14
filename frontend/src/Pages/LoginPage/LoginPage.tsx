import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUser,
  FaLock,
  FaSpinner,
} from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic validations
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Error signing in. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-verida-dark-teal via-verida-dark-purple to-verida-purple flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-verida-green rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-verida-light-green rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-verida-purple rounded-full blur-2xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back to Landing */}
        <Link
          to="/"
          className="inline-flex items-center text-verida-light-green hover:text-white transition-colors mb-8"
        >
          <FaArrowLeft className="mr-2" />
          Back to home
        </Link>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-verida-green to-verida-light-green rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:scale-110 transition-transform">
              <span className="text-verida-dark-teal font-bold text-2xl">
                V
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
            <p className="text-gray-300">Sign in to your Verida account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-white font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-verida-green focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-white font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-verida-green focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-verida-green to-verida-light-green text-verida-dark-teal rounded-xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-verida-green/20 rounded-xl border border-verida-green/30">
            <h3 className="text-verida-light-green font-semibold mb-2">
              🚀 Demo - Test Credentials:
            </h3>
            <p className="text-gray-300 text-sm mb-1">
              <strong>Email:</strong> demo@verida.org
            </p>
            <p className="text-gray-300 text-sm">
              <strong>Password:</strong> demo123
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <button className="text-verida-light-green hover:text-white transition-colors font-medium">
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="text-verida-light-green hover:text-white transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-verida-light-green hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
