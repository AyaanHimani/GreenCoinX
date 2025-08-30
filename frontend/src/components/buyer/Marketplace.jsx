import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, DollarSign, Star, ArrowRight, Award } from "lucide-react";
import BuyerSidebar from "../../components/buyer/BuyerSidebar"; // Adjust path if needed

const API_URL = import.meta.env.VITE_API_URL;

const Marketplace = () => {
  const [sellRequests, setSellRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellRequests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/buyer/sell-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSellRequests(res.data.requests || []);
      } catch (error) {
        console.error("Failed to fetch sell requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellRequests();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  const RankBadge = ({ rank }) => {
    const colors = [
      "bg-yellow-400 text-yellow-900",
      "bg-gray-300 text-gray-800",
      "bg-yellow-600 text-yellow-100",
    ];
    const colorClass =
      rank < 3 ? colors[rank] : "bg-emerald-200 text-emerald-800";
    return (
      <div
        className={`absolute top-0 right-0 m-3 px-3 py-1 text-xs font-bold rounded-full flex items-center space-x-1 ${colorClass}`}
      >
        <Award className="w-4 h-4" />
        <span>Rank #{rank + 1}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <BuyerSidebar />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Marketplace</h1>
        <p className="text-gray-600 mb-8">
          Browse available Green Hydrogen Credits from top producers.
        </p>

        {loading ? (
          <p>Loading marketplace...</p>
        ) : (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sellRequests.map((req, index) => (
              <motion.div
                key={req._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                onClick={() => navigate(`/market/${req._id}`)}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 space-y-4 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 relative"
              >
                <RankBadge rank={index} />
                <div>
                  <p className="text-sm text-gray-500">Producer</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {req.producerId.company}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-semibold text-gray-800">
                        {req.hydrogenQty} kg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-500">Batch Score</p>
                      <p className="font-semibold text-gray-800">{req.score}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Price/kg</p>
                    <p className="font-bold text-lg text-gray-800">
                      ${req.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-emerald-600 font-semibold">
                    <span>View Deal</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
