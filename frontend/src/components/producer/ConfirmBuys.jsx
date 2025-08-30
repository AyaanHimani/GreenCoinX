import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Droplets,
  DollarSign,
  Star,
  Inbox,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ConfirmBuys = () => {
  const [confirmedDeals, setConfirmedDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    // Fetch confirmed deals when the component mounts
    const fetchConfirmedDeals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        // This endpoint should fetch deals with a status of 'sold'
        const res = await axios.get(
          `${API_URL}/api/producer/sell-requests?status=sold`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConfirmedDeals(res.data.deals || []); // Assuming API returns { deals: [...] }
      } catch (err) {
        setError("Could not fetch confirmed sales.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmedDeals();
  }, [navigate]);

  // Animation for the header
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = 0;
      headerRef.current.style.transform = "translateY(-30px)";
      setTimeout(() => {
        headerRef.current.style.transition =
          "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        headerRef.current.style.opacity = 1;
        headerRef.current.style.transform = "translateY(0)";
      }, 200);
    }
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const DealCard = ({ deal }) => {
    const totalAmount = deal.hydrogenQty * deal.price;
    return (
      <motion.div
        layoutId={deal._id}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={deal.index}
        className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-lg p-6 space-y-4"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Sold to</p>
            <p className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>{deal.buyerId?.company || "N/A"}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
            <CheckCircle className="w-5 h-5" />
            <span>Sale Confirmed</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-t border-b border-gray-200 py-4">
          <div>
            <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
              <Droplets className="w-4 h-4" />
              <span>Quantity</span>
            </p>
            <p className="text-xl font-semibold text-gray-800">
              {deal.hydrogenQty} kg
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span>Price/kg</span>
            </p>
            <p className="text-xl font-semibold text-gray-800">
              ${deal.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 flex items-center justify-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Score</span>
            </p>
            <p className="text-xl font-semibold text-gray-800">{deal.score}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-600">Total Sale Value:</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
            $
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header
          ref={headerRef}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Confirmed Sales
              </h1>
              <p className="text-gray-600">
                A history of your finalized deals.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </header>

        <main>
          <div className="space-y-6">
            <AnimatePresence>
              {loading ? (
                <p className="text-gray-500 p-4">Loading confirmed sales...</p>
              ) : error ? (
                <div className="text-center py-10 bg-red-50 border border-red-200 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">{error}</p>
                </div>
              ) : confirmedDeals.length > 0 ? (
                confirmedDeals.map((deal, index) => (
                  <DealCard key={deal._id} deal={{ ...deal, index }} />
                ))
              ) : (
                <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-2xl">
                  <Inbox className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No confirmed sales found.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ConfirmBuys;
