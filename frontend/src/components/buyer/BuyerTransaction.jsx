import React, { useState, useEffect } from "react";

// --- Helper Components (Merged) ---

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg">
    <p className="font-bold">An Error Occurred</p>
    <p>{message}</p>
  </div>
);

const StatCard = ({ title, value, unit, icon }) => (
  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
    <div className="flex items-center">
      <div className="p-2 mr-4 text-green-600 bg-green-100 rounded-full">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}{" "}
          <span className="text-base font-normal text-gray-600">{unit}</span>
        </p>
      </div>
    </div>
  </div>
);

// --- Icons (Merged) ---
const HydroIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7C13.5 3 17 4 17 4a8 8 0 01.657 14.657z"
    />
  </svg>
);
const CoinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 8l3 5m0 0l3-5m-3 5v4m0 0H9m3 0h3m-7 4h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const TxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

// --- TransactionList Sub-component (Merged) ---
const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500">
        {" "}
        No transactions found in this category.{" "}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">
              {" "}
              Producer{" "}
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">
              {" "}
              Date{" "}
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">
              {" "}
              Hydrogen Qty{" "}
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">
              {" "}
              GreenCoins{" "}
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left text-gray-500">
              {" "}
              Status{" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx._id}
              className="border-b border-gray-200/50 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {" "}
                {tx.producerName}{" "}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {" "}
                {new Date(tx.createdAt).toLocaleDateString()}{" "}
              </td>
              <td className="px-4 py-3 text-gray-800">
                {" "}
                {tx.hydroQty.toLocaleString()} kg{" "}
              </td>
              <td className="px-4 py-3 font-medium text-green-700">
                {" "}
                {tx.greenCoins.toLocaleString()} GCX{" "}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    tx.isConfirm
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {tx.isConfirm ? "Paid" : "Pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {transactions.map((tx) => (
          <div
            key={tx._id}
            className="p-4 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-gray-800">{tx.producerName}</p>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  tx.isConfirm
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {tx.isConfirm ? "Paid" : "Pending"}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                {" "}
                Hydrogen:{" "}
                <span className="font-medium text-gray-800">
                  {" "}
                  {tx.hydroQty.toLocaleString()} kg{" "}
                </span>{" "}
              </span>
              <span>
                {" "}
                GreenCoins:{" "}
                <span className="font-medium text-green-700">
                  {" "}
                  {tx.greenCoins.toLocaleString()} GCX{" "}
                </span>{" "}
              </span>
            </div>
            <p className="mt-2 text-xs text-right text-gray-400">
              {" "}
              {new Date(tx.createdAt).toLocaleString()}{" "}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const BuyerTransaction = () => {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending"); // 'Pending' or 'Paid'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- CORRECTION: Use "username" from localStorage to match the API route param ":buyerName" ---
  const buyerName = localStorage.getItem("userId");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Do not fetch data if buyerName is not available
    if (!buyerName) {
      setError("User information not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [summaryRes, transactionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/transactions/buyer/${buyerName}/summary`, {
            headers,
          }),
          fetch(`${API_BASE_URL}/api/transactions/buyer/${buyerName}`, {
            headers,
          }),
        ]);

        if (!summaryRes.ok || !transactionsRes.ok) {
          throw new Error("Failed to fetch transaction data.");
        }

        const summaryData = await summaryRes.json();
        const transactionsData = await transactionsRes.json();

        setSummary(summaryData);
        setTransactions(transactionsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [buyerName, API_BASE_URL]);

  const pendingTransactions = transactions.filter((tx) => !tx.isConfirm);
  const paidTransactions = transactions.filter((tx) => tx.isConfirm);

  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-green-800">My Transactions</h1>
          <p className="text-gray-500">
            {" "}
            View your pending and completed payments.{" "}
          </p>
        </header>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && summary && (
          <>
            {/* Summary Stats */}
            <section className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Hydrogen Purchased"
                value={summary.totalHydrogenPurchased || 0}
                unit="kg"
                icon={<HydroIcon />}
              />
              <StatCard
                title="Total GreenCoins Spent"
                value={summary.totalGreenCoins || 0}
                unit="GCX"
                icon={<CoinIcon />}
              />
              <StatCard
                title="Total Transactions"
                value={summary.totalTransactions || 0}
                unit=""
                icon={<TxIcon />}
              />
            </section>

            {/* Transaction List with Tabs */}
            <section className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="flex gap-4 p-4">
                  <button
                    onClick={() => setActiveTab("Pending")}
                    className={`px-3 py-2 font-medium rounded-md text-sm transition-colors ${
                      activeTab === "Pending"
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Pending ({pendingTransactions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("Paid")}
                    className={`px-3 py-2 font-medium rounded-md text-sm transition-colors ${
                      activeTab === "Paid"
                        ? "bg-green-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Paid ({paidTransactions.length})
                  </button>
                </nav>
              </div>

              <div>
                {activeTab === "Pending" ? (
                  <TransactionList transactions={pendingTransactions} />
                ) : (
                  <TransactionList transactions={paidTransactions} />
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerTransaction;
