import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle,
  Users,
  Droplets,
  DollarSign,
  Star,
  Loader2,
  Inbox,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ConfirmBuys = () => {
  const [pendingDeals, setPendingDeals] = useState([]);
  const [recentlyConfirmed, setRecentlyConfirmed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null); // Tracks which deal is being confirmed

  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    // Fetch pending deals when the component mounts
    const fetchPendingDeals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        // ASSUMPTION 1: This endpoint fetches deals ready for producer confirmation
        const res = await axios.get(
          `${API_URL}/api/producer/sell-requests?status=pending_confirmation`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPendingDeals(res.data.deals || []); // Assuming the API returns { deals: [...] }
      } catch (err) {
        setError("Could not fetch pending deals.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingDeals();
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

  const handleConfirmBuy = async (dealId) => {
    setConfirmingId(dealId);
    const loadingToast = toast.loading("Finalizing sale...");

    try {
      const token = localStorage.getItem("token");
      // ASSUMPTION 2: This endpoint confirms the deal
      const res = await axios.post(
        `${API_URL}/api/producer/sell-requests/${dealId}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const confirmedDeal = res.data.request; // The finalized sell request from your controller's response

      // Animate the card moving from pending to confirmed
      setPendingDeals((prev) => prev.filter((deal) => deal._id !== dealId));
      setRecentlyConfirmed((prev) => [confirmedDeal, ...prev]);

      toast.success("Sale confirmed and invoice generated!", {
        id: loadingToast,
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg || "Confirmation failed. Please try again.";
      toast.error(errorMsg, { id: loadingToast });
      console.error(err);
    } finally {
      setConfirmingId(null);
    }
  };

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
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  const DealCard = ({ deal, isConfirmed = false }) => {
    const totalAmount = deal.hydrogenQty * deal.price;
    return (
      <motion.div
        layoutId={deal._id}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={deal.index}
        className={`bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-lg p-6 space-y-4 ${
          isConfirmed ? "opacity-60" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">Buyer</p>
            <p className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>{deal.buyerId?.company || "N/A"}</span>
            </p>
          </div>
          {isConfirmed && (
            <div className="flex items-center space-x-2 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-semibold">
              <CheckCircle className="w-5 h-5" />
              <span>Confirmed</span>
            </div>
          )}
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
          <p className="text-lg font-medium text-gray-600">Total Deal Value:</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
            $
            {totalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        {!isConfirmed && (
          <button
            onClick={() => handleConfirmBuy(deal._id)}
            disabled={confirmingId === deal._id}
            className="w-full mt-2 py-3 flex items-center justify-center space-x-2 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {confirmingId === deal._id ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
            <span>
              {confirmingId === deal._id
                ? "Confirming..."
                : "Confirm & Finalize Sale"}
            </span>
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
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
                Confirm Sales
              </h1>
              <p className="text-gray-600">
                Finalize deals accepted by buyers.
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

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Column */}
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-emerald-400">
              Ready to Finalize ({pendingDeals.length})
            </h2>
            <div className="space-y-6">
              <AnimatePresence>
                {loading ? (
                  <p className="text-gray-500">Loading pending deals...</p>
                ) : error ? (
                  <div className="text-center py-10 bg-red-50 border border-red-200 rounded-2xl">
                    <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : pendingDeals.length > 0 ? (
                  pendingDeals.map((deal, index) => (
                    <DealCard key={deal._id} deal={{ ...deal, index }} />
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 border border-gray-200 rounded-2xl">
                    <Inbox className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      All caught up! No deals are awaiting confirmation.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Confirmed Column */}
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300">
              Recently Confirmed
            </h2>
            <div className="space-y-6">
              <AnimatePresence>
                {recentlyConfirmed.map((deal, index) => (
                  <DealCard
                    key={deal._id}
                    deal={{ ...deal, index }}
                    isConfirmed={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ConfirmBuys;
