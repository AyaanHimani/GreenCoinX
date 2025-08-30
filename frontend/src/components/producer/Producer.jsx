import React, { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Zap,
  Droplets,
  Leaf,
  Battery,
  Trophy,
  FileText,
  CheckSquare,
  PlusCircle,
  Wallet,
  DollarSign,
  TrendingUp,
  Activity,
  Send,
  RotateCcw,
  Wifi,
  WifiOff,
  Clock,
  AlertCircle,
  ArrowRight,
  Menu, // <-- Added for hamburger icon
  X, // <-- Added for close icon
  User, // <-- Added for profile icon
  LogOut, // <-- Added for logout icon
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { HOST } from "../../utils/constants";
const API_URL = import.meta.env.VITE_API_URL;

const SOCKET_URL = `${API_URL}`;

const Producer = () => {
  const [iotData, setIotData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeMetric, setActiveMetric] = useState("hydrogenQty");
  const [walletBalance, setWalletBalance] = useState({
    gcx: 15420.5,
    usd: 28750.0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);

  // --- State for new UI features ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null); // Ref for profile dropdown

  const dashboardRef = useRef(null);
  const metricsRef = useRef(null);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  // --- Logout Function ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload(); // Instantly reload the page
  };

  // --- Effect to close profile dropdown on outside click ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // connect socket
    const token = localStorage.getItem("token"); // if backend uses auth
    const socket = io(SOCKET_URL, {
      auth: { token }, // backend can verify token
      transports: ["websocket"], // better than polling
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Connected to socket server");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Disconnected from socket server");
    });

    // IoT data event
    socket.on("iotData", (newData) => {
      setIotData(newData);

      setChartData((prev) => {
        const updated = [
          ...prev,
          {
            time: new Date(newData.timestamp).toLocaleTimeString(),
            hydrogenQty: parseFloat(newData.hydrogenQty),
            purity: parseFloat(newData.purity),
            renewableShare: parseFloat(newData.renewableShare),
            powerConsumption: parseFloat(newData.powerConsumption),
            powerFromRenewable: parseFloat(newData.powerFromRenewable),
          },
        ];
        return updated.slice(-20);
      });

      if (newData.wallet) {
        setWalletBalance(newData.wallet);
      }
    });

    // Transaction log event (like bank statement updates)
    socket.on("transactionLog", (log) => {
      console.log("📒 New transaction log:", log);
      // you can append it to state if you maintain logs in frontend
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Entry animations
  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.style.transform = "translateY(30px)";
      dashboardRef.current.style.opacity = "0";
      setTimeout(() => {
        dashboardRef.current.style.transition = "all 0.8s ease-out";
        dashboardRef.current.style.transform = "translateY(0)";
        dashboardRef.current.style.opacity = "1";
      }, 200);
    }

    if (metricsRef.current) {
      const cards = metricsRef.current.children;
      Array.from(cards).forEach((card, index) => {
        card.style.transform = "translateY(50px)";
        card.style.opacity = "0";
        setTimeout(() => {
          card.style.transition = "all 0.6s ease-out";
          card.style.transform = "translateY(0)";
          card.style.opacity = "1";
        }, 400 + index * 100);
      });
    }
  }, []);

  const handleSubmitBatch = async () => {
    if (!iotData) return;

    setIsSubmitting(true);
    try {
      // Use real backend API call
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/api/producer/submit`,
        {}, // No body needed, backend uses latest IoT data
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLastSubmission(new Date());
      setChartData([]); // Reset chart data

      // Optionally update wallet balance if returned by backend
      // Example: setWalletBalance(response.data.wallet);
    } catch (error) {
      console.error("Submission failed:", error?.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const metrics = [
    {
      key: "hydrogenQty",
      label: "Hydrogen Quantity",
      value: iotData?.hydrogenQty || "0",
      unit: "kg",
      icon: Droplets,
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      key: "purity",
      label: "Purity Level",
      value: iotData?.purity || "0",
      unit: "%",
      icon: Zap,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
    },
    {
      key: "renewableShare",
      label: "Renewable Share",
      value: iotData?.renewableShare || "0",
      unit: "%",
      icon: Leaf,
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      key: "powerConsumption",
      label: "Power Consumption",
      value: iotData?.powerConsumption || "0",
      unit: "kWh",
      icon: Battery,
      color: "from-orange-500 to-amber-600",
      bgColor: "from-orange-50 to-amber-50",
    },
  ];

  const navLinks = [
    {
      label: "Leaderboard",
      icon: Trophy,
      action: () => navigate("leaderboard"),
    },
    {
      label: "Transaction Logs",
      icon: FileText,
      action: () => navigate("/transaction"),
    },
    {
      label: "Confirm Buys",
      icon: CheckSquare,
      action: () => navigate("/confirm-buys"),
    },
    {
      label: "Create Sell Request",
      icon: PlusCircle,
      action: () => navigate("/create-sell"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Navigation Header */}
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-emerald-100 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Producer Dashboard
                </h1>
                <p className="text-xs text-gray-500">GreenCoinX Platform</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {/* Wallet Section (Visible on Large Screens) */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-emerald-100 shadow-md">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">GCX Balance</p>
                      <p className="text-sm font-bold text-emerald-600">
                        {walletBalance.gcx.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-emerald-100 shadow-md">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div className="text-right">
                      <p className="text-xs text-gray-500">USD Balance</p>
                      <p className="text-sm font-bold text-green-600">
                        ${walletBalance.usd.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-emerald-100 hover:text-emerald-700 transition-all"
                >
                  <User className="w-5 h-5" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-emerald-600"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* --- UPDATED Mobile Menu Content --- */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
              {/* Mobile Nav Links */}
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      link.action();
                      setIsMenuOpen(false); // Close menu on click
                    }}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-300 flex items-center space-x-3"
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </button>
                ))}
              </div>

              {/* --- Wallet Balances for Mobile View --- */}
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">
                        GCX Balance
                      </span>
                    </div>
                    <p className="text-sm font-bold text-emerald-600">
                      {walletBalance.gcx.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        USD Balance
                      </span>
                    </div>
                    <p className="text-sm font-bold text-green-600">
                      ${walletBalance.usd.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div ref={dashboardRef} className="max-w-7xl mx-auto px-6 py-8">
        {/* The rest of your dashboard content remains unchanged... */}
        {/* Connection Status */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
              isConnected
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {isConnected ? (
              <Wifi className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
            <span>
              {isConnected ? "IoT Device Connected" : "IoT Device Disconnected"}
            </span>
            {isConnected && (
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Real-time Metrics Cards */}
        <div
          ref={metricsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.key}
                className={`bg-gradient-to-br ${
                  metric.bgColor
                } backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                  activeMetric === metric.key ? "ring-2 ring-emerald-500" : ""
                }`}
                onClick={() => setActiveMetric(metric.key)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                      {metric.label}
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mt-1">
                      {metric.value}
                      <span className="text-sm text-gray-600 ml-1">
                        {metric.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-time Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Real-time Production Data
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Live updates every 2 seconds
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span className="text-sm font-medium text-emerald-600">
                    Live
                  </span>
                </div>
              </div>

              {/* Metric Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {metrics.map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => setActiveMetric(metric.key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      activeMetric === metric.key
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>

              {/* Chart */}
              <div ref={chartRef} className="h-80">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10b981"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10b981"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="time"
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(value) =>
                          value.split(":").slice(0, 2).join(":")
                        }
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          border: "1px solid #d1d5db",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={activeMetric}
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#colorGradient)"
                        animationDuration={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Activity className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                      <p>Waiting for IoT data...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* IoT Data Display */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                <span>Live IoT Data</span>
              </h3>

              {iotData ? (
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Hydrogen Produced
                      </span>
                      <span className="text-lg font-bold text-emerald-600">
                        {iotData.hydrogenQty} kg
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Purity
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {iotData.purity}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Renewable Share
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {iotData.renewableShare}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Power Used
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        {iotData.powerConsumption} kWh
                      </span>
                    </div>
                  </div>

                  <div className="text-center pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        Updated:{" "}
                        {new Date(iotData.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Waiting for IoT data...</p>
                </div>
              )}
            </div>

            {/* Submit Batch Section */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Batch Operations
              </h3>

              {lastSubmission && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckSquare className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Last submitted: {lastSubmission.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <button
                  onClick={handleSubmitBatch}
                  disabled={!iotData || isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      <span>Submit Batch</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setChartData([])}
                  className="w-full py-3 border-2 border-emerald-300 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>Reset Graph</span>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            {/* <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Production
                  </span>
                  <span className="font-semibold text-gray-800">2,847 kg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Purity</span>
                  <span className="font-semibold text-emerald-600">96.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Renewable %</span>
                  <span className="font-semibold text-green-600">89.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Earnings</span>
                  <span className="font-semibold text-green-600">
                    $7,117.50
                  </span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">
                  View Rankings
                </h4>
                <p className="text-sm text-gray-600">Check leaderboard</p>
              </div>
            </div>
          </button>

          <button className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  Transaction History
                </h4>
                <p className="text-sm text-gray-600">View all trades</p>
              </div>
            </div>
          </button>

          <button className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                  Pending Orders
                </h4>
                <p className="text-sm text-gray-600">3 pending</p>
              </div>
            </div>
          </button>

          <button className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-left group">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  Create Listing
                </h4>
                <p className="text-sm text-gray-600">Sell hydrogen</p>
              </div>
            </div>
          </button>
        </div> */}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("landing")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Producer;
