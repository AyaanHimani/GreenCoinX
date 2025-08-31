import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  PlusCircle,
  Droplets,
  IndianRupee, // Changed from DollarSign
  Send,
} from "lucide-react";

const CreateSellRequest = () => {
  const [formData, setFormData] = useState({
    hydrogenQty: "",
    price: "",
  });
  const [availableGcx, setAvailableGcx] = useState(0);

  const navigate = useNavigate();

  // On component load, get the available balance from localStorage
  useEffect(() => {
    const balance = parseFloat(localStorage.getItem("gcxBalance")) || 0;
    setAvailableGcx(balance);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Allow only numbers and a single decimal
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const qty = parseFloat(formData.hydrogenQty) || 0;
    const price = parseFloat(formData.price) || 0;
    const availableGcx = parseFloat(localStorage.getItem("gcxBalance")) || 0;

    if (qty <= 0 || price <= 0) {
      toast.error("Please enter a valid quantity and price.");
      return;
    }

    if (qty > availableGcx) {
      toast.error("You cannot sell more GCX than you have available.");
      return;
    }

    // --- Create and save the full sell request for the marketplace ---
    const newSellRequest = {
      _id: new Date().toISOString() + Math.random(), // Unique ID
      producerId: {
        company: localStorage.getItem("user") || "Anonymous Producer",
      },
      hydrogenQty: qty,
      price: price,
      createdAt: new Date().toISOString(),
    };
    const sellRequests =
      JSON.parse(localStorage.getItem("sellRequestsLog")) || [];
    sellRequests.push(newSellRequest);
    localStorage.setItem("sellRequestsLog", JSON.stringify(sellRequests));

    // --- The rest of your existing logic remains the same ---

    // 1. Update Balance
    const newBalance = availableGcx - qty;
    localStorage.setItem("gcxBalance", newBalance.toString());

    // 2. Create and Save Transaction Log for history
    const newTransaction = {
      _id: new Date().toISOString() + Math.random(),
      type: "debit",
      reason: `Sell Request for ${qty.toLocaleString("en-IN")} GCX`,
      createdAt: new Date().toISOString(),
      greenCoins: qty,
      txnHash:
        "0x" +
        [...Array(40)]
          .map(() => Math.floor(Math.random() * 16).toString(16))
          .join(""),
    };
    const transactions =
      JSON.parse(localStorage.getItem("gcxTransactions")) || [];
    transactions.push(newTransaction);
    localStorage.setItem("gcxTransactions", JSON.stringify(transactions));

    toast.success("Sell request published successfully!");
    navigate("/dashboard");
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
                  Available: {availableGcx.toLocaleString()}
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

            {/* Price Input (Updated for INR) */}
            <div className="space-y-2">
              <label
                htmlFor="price"
                className="text-sm font-semibold text-gray-700"
              >
                Price per Unit (₹)
              </label>
              <div className="relative group">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all"
                  placeholder="e.g., 250"
                />
              </div>
            </div>

            {/* Total Value Display (Updated for INR) */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-lg font-semibold text-emerald-800">
                Total Listing Value
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                ₹
                {totalValue.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-4 flex items-center justify-center space-x-3 bg-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105"
            >
              <Send className="w-6 h-6" />
              <span>Publish Sell Request</span>
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSellRequest;
