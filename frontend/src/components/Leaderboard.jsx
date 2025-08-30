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

const Leaderboard = ({ setCurrentView }) => {
  const [activeTab, setActiveTab] = useState("producers"); // 'producers' or 'buyers'
  const [currentPage, setCurrentPage] = useState(1);
  const [timeUntilUpdate, setTimeUntilUpdate] = useState(12 * 60 * 60); // 12 hours in seconds
  const itemsPerPage = 10;

  const leaderboardRef = useRef(null);
  const headerRef = useRef(null);

  // Dummy data for producers
  const producersData = [
    {
      id: 1,
      name: "GreenTech Solutions",
      company: "GreenTech Industries",
      value: 2847563,
      change: "+12.5%",
      avatar: "🏭",
      location: "California, USA",
    },
    {
      id: 2,
      name: "HydroGenesis Corp",
      company: "HydroGenesis LLC",
      value: 2654321,
      change: "+8.3%",
      avatar: "⚡",
      location: "Texas, USA",
    },
    {
      id: 3,
      name: "EcoFuel Dynamics",
      company: "EcoFuel Industries",
      value: 2234567,
      change: "+15.7%",
      avatar: "🌱",
      location: "Germany",
    },
    {
      id: 4,
      name: "CleanEnergy Pro",
      company: "CleanEnergy Corp",
      value: 1987654,
      change: "+6.2%",
      avatar: "🔋",
      location: "Japan",
    },
    {
      id: 5,
      name: "SolarHydro Ltd",
      company: "SolarHydro Group",
      value: 1876543,
      change: "+4.8%",
      avatar: "☀️",
      location: "Australia",
    },
    {
      id: 6,
      name: "WindPower H2",
      company: "WindPower Solutions",
      value: 1654321,
      change: "+9.1%",
      avatar: "💨",
      location: "Denmark",
    },
    {
      id: 7,
      name: "BioHydrogen Inc",
      company: "BioHydrogen Corp",
      value: 1543210,
      change: "+7.4%",
      avatar: "🧬",
      location: "Canada",
    },
    {
      id: 8,
      name: "RenewableForce",
      company: "RenewableForce Ltd",
      value: 1432109,
      change: "+5.9%",
      avatar: "⚡",
      location: "Norway",
    },
    {
      id: 9,
      name: "GreenFusion Energy",
      company: "GreenFusion Group",
      value: 1321098,
      change: "+11.2%",
      avatar: "🌿",
      location: "Sweden",
    },
    {
      id: 10,
      name: "HydroPure Systems",
      company: "HydroPure Inc",
      value: 1210987,
      change: "+3.6%",
      avatar: "💧",
      location: "Netherlands",
    },
    {
      id: 11,
      name: "EcoTech Innovations",
      company: "EcoTech Corp",
      value: 1109876,
      change: "+8.7%",
      avatar: "🔬",
      location: "Finland",
    },
    {
      id: 12,
      name: "CleanHydro Ltd",
      company: "CleanHydro Group",
      value: 1098765,
      change: "+6.8%",
      avatar: "🏗️",
      location: "Switzerland",
    },
    {
      id: 13,
      name: "SustainablePower",
      company: "SustainablePower Inc",
      value: 987654,
      change: "+4.2%",
      avatar: "🌍",
      location: "Austria",
    },
    {
      id: 14,
      name: "GreenGrid Solutions",
      company: "GreenGrid Corp",
      value: 876543,
      change: "+10.3%",
      avatar: "⚡",
      location: "Belgium",
    },
    {
      id: 15,
      name: "HydroMax Energy",
      company: "HydroMax Ltd",
      value: 765432,
      change: "+2.1%",
      avatar: "💪",
      location: "France",
    },
  ];

  // Dummy data for buyers
  const buyersData = [
    {
      id: 1,
      name: "Tesla Motors",
      company: "Tesla Inc",
      value: 3456789,
      change: "+18.2%",
      avatar: "🚗",
      location: "California, USA",
    },
    {
      id: 2,
      name: "Amazon Logistics",
      company: "Amazon Inc",
      value: 3234567,
      change: "+14.7%",
      avatar: "📦",
      location: "Seattle, USA",
    },
    {
      id: 3,
      name: "Toyota Hydrogen",
      company: "Toyota Motor Corp",
      value: 2987654,
      change: "+16.4%",
      avatar: "🚙",
      location: "Japan",
    },
    {
      id: 4,
      name: "Shell Energy",
      company: "Shell plc",
      value: 2765432,
      change: "+9.8%",
      avatar: "⛽",
      location: "Netherlands",
    },
    {
      id: 5,
      name: "BMW Group",
      company: "BMW AG",
      value: 2543210,
      change: "+12.1%",
      avatar: "🏎️",
      location: "Germany",
    },
    {
      id: 6,
      name: "Hyundai Motors",
      company: "Hyundai Group",
      value: 2321098,
      change: "+7.5%",
      avatar: "🚗",
      location: "South Korea",
    },
    {
      id: 7,
      name: "BP Hydrogen",
      company: "BP plc",
      value: 2198765,
      change: "+13.9%",
      avatar: "🛢️",
      location: "UK",
    },
    {
      id: 8,
      name: "Volvo Trucks",
      company: "Volvo Group",
      value: 2076543,
      change: "+6.3%",
      avatar: "🚛",
      location: "Sweden",
    },
    {
      id: 9,
      name: "Honda Motors",
      company: "Honda Corp",
      value: 1954321,
      change: "+11.6%",
      avatar: "🏍️",
      location: "Japan",
    },
    {
      id: 10,
      name: "Mercedes-Benz",
      company: "Daimler AG",
      value: 1832109,
      change: "+8.9%",
      avatar: "🚗",
      location: "Germany",
    },
    {
      id: 11,
      name: "Airbus Industries",
      company: "Airbus SE",
      value: 1709876,
      change: "+15.2%",
      avatar: "✈️",
      location: "France",
    },
    {
      id: 12,
      name: "Siemens Energy",
      company: "Siemens AG",
      value: 1587654,
      change: "+4.7%",
      avatar: "⚡",
      location: "Germany",
    },
    {
      id: 13,
      name: "General Electric",
      company: "GE Company",
      value: 1465432,
      change: "+10.8%",
      avatar: "🔧",
      location: "USA",
    },
    {
      id: 14,
      name: "Rolls-Royce",
      company: "Rolls-Royce plc",
      value: 1343210,
      change: "+7.1%",
      avatar: "✈️",
      location: "UK",
    },
    {
      id: 15,
      name: "Caterpillar Inc",
      company: "Caterpillar Inc",
      value: 1220987,
      change: "+5.4%",
      avatar: "🚜",
      location: "USA",
    },
  ];

  const currentData = activeTab === "producers" ? producersData : buyersData;
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentData.slice(startIndex, endIndex);

  // Timer effect for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilUpdate((prev) => {
        if (prev <= 1) {
          return 12 * 60 * 60; // Reset to 12 hours
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Entry animations
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

  // Format time remaining
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format value
  const formatValue = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get rank position (considering pagination)
  const getRankPosition = (index) => {
    return startIndex + index + 1;
  };

  // Get trophy component for top 3
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

  // Get rank styling for top 3
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

        {/* Tab Navigation */}
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

        {/* Stats Cards */}
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
                  {formatValue(currentData[0]?.value || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-100 shadow-lg">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Average Growth
                </p>
                <p className="text-2xl font-bold text-gray-800">+9.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-emerald-100 shadow-xl overflow-hidden">
          <div ref={leaderboardRef} className="space-y-0">
            {currentItems.map((item, index) => {
              const rank = getRankPosition(index);
              const isTopThree = rank <= 3;

              return (
                <div
                  key={item.id}
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
                      {/* Rank */}
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                          isTopThree ? "bg-white/50" : "bg-emerald-50"
                        }`}
                      >
                        {getTrophyIcon(rank)}
                      </div>

                      {/* Avatar */}
                      <div className="w-14 h-14 bg-gradient-to-r from-emerald-100 to-green-100 rounded-xl flex items-center justify-center text-2xl shadow-md">
                        {item.avatar}
                      </div>

                      {/* Info */}
                      <div>
                        <h3
                          className={`font-bold ${
                            isTopThree ? "text-lg" : "text-base"
                          } text-gray-800`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.company}</p>
                        <p className="text-gray-500 text-xs flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{item.location}</span>
                        </p>
                      </div>
                    </div>

                    {/* Value and Change */}
                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          isTopThree ? "text-xl" : "text-lg"
                        } text-gray-800 mb-1`}
                      >
                        {formatValue(item.value)}
                      </div>
                      <div
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          item.change.startsWith("+")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.change}
                      </div>
                    </div>
                  </div>

                  {/* Top 3 Special Effects */}
                  {isTopThree && (
                    <div className="mt-4 p-3 bg-white/30 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Performance Bonus</span>
                        <span className="font-semibold text-emerald-600">
                          {rank === 1 ? "+50%" : rank === 2 ? "+30%" : "+20%"}
                        </span>
                      </div>
                    </div>
                  )}
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

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentView("landing")}
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
