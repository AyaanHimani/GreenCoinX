import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  PlusCircle,
  Droplets,
  DollarSign,
  Star,
  FileText,
  Loader2,
  Send,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const CreateSellRequest = () => {
  const [formData, setFormData] = useState({
    hydrogenQty: "",
    price: "",
    score: "",
    proofDoc: "", // This would typically be an IPFS CID
  });
  const [availableAssets, setAvailableAssets] = useState({ gcx: 0, score: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    // Fetch producer's available assets to sell
    const fetchProducerStats = async () => {
      try {
        setLoadingStats(true);
        const token = localStorage.getItem("token");
        // This endpoint should return the producer's available credits and average score
        const res = await axios.get(`${API_URL}/api/producer/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assuming API returns { totalScore: X, totalCoins: Y }
        const stats = {
          gcx: res.data.totalCoins,
          score: res.data.totalScore / res.data.history.length || 0,
        };
        setAvailableAssets(stats);
        // Pre-fill the score field
        setFormData((prev) => ({ ...prev, score: stats.score.toFixed(2) }));
      } catch (err) {
        toast.error("Could not load your available assets.");
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchProducerStats();
  }, []);

  // Entry animation for the form
  useEffect(() => {
    if (formRef.current) {
      formRef.current.style.opacity = 0;
      formRef.current.style.transform = "translateY(50px)";
      setTimeout(() => {
        formRef.current.style.transition =
          "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
        formRef.current.style.opacity = 1;
        formRef.current.style.transform = "translateY(0)";
      }, 200);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and a single decimal for quantity and price
    if (
      (name === "hydrogenQty" || name === "price") &&
      !/^\d*\.?\d*$/.test(value)
    ) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(formData.hydrogenQty) > availableAssets.gcx) {
      toast.error("You cannot sell more GCX than you own.");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Publishing your sell request...");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/producer/sell-requests`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Sell request published successfully!", {
        id: loadingToast,
      });
      navigate("/dashboard"); // Redirect after success
    } catch (err) {
      const errorMsg = err.response?.data?.msg || "Failed to publish request.";
      toast.error(errorMsg, { id: loadingToast });
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue =
    parseFloat(formData.hydrogenQty) * parseFloat(formData.price) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <PlusCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Create Sell Request
              </h1>
              <p className="text-gray-600">
                List your Green Hydrogen Credits on the marketplace.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        </header>

        <motion.div
          ref={formRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quantity Input */}
            <div className="space-y-2">
              <label
                htmlFor="hydrogenQty"
                className="text-sm font-semibold text-gray-700 flex justify-between items-center"
              >
                <span>Quantity to Sell (kg/GCX)</span>
                <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  Available:{" "}
                  {loadingStats ? "..." : availableAssets.gcx.toLocaleString()}
                </span>
              </label>
              <div className="relative group">
                <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="hydrogenQty"
                  name="hydrogenQty"
                  type="text"
                  value={formData.hydrogenQty}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  placeholder="e.g., 500"
                />
              </div>
            </div>

            {/* Price Input */}
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="text-sm font-semibold text-gray-700"
              >
                Price per Unit ($)
              </label>
              <div className="relative group">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  placeholder="e.g., 3.50"
                />
              </div>
            </div>

            {/* Score and Proof Doc Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="score"
                  className="text-sm font-semibold text-gray-700"
                >
                  Associated Score
                </label>
                <div className="relative group">
                  <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="score"
                    name="score"
                    type="text"
                    value={formData.score}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="proofDoc"
                  className="text-sm font-semibold text-gray-700"
                >
                  Proof Document (IPFS CID)
                </label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    id="proofDoc"
                    name="proofDoc"
                    type="text"
                    value={formData.proofDoc}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                    placeholder="ipfs://..."
                  />
                </div>
              </div>
            </div>

            {/* Total Value Display */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-emerald-800">
                Total Listing Value
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                $
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 flex items-center justify-center space-x-3 bg-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
              <span>
                {isSubmitting ? "Publishing..." : "Publish Sell Request"}
              </span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSellRequest;
