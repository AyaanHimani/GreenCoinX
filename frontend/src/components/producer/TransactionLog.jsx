import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Inbox,
  Copy,
  Check,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const TransactionLog = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const navigate = useNavigate();
  const headerRef = useRef(null);
  const listRef = useRef(null);

  // Fetch GreenCoin transaction logs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const producerName = localStorage.getItem("user"); // stored in LS
        const res = await axios.get(
          `${API_URL}/api/transactions/producer/${producerName}`,
          config
        );
        setTransactions(res.data || []); // expect an array
      } catch (err) {
        setError("Failed to fetch transaction history. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Animation
  useEffect(() => {
    if (headerRef.current) {
      headerRef.current.style.opacity = 0;
      headerRef.current.style.transform = "translateY(-20px)";
      setTimeout(() => {
        headerRef.current.style.transition = "all 0.5s ease-out";
        headerRef.current.style.opacity = 1;
        headerRef.current.style.transform = "translateY(0)";
      }, 100);
    }
    if (listRef.current) {
      const items = listRef.current.children;
      Array.from(items).forEach((item, index) => {
        item.style.opacity = 0;
        item.style.transform = "translateY(20px)";
        setTimeout(() => {
          item.style.transition = "all 0.4s ease-out";
          item.style.opacity = 1;
          item.style.transform = "translateY(0)";
        }, 300 + index * 70);
      });
    }
  }, [loading, transactions]);

  const handleCopy = (text, hash) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const renderTransaction = (txn) => {
    const isCredit = txn.type === "credit"; // credit = minted/added, debit = spent
    const Icon = isCredit ? TrendingUp : TrendingDown;
    const colorClass = isCredit ? "text-green-600" : "text-red-600";
    const bgClass = isCredit ? "bg-green-100" : "bg-red-100";
    const pointPrefix = isCredit ? "+" : "-";

    return (
      <div
        key={txn._id}
        className="bg-white/80 backdrop-blur-lg border border-emerald-100 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:space-x-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
      >
        {/* Icon */}
        <div className="flex items-center space-x-4 sm:flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass} flex-shrink-0`}
          >
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
        </div>

        {/* Details */}
        <div className="flex-grow mt-3 sm:mt-0">
          <p className="font-semibold text-gray-800">{txn.reason || "GreenCoin Txn"}</p>
          <p className="text-sm text-gray-500">
            {new Date(txn.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Amount + Hash */}
        <div className="flex flex-col items-end space-y-1 mt-3 sm:mt-0 text-right">
          <p className={`text-lg font-bold ${colorClass}`}>
            {pointPrefix}
            {(txn.greenCoins || 0).toLocaleString()} GCX
          </p>
          {txn.txnHash && (
            <div className="flex items-center space-x-2 font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
              <span>
                {txn.txnHash.substring(0, 8)}...
                {txn.txnHash.substring(txn.txnHash.length - 6)}
              </span>
              <button onClick={() => handleCopy(txn.txnHash, txn._id)}>
                {copiedHash === txn._id ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 hover:text-emerald-600" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading)
      return (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    if (error)
      return (
        <div className="text-center py-16 bg-red-50 border border-red-200 rounded-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700">Error</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      );
    if (transactions.length === 0)
      return (
        <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-2xl">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No Transactions Found
          </h3>
          <p className="text-gray-500 mt-2">
            You don’t have any GreenCoin transactions yet.
          </p>
        </div>
      );

    return (
      <div ref={listRef} className="space-y-4 min-h-[500px]">
        {transactions.map(renderTransaction)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header
          ref={headerRef}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                GreenCoin Transactions
              </h1>
              <p className="text-gray-600">Like your bank statement</p>
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

        {/* Content */}
        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default TransactionLog;
