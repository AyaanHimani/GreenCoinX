import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Building2,
  Lock,
  Mail,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Zap,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = ({ setCurrentView }) => {
  const [userType, setUserType] = useState("producer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const formRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // Entry animations
    if (headerRef.current) {
      headerRef.current.style.transform = "translateY(-30px)";
      headerRef.current.style.opacity = "0";
      setTimeout(() => {
        headerRef.current.style.transition =
          "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        headerRef.current.style.transform = "translateY(0)";
        headerRef.current.style.opacity = "1";
      }, 200);
    }

    if (formRef.current) {
      formRef.current.style.transform = "translateY(50px)";
      formRef.current.style.opacity = "0";
      setTimeout(() => {
        formRef.current.style.transition = "all 1s ease-out";
        formRef.current.style.transform = "translateY(0)";
        formRef.current.style.opacity = "1";
      }, 400);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [error, setError] = useState(""); // Place this near your other useState hooks

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      console.log("📡 Sending signup request to:", API_URL);

      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        name: formData.name,
        company: formData.companyName,
        username: formData.username,
        password: formData.password,
        role: userType,
      });

      console.log("✅ Signup response:", res.data);

      navigate("/login");
    } catch (err) {
      if (err.response) {
        console.error("❌ Server error:", err.response.data);
        setError(err.response.data.msg || "Registration failed");
      } else if (err.request) {
        console.error("❌ No response from server:", err.request);
        setError("No response from server");
      } else {
        console.error("❌ Frontend error:", err.message);
        setError("Network error");
      }
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-100 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-3xl"></div>

          {/* Header */}
          <div ref={headerRef} className="text-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2">
              Join GreenCoinX
            </h2>
            <p className="text-gray-600">
              Create your account and start trading green hydrogen
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleRegisterSubmit}
            className="space-y-6 relative z-10"
          >
            {/* User Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">
                Account Type
              </label>
              <div className="flex space-x-4">
                <label
                  className={`flex-1 relative cursor-pointer ${
                    userType === "producer" ? "ring-2 ring-emerald-500" : ""
                  } rounded-xl transition-all duration-300`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="producer"
                    checked={userType === "producer"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                      userType === "producer"
                        ? "border-emerald-500 bg-emerald-50 shadow-lg"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                    }`}
                  >
                    <Zap
                      className={`w-6 h-6 mx-auto mb-2 transition-colors duration-300 ${
                        userType === "producer"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        userType === "producer"
                          ? "text-emerald-700"
                          : "text-gray-600"
                      }`}
                    >
                      Producer
                    </span>
                  </div>
                  {userType === "producer" && (
                    <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 bg-white rounded-full animate-bounce" />
                  )}
                </label>

                <label
                  className={`flex-1 relative cursor-pointer ${
                    userType === "buyer" ? "ring-2 ring-emerald-500" : ""
                  } rounded-xl transition-all duration-300`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="buyer"
                    checked={userType === "buyer"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center hover:scale-105 ${
                      userType === "buyer"
                        ? "border-emerald-500 bg-emerald-50 shadow-lg"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md"
                    }`}
                  >
                    <Globe
                      className={`w-6 h-6 mx-auto mb-2 transition-colors duration-300 ${
                        userType === "buyer"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        userType === "buyer"
                          ? "text-emerald-700"
                          : "text-gray-600"
                      }`}
                    >
                      Buyer
                    </span>
                  </div>
                  {userType === "buyer" && (
                    <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 bg-white rounded-full animate-bounce" />
                  )}
                </label>
              </div>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90 focus:shadow-lg"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Company Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Company Name
              </label>
              <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90 focus:shadow-lg"
                  placeholder="Enter your company name"
                  required
                />
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90 focus:shadow-lg"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90 focus:shadow-lg"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-300" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90 focus:shadow-lg"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-green-700 flex items-center justify-center space-x-2 group"
            >
              <span>Create Account</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors duration-300 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>

          {/* Back to Home */}
          {error && (
            <div className="text-red-500 text-center font-semibold">
              {error}
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 hover:scale-110 z-20"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
