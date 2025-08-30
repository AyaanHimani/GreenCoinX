import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Medal,
  Award,
  Zap,
  Globe,
  ChevronLeft,
  ChevronRight,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  Crown,
  Star,
} from "lucide-react";
import api from "../../api/axios"; // axios instance
import { useNavigate } from "react-router-dom";

const Leaderboard = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState("producers"); // 'producers' or 'buyers'
  const [currentPage, setCurrentPage] = useState(1);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(12 * 60 * 60);
  const itemsPerPage = 10;

  const [producersData, setProducersData] = useState([]);
  const [buyersData, setBuyersData] = useState([]);
  const leaderboardRef = useRef(null);
  const headerRef = useRef(null);

  // ✅ Fetch producers & buyers from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [producersRes, buyersRes] = await Promise.all([
          api.get("api/leaderboard/producers"),
          api.get("api/leaderboard/buyers"),
        ]);
        setProducersData(producersRes.data || []);
        setBuyersData(buyersRes.data || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchData();
  }, []);

  const currentData = activeTab === "producers" ? producersData : buyersData;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentData.slice(startIndex, endIndex);
  const navigate = useNavigate();
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilUpdate((prev) => (prev <= 1 ? 12 * 60 * 60 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animations
  useEffect(() => {
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

    if (leaderboardRef.current) {
      const items = leaderboardRef.current.children;
      Array.from(items).forEach((item, index) => {
        item.style.transform = "translateY(50px)";
        item.style.opacity = "0";
        setTimeout(() => {
          item.style.transition = "all 0.6s ease-out";
          item.style.transform = "translateY(0)";
          item.style.opacity = "1";
        }, 400 + index * 100);
      });
    }
  }, [activeTab, currentPage]);

  // Helpers
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatValue = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const getRankPosition = (index) => startIndex + index + 1;

  const getTrophyIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankStyling = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 shadow-lg shadow-yellow-200/50";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 shadow-lg shadow-gray-200/50";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg shadow-amber-200/50";
      default:
        return "bg-white/80 border border-emerald-100 hover:border-emerald-200";
    }
  };

  return (
    <div className="relative z-10 min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
            GreenCoinX Leaderboard
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Top performers in the green hydrogen marketplace
          </p>

          {/* Update Timer */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 border border-emerald-100 inline-flex items-center space-x-3 shadow-lg">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">
              Next update in:
            </span>
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-lg font-mono text-sm">
              {formatTime(timeUntilUpdate)}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 border border-emerald-100 shadow-lg">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setActiveTab("producers");
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "producers"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Producers</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("buyers");
                  setCurrentPage(1);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === "buyers"
                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <Globe className="w-5 h-5" />
                <span>Buyers</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total {activeTab}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {currentData.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Top Performer
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {formatValue(currentData[0]?.totalHydrogenProducedKg || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg GreenCoins
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {(
                    currentData.reduce(
                      (sum, d) => sum + (d.greenCoinsMinted || 0),
                      0
                    ) / (currentData.length || 1)
                  ).toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-emerald-100 shadow-xl overflow-hidden">
          <div ref={leaderboardRef} className="space-y-0">
            {currentItems.map((item, index) => {
              const rank = getRankPosition(index);
              const isTopThree = rank <= 3;

              return (
                <div
                  key={item._id}
                  className={`p-6 transition-all duration-300 hover:scale-[1.02] ${getRankStyling(
                    rank
                  )} ${
                    index !== currentItems.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                          isTopThree ? "bg-white/50" : "bg-emerald-50"
                        }`}
                      >
                        {getTrophyIcon(rank)}
                      </div>

                      <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl flex items-center justify-center text-2xl shadow-md">
                        🌱
                      </div>

                      <div>
                        <h3
                          className={`font-bold ${
                            isTopThree ? "text-lg" : "text-base"
                          } text-gray-800`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {item.company || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          isTopThree ? "text-xl" : "text-lg"
                        } text-gray-800 mb-1`}
                      >
                        {formatValue(
                          item.totalHydrogenProducedKg || item.value || 0
                        )}
                      </div>
                      <div
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          item.greenCoinsMinted > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.greenCoinsMinted} GC
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, currentData.length)} of{" "}
            {currentData.length} {activeTab}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 bg-white/80 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg"
                      : "bg-white/80 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 bg-white/80 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:border-emerald-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
