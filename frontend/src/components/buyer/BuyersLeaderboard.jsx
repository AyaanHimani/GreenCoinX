import React, { useState, useEffect, useRef } from "react";
import { Trophy, Medal, Award, Globe, ChevronLeft, ChevronRight, Clock, TrendingUp, Users, ArrowRight, Crown, Star } from "lucide-react";
import api from "../../api/axios"; // axios instance

const BuyersLeaderboard = ({ setCurrentView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(12 * 60 * 60);
  const itemsPerPage = 10;

  const [buyersData, setBuyersData] = useState([]);
  const leaderboardRef = useRef(null);
  const headerRef = useRef(null);

  // ✅ Fetch buyers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("api/leaderboard/buyers");
        setBuyersData(res.data || []);
      } catch (err) {
        console.error("Error fetching buyers leaderboard:", err);
      }
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(buyersData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = buyersData.slice(startIndex, endIndex);

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
  }, [currentPage]);

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
              <Globe className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent mb-4">
            Buyer Leaderboard
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Top hydrogen buyers in the marketplace
          </p>
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 p-6 rounded-2xl shadow-lg border">
            <Users className="w-8 h-8 text-emerald-600" />
            <p className="text-sm text-gray-600">Total Buyers</p>
            <p className="text-2xl font-bold">{buyersData.length}</p>
          </div>
          <div className="bg-white/80 p-6 rounded-2xl shadow-lg border">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            <p className="text-sm text-gray-600">Top Buyer Purchase</p>
            <p className="text-2xl font-bold">
              {buyersData[0]
                ? `${buyersData[0].totalHydrogenPurchasedKg} Kg`
                : "0 Kg"}
            </p>
          </div>
          <div className="bg-white/80 p-6 rounded-2xl shadow-lg border">
            <Star className="w-8 h-8 text-emerald-600" />
            <p className="text-sm text-gray-600">Avg Spent (USD)</p>
            <p className="text-2xl font-bold">
              {(
                buyersData.reduce((sum, d) => sum + (d.totalSpentUSD || 0), 0) /
                (buyersData.length || 1)
              ).toFixed(1)}
            </p>
          </div>
        </div>

        {/* List */}
        <div className="bg-white/80 rounded-2xl border shadow-xl overflow-hidden">
          <div ref={leaderboardRef}>
            {currentItems.map((item, index) => {
              const rank = getRankPosition(index);
              return (
                <div
                  key={item._id}
                  className={`p-6 ${getRankStyling(rank)} border-b`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getTrophyIcon(rank)}
                      <div>
                        <h3 className="font-bold text-gray-800">{item.name}</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {item.totalHydrogenPurchasedKg} Kg
                      </div>
                      <div className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        ${item.totalSpentUSD}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, buyersData.length)} of{" "}
            {buyersData.length}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft />
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentView("landing")}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow-lg"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyersLeaderboard;
