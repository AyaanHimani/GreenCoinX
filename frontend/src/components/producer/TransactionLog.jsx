import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Inbox,
  Download,
  Copy,
  Check,
  Leaf,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

// Reusable Pagination Component
const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  return (
    <nav className="mt-8 flex items-center justify-center space-x-2">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            currentPage === number
              ? "bg-emerald-500 text-white shadow-md"
              : "hover:bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === pageNumbers.length}
        className="p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

const TransactionLog = () => {
  const [activeTab, setActiveTab] = useState("sold");
  const [soldHistory, setSoldHistory] = useState([]);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const navigate = useNavigate();
  const headerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
        const [soldRes, generationRes] = await Promise.all([
          axios.get(`${API_URL}/api/producer/logs`, config),
          axios.get(`${API_URL}/api/producer/history`, config),
        ]);
        setSoldHistory(soldRes.data.logs);
        setGenerationHistory(generationRes.data.history);
      } catch (err) {
        setError("Failed to fetch transaction data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

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
  }, [loading, activeTab, currentPage]);

  const handleCopy = (text, hash) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const renderSoldItem = (log) => {
    const isCredit = log.type === "credit";
    const Icon = isCredit ? TrendingUp : TrendingDown;
    const colorClass = isCredit ? "text-green-600" : "text-red-600";
    const bgClass = isCredit ? "bg-green-100" : "bg-red-100";
    const pointPrefix = isCredit ? "+" : "-";
    const invoiceId = log.relatedTxn?.invoiceId;

    return (
      <div
        key={log._id}
        className="bg-white/80 backdrop-blur-lg border border-emerald-100 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center sm:space-x-4 hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
      >
        <div className="flex items-center space-x-4 sm:flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${bgClass} flex-shrink-0`}
          >
            <Icon className={`w-6 h-6 ${colorClass}`} />
          </div>
          <div className="flex-grow sm:hidden">
            <p className={`text-lg font-bold ${colorClass}`}>
              {pointPrefix}
              {log.points.toLocaleString()} PTS
            </p>
          </div>
        </div>
        <div className="flex-grow mt-3 sm:mt-0">
          <p className="font-semibold text-gray-800">{log.reason}</p>
          <p className="text-sm text-gray-500">
            {new Date(log.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 sm:mt-0 sm:flex-col sm:items-end sm:space-y-1 sm:text-right">
          <p className={`hidden sm:block text-lg font-bold ${colorClass}`}>
            {pointPrefix}
            {log.points.toLocaleString()} PTS
          </p>
          <button
            onClick={() => navigate(`/invoice/${invoiceId}`)}
            disabled={!invoiceId}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Invoice</span>
          </button>
        </div>
      </div>
    );
  };

  const renderGenerationItem = (log) => (
    <div
      key={log._id}
      className="bg-white/80 backdrop-blur-lg border border-emerald-100 rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-100">
            <Leaf className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-lg text-emerald-700">
              +{log.mintedCoins.toLocaleString()} GCX Minted
            </p>
            <p className="text-sm text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-800">Score: +{log.score}</p>
          <p className="text-sm text-gray-600">Purity: {log.purity}%</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600">Txn Hash:</span>
          <div className="flex items-center space-x-2 font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
            <span>
              {log.txnHash.substring(0, 8)}...
              {log.txnHash.substring(log.txnHash.length - 6)}
            </span>
            <button onClick={() => handleCopy(log.txnHash, log._id + "txn")}>
              {copiedHash === log._id + "txn" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 hover:text-emerald-600" />
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-600">IPFS CID:</span>
          <div className="flex items-center space-x-2 font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
            <span>
              {log.ipfsCid.substring(0, 8)}...
              {log.ipfsCid.substring(log.ipfsCid.length - 6)}
            </span>
            <button onClick={() => handleCopy(log.ipfsCid, log._id + "ipfs")}>
              {copiedHash === log._id + "ipfs" ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 hover:text-emerald-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const dataToShow = activeTab === "sold" ? soldHistory : generationHistory;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataToShow.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <h3 className="text-xl font-semibold text-red-700">
            Oops! Something went wrong.
          </h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      );
    if (dataToShow.length === 0)
      return (
        <div className="text-center py-16 bg-gray-50 border border-gray-200 rounded-2xl">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No Transactions Found
          </h3>
          <p className="text-gray-500 mt-2">
            There are no records in this category yet.
          </p>
        </div>
      );

    return (
      <>
        <div ref={listRef} className="space-y-4 min-h-[500px]">
          {activeTab === "sold"
            ? currentItems.map(renderSoldItem)
            : currentItems.map(renderGenerationItem)}
        </div>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={dataToShow.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </>
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Transaction Logs
              </h1>
              <p className="text-gray-600">Track your credits and sales</p>
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

        <div className="mb-6 flex items-center border-b border-gray-200">
          <button
            onClick={() => setActiveTab("sold")}
            className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "sold"
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-500 hover:text-emerald-500"
            }`}
          >
            <Send className="w-5 h-5" />
            <span>Sold Transactions</span>
          </button>
          <button
            onClick={() => setActiveTab("generation")}
            className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold transition-all ${
              activeTab === "generation"
                ? "border-b-2 border-emerald-500 text-emerald-600"
                : "text-gray-500 hover:text-emerald-500"
            }`}
          >
            <Leaf className="w-5 h-5" />
            <span>GreenCoin Generation</span>
          </button>
        </div>

        <main>{renderContent()}</main>
      </div>
    </div>
  );
};

export default TransactionLog;
