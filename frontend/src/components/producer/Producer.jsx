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
  TrendingUp,
  Activity,
  Send,
  Wifi,
  WifiOff,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = `${API_URL}`;

const Producer = () => {
  const [iotData, setIotData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [activeMetric, setActiveMetric] = useState("hydrogenQty");
  const [walletBalance, setWalletBalance] = useState({ gcx: 0 });
  const [avgHydrogen, setAvgHydrogen] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    socket.on("iotData", (newData) => {
      setIotData(newData);
      setChartData((prev) => {
        const updated = [
          ...prev,
          {
            time: new Date(newData.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            hydrogenQty: parseFloat(newData.hydrogenQty),
            purity: parseFloat(newData.purity),
            renewableShare: parseFloat(newData.renewableShare),
            powerConsumption: parseFloat(newData.powerConsumption),
            powerFromRenewable: parseFloat(newData.powerFromRenewable),
          },
        ];
        return updated.slice(-20);
      });
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const producerName = localStorage.getItem("user");
        const res = await axios.get(
          `${API_URL}/api/transactions/producer/${producerName}/summary`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWalletBalance({ gcx: res.data.totalGreenCoins || 0 });
      } catch (err) {
        console.error("Error fetching GCX summary:", err);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    if (chartData.length > 0) {
      const avg =
        chartData.reduce((acc, d) => acc + (d.hydrogenQty || 0), 0) /
        chartData.length;
      setAvgHydrogen(avg.toFixed(2));
    }
  }, [chartData]);

  const handleSubmitBatch = async () => {
    if (!iotData) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/producer/submit`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLastSubmission(new Date());
      setChartData([]);
      navigate("/create-sell");
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
    {
      key: "avgHydrogen",
      label: "Avg Hydrogen",
      value: avgHydrogen,
      unit: "kg",
      icon: TrendingUp,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
    },
  ];

  const navLinks = [
    {
      label: "Leaderboard",
      icon: Trophy,
      action: () => navigate("/leaderboard"),
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
      {/* --- NAVIGATION (Restored) --- */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-emerald-100 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center space-x-2"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center">
              <div className="bg-white/90 rounded-xl p-3 border border-emerald-100 shadow-md flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <div className="text-right">
                  <p className="text-xs text-gray-500">GCX Balance</p>
                  <p className="text-sm font-bold text-emerald-600">
                    {walletBalance.gcx.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
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
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 px-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  link.action();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </button>
            ))}
            <div className="mt-4 bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <Wallet className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-700">GCX</span>
              <p className="text-sm font-bold text-emerald-600">
                {walletBalance.gcx.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </nav>

      {/* --- MAIN DASHBOARD --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div
                key={metric.key}
                className={`bg-gradient-to-br ${
                  metric.bgColor
                } rounded-2xl p-6 border shadow-lg hover:scale-105 cursor-pointer ${
                  activeMetric === metric.key ? "ring-2 ring-emerald-500" : ""
                }`}
                onClick={() => setActiveMetric(metric.key)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{metric.label}</div>
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

        {/* --- GRAPH/CHART SECTION (Restored) --- */}
        <section className="bg-white/80 backdrop-blur-lg rounded-2xl border border-emerald-100 shadow-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Live Performance:{" "}
            <span className="text-emerald-600">
              {metrics.find((m) => m.key === activeMetric)?.label}
            </span>
          </h3>
          {chartData.length > 0 ? (
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(5px)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke="#059669"
                    fillOpacity={1}
                    fill="url(#chartColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Waiting for IoT data to populate the graph...
            </div>
          )}
        </section>

        {/* --- BATCH OPERATIONS (Restored) --- */}
        <div className="bg-white/80 rounded-2xl p-6 border shadow-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Batch Operations
          </h3>
          {lastSubmission && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
              <span className="text-sm text-green-700">
                Last submitted: {lastSubmission.toLocaleTimeString()}
              </span>
            </div>
          )}
          <div className="space-y-4">
            <button
              onClick={handleSubmitBatch}
              disabled={!iotData || isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Batch"}
            </button>
          </div>
        </div>
      </div>

      {/* --- FLOATING LIVE FEED (Restored) --- */}
      {iotData && (
        <div className="fixed bottom-6 right-6 bg-white/90 backdrop-blur-lg border border-emerald-200 shadow-2xl rounded-xl p-4 w-64">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Live Feed</span>
          </h4>
          <p className="text-gray-700 text-sm">
            <strong>{iotData.hydrogenQty}</strong> kg @{" "}
            {new Date(iotData.timestamp).toLocaleTimeString()}
          </p>
          <p className="text-xs text-gray-500">
            Purity: {iotData.purity}% | Power: {iotData.powerConsumption} kWh
          </p>
        </div>
      )}
    </div>
  );
};

export default Producer;
