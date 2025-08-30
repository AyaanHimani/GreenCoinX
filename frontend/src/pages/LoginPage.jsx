import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Lock,
  ChevronRight,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const formRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // --- REFACTOR: Centralized navigation logic ---
  const navigateToDashboard = (role) => {
    switch (role) {
      case "producer":
        navigate("/prod-dashboard", { replace: true });
        break;
      case "buyer":
        navigate("/buyer-dashboard", { replace: true });
        break;
      case "auditor":
        navigate("/auditor-dashboard", { replace: true });
        break;
      case "regulator":
        navigate("/regulator-dashboard", { replace: true });
        break;
      default:
        // Fallback for any other roles or a general dashboard
        navigate("/dashboard", { replace: true });
    }
  };

  // Effect for checking existing session and auto-redirecting
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      // --- CORRECTION: Removed unnecessary setTimeout ---
      navigateToDashboard(role);
    }
  }, [navigate]);

  // Effect for entry animations
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.transform = "translateY(-30px)";
      headerRef.current.style.opacity = "0";
      setTimeout(() => {
        headerRef.current.style.transition =
          "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        headerRef.current.style.transform = "translateY(0)";
        headerRef.current.style.opacity = "1";
      }, 100);
    }
    if (formRef.current) {
      formRef.current.style.transform = "translateY(50px)";
      formRef.current.style.opacity = "0";
      setTimeout(() => {
        formRef.current.style.transition = "all 1s ease-out";
        formRef.current.style.transform = "translateY(0)";
        formRef.current.style.opacity = "1";
      }, 300);
    }
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      // --- CORRECTION: Handle failed login attempts FIRST ---
      if (!res.ok) {
        setError(data.msg || "Login failed. Please check your credentials.");
        return;
      }

      // --- If login is successful, proceed below ---
      const { token, role, name } = data;

      // Store credentials in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", name);

      // Navigate to the correct dashboard
      navigateToDashboard(role);
    } catch (err) {
      console.error("Login Error:", err);
      setError("Network error or server is down.");
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-3xl"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-20 right-16 w-1 h-1 bg-green-500 rounded-full opacity-40 animate-bounce"></div>
            <div className="absolute bottom-20 left-16 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-2 h-2 bg-green-400 rounded-full opacity-30 animate-bounce"></div>
          </div>

          <div ref={headerRef} className="text-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:rotate-3">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Sign in to your GreenCoinX account</p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleLoginSubmit}
            className="space-y-6 relative z-10"
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-all duration-300" />
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-all duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Sign In</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-all duration-300 hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>

          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 z-20 group"
          >
            <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
