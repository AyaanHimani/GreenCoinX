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

const RegisterPage = () => {
  const [userType, setUserType] = useState("producer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    companyRegistration: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const formRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Animation effect
  useEffect(() => {
    // Entry animations logic... (no changes needed)
  }, []);

  // Automatically clear company data when switching to a non-company role
  useEffect(() => {
    if (userType === "auditor") {
      setFormData((prev) => ({
        ...prev,
        companyName: "",
        companyRegistration: "",
      }));
    }
  }, [userType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        username: formData.username,
        password: formData.password,
        role: userType,
      };

      // Only include company details for relevant roles
      if (userType === "producer" || userType === "buyer") {
        payload.company = formData.companyName;
        payload.companyRegistration = formData.companyRegistration;
      }

      await axios.post(`${API_URL}/api/auth/signup`, payload);

      navigate("/login");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || "Registration failed");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full">
        {" "}
        {/* Increased max-width for 3 columns */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-emerald-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/50 rounded-3xl"></div>

          <div ref={headerRef} className="text-center mb-8 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-2">
              Join GreenCoinX
            </h2>
            <p className="text-gray-600">Create an account to get started</p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleRegisterSubmit}
            className="space-y-6 relative z-10"
          >
            {/* --- CHANGE: Updated to a 3-column grid --- */}
            <div className="grid grid-cols-3 gap-4">
              {/* Producer */}
              <label
                className={`relative cursor-pointer rounded-xl transition-all duration-300 ${
                  userType === "producer" ? "ring-2 ring-emerald-500" : ""
                }`}
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
                  className={`p-4 rounded-xl border-2 text-center h-full flex flex-col justify-center items-center transition-all ${
                    userType === "producer"
                      ? "border-emerald-500 bg-emerald-50 shadow-lg"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <Zap
                    className={`w-6 h-6 mb-2 ${
                      userType === "producer"
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      userType === "producer"
                        ? "text-emerald-700"
                        : "text-gray-600"
                    }`}
                  >
                    Producer
                  </span>
                </div>
                {userType === "producer" && (
                  <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 bg-white rounded-full" />
                )}
              </label>

              {/* Buyer */}
              <label
                className={`relative cursor-pointer rounded-xl transition-all duration-300 ${
                  userType === "buyer" ? "ring-2 ring-emerald-500" : ""
                }`}
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
                  className={`p-4 rounded-xl border-2 text-center h-full flex flex-col justify-center items-center transition-all ${
                    userType === "buyer"
                      ? "border-emerald-500 bg-emerald-50 shadow-lg"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <Globe
                    className={`w-6 h-6 mb-2 ${
                      userType === "buyer"
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      userType === "buyer"
                        ? "text-emerald-700"
                        : "text-gray-600"
                    }`}
                  >
                    Buyer
                  </span>
                </div>
                {userType === "buyer" && (
                  <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 bg-white rounded-full" />
                )}
              </label>

              {/* Auditor */}
              <label
                className={`relative cursor-pointer rounded-xl transition-all duration-300 ${
                  userType === "auditor" ? "ring-2 ring-emerald-500" : ""
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  value="auditor"
                  checked={userType === "auditor"}
                  onChange={(e) => setUserType(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`p-4 rounded-xl border-2 text-center h-full flex flex-col justify-center items-center transition-all ${
                    userType === "auditor"
                      ? "border-emerald-500 bg-emerald-50 shadow-lg"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <Eye
                    className={`w-6 h-6 mb-2 ${
                      userType === "auditor"
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      userType === "auditor"
                        ? "text-emerald-700"
                        : "text-gray-600"
                    }`}
                  >
                    Auditor
                  </span>
                </div>
                {userType === "auditor" && (
                  <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-emerald-500 bg-white rounded-full" />
                )}
              </label>

              {/* --- CHANGE: Regulator option has been removed --- */}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Conditional rendering for company fields */}
            {(userType === "producer" || userType === "buyer") && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Company Name
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Company's Registration No.
                  </label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="companyRegistration"
                      value={formData.companyRegistration}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                      placeholder="e.g., U74999DL2015PTC288644"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 outline-none"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-center font-semibold pt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group"
            >
              <span>Create Account</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>

          <button
            onClick={() => navigate("/")}
            className="absolute top-4 left-4 p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 z-20"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
