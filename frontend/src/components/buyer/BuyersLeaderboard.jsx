import React, { useState, useEffect } from "react";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Globe,
  Medal,
  Star,
  TrendingUp,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Sub-components for better structure ---

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-emerald-100 flex items-center gap-4">
    <div className="p-3 bg-emerald-100 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const LeaderboardRow = ({ item, rank }) => {
  const getTrophyIcon = (rank) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return (
      <span className="text-lg font-bold text-gray-500 w-6 text-center">
        #{rank}
      </span>
    );
  };

  const getRankStyling = (rank) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 shadow-lg shadow-yellow-200/50";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200 shadow-lg shadow-gray-200/50";
    if (rank === 3)
      return "bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg shadow-amber-200/50";
    return "bg-white/80 border-b border-emerald-100 hover:bg-emerald-50";
  };

  return (
    <div
      className={`p-4 md:p-6 transition-all duration-300 ${getRankStyling(
        rank
      )}`}
      style={{ transitionDelay: `${((rank - 1) % 10) * 50}ms` }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {getTrophyIcon(rank)}
          <div>
            <h3 className="font-bold text-gray-800">{item.name}</h3>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-lg text-emerald-700">
            {item.totalHydrogenPurchasedKg.toLocaleString()} Kg
          </div>
          <div className="text-sm font-medium text-gray-500">
            ${item.totalSpentUSD.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Leaderboard Component ---
const BuyersLeaderboard = ({ setCurrentView }) => {
  const [buyersData, setBuyersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(0); // Initialize at 0
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/api/leaderboard/buyers`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setBuyersData(data || []);
      } catch (err) {
        console.error("Error fetching buyers leaderboard:", err);
        setError("Could not load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_BASE_URL]);

  // --- CORRECTION: Absolute timer countdown to midnight ---
  useEffect(() => {
    const getSecondsUntilMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0
      );
      const diffInSeconds = Math.round(
        (tomorrow.getTime() - now.getTime()) / 1000
      );
      return diffInSeconds;
    };

    // Set the initial time immediately
    setTimeUntilUpdate(getSecondsUntilMidnight());

    const timer = setInterval(() => {
      setTimeUntilUpdate((prev) => {
        if (prev <= 1) {
          // At midnight, reset to 24 hours
          return 24 * 60 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(buyersData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = buyersData.slice(startIndex, startIndex + itemsPerPage);
  const navigate = useNavigate();
  // Helper to format time
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12 md:px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
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
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-8 h-8 text-emerald-600" />}
            label="Total Buyers"
            value={buyersData.length}
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
            label="Top Buyer Purchase"
            value={
              buyersData[0]
                ? `${buyersData[0].totalHydrogenPurchasedKg.toLocaleString()} Kg`
                : "0 Kg"
            }
          />
          <StatCard
            icon={<Star className="w-8 h-8 text-emerald-600" />}
            label="Avg. Spent"
            value={`$${(
              buyersData.reduce((sum, d) => sum + (d.totalSpentUSD || 0), 0) /
              (buyersData.length || 1)
            ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          />
        </div>

        <div className="bg-white/80 rounded-2xl border border-emerald-100 shadow-xl overflow-hidden animate-fade-in">
          {currentItems.map((item, index) => (
            <LeaderboardRow
              key={item._id}
              item={item}
              rank={startIndex + index + 1}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing <strong>{startIndex + 1}</strong>-
            <strong>
              {Math.min(startIndex + itemsPerPage, buyersData.length)}
            </strong>{" "}
            of <strong>{buyersData.length}</strong>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="p-2 rounded-md transition-colors bg-white border border-gray-200 enabled:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-gray-700">{currentPage}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              aria-label="Next page"
              className="p-2 rounded-md transition-colors bg-white border border-gray-200 enabled:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/marketplace")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyersLeaderboard;
