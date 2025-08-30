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
const LoginPage = ({ setCurrentView }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const formRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  // e.g. "producer", "buyer", "auditor", "regulator"

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      console.log(role);
      setTimeout(() => {
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
            navigate("/dashboard", { replace: true });
        }
      }, 0);
    }
  }, [navigate]);

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

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [error, setError] = useState(""); // Add this line

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Use the correct API_URL variable here
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
        }),
      });

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (!res.ok) {
        setError(data.msg || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      // Your role-based navigation logic...
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        // Assuming 'producer' and 'buyer' roles redirect to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login Error:", err); // It's good practice to log the actual error
      setError("Network error or server is down.");
    }
  };
  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-100 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-3xl"></div>

          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-20 right-16 w-1 h-1 bg-green-500 rounded-full opacity-40 animate-bounce"></div>
            <div className="absolute bottom-20 left-16 w-1.5 h-1.5 bg-emerald-300 rounded-full opacity-50 animate-pulse"></div>
            <div className="absolute bottom-32 right-10 w-2 h-2 bg-green-400 rounded-full opacity-30 animate-bounce"></div>
          </div>

          {/* Header */}
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
            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-all duration-300 group-focus-within:scale-110" />
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  onChange={handleLoginChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90 focus:shadow-lg focus:scale-105 transform"
                  placeholder="Enter your username"
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-all duration-300 group-focus-within:scale-110" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 bg-white/50 hover:bg-white/70 focus:bg-white/90 focus:shadow-lg focus:scale-105 transform"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Forgot Password
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-all duration-300 hover:underline hover:scale-105 transform"
              >
                Forgot Password?
              </button>
            </div> */}
            {/* Submit Button */}
            {error && (
              <div className="text-red-500 text-center font-semibold">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-emerald-600 hover:to-green-700 flex items-center justify-center space-x-2 group relative overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Sign In</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </button>
            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-emerald-600 font-semibold hover:text-emerald-700 transition-all duration-300 hover:underline hover:scale-105 transform inline-block"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>

          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 hover:scale-110 z-20 group"
          >
            <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
