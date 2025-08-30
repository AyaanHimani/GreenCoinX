import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import BuyerSidebar from "../../components/buyer/BuyerSidebar"; // Adjust path if needed

const API_URL = import.meta.env.VITE_API_URL;

const SellRequestDetailPage = () => {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_URL}/api/buyer/sell-requests/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeal(res.data.request);
      } catch (error) {
        console.error("Failed to fetch deal details:", error);
        toast.error("Could not load deal details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id]);

  const handleRequestBuy = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading(
      "Sending your request to the producer..."
    );
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/api/buyer/sell-requests/${id}/buy`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Request sent! The producer will confirm the sale.", {
        id: loadingToast,
      });
      navigate("/transactions"); // Navigate to a "my transactions" page
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to send request.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Deal...
      </div>
    );
  if (!deal)
    return (
      <div className="flex h-screen items-center justify-center">
        Deal not found.
      </div>
    );

  const totalValue = deal.hydrogenQty * deal.price;

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      <BuyerSidebar />
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        <button
          onClick={() => navigate("/marketplace")}
          className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 font-semibold mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Marketplace</span>
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Deal Details</h1>
          <p className="text-gray-500 mt-1">
            Review the details below and submit your request to buy.
          </p>
          <div className="mt-6 border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Side: Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Producer Information
              </h2>
              <p>
                <strong>Company:</strong> {deal.producerId.company}
              </p>

              <h2 className="text-xl font-semibold text-gray-700 mt-4">
                Batch Details
              </h2>
              <p>
                <strong>Quantity:</strong> {deal.hydrogenQty} kg of Green
                Hydrogen Credits
              </p>
              <p>
                <strong>Quality Score:</strong> {deal.score} points
              </p>
              <p>
                <strong>Proof Document:</strong>{" "}
                <a
                  href={`https://ipfs.io/ipfs/${deal.proofDoc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  {deal.proofDoc}
                </a>
              </p>
            </div>
            {/* Right Side: Action Panel */}
            <div className="bg-gray-50 rounded-xl p-6 border">
              <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
                Purchase Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Price per kg/GCX</span>
                  <span className="font-semibold text-gray-800">
                    ${deal.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-semibold text-gray-800">
                    {deal.hydrogenQty} kg
                  </span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between items-center text-2xl">
                  <span className="font-medium text-gray-800">Total Cost</span>
                  <span className="font-bold text-emerald-600">
                    $
                    {totalValue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={handleRequestBuy}
                disabled={isSubmitting}
                className="w-full mt-6 py-4 flex items-center justify-center space-x-2 bg-emerald-500 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-emerald-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" />
                )}
                <span>
                  {isSubmitting ? "Sending Request..." : "Request to Buy"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellRequestDetailPage;
