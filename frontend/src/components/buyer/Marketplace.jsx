import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Droplets, ArrowRight } from "lucide-react";
import BuyerSidebar from "../../components/buyer/BuyerSidebar"; // Adjust path if needed

const Marketplace = () => {
  const [sellRequests, setSellRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch sell requests from local storage instead of an API
    const storedRequests = localStorage.getItem("sellRequestsLog");
    const parsedRequests = storedRequests ? JSON.parse(storedRequests) : [];

    // Sort by creation date, newest first
    parsedRequests.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setSellRequests(parsedRequests);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <BuyerSidebar />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Marketplace</h1>
        <p className="text-gray-600 mb-8">
          Browse available Green Hydrogen Credits from top producers.
        </p>

        {sellRequests.length > 0 ? (
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
                <div>
                  <p className="text-sm text-gray-500">Producer</p>
                  <p className="text-xl font-bold text-emerald-600 truncate">
                    {req.producerId.company}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Available Quantity
                      </p>
                      <p className="font-semibold text-gray-800">
                        {req.hydrogenQty.toLocaleString("en-IN")} kg
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Price/kg</p>
                    <p className="font-bold text-lg text-gray-800">
                      ₹
                      {req.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
        ) : (
          <div className="text-center py-16 bg-gray-100 border border-gray-200 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-700">
              No Sell Requests Found
            </h3>
            <p className="text-gray-500 mt-2">
              The marketplace is currently empty. Please check back later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Marketplace;
