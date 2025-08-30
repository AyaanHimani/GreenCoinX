import React, { useState, useEffect } from "react";

// --- Helper Components ---
const LoadingSpinner = ({ fullScreen = false }) => (
  <div
    className={`flex justify-center items-center ${
      fullScreen ? "w-full h-screen" : "p-8"
    }`}
  >
    <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 m-4 text-center text-red-700 bg-red-100 border border-red-300 rounded-lg">
    <p className="font-bold">An Error Occurred</p>
    <p>{message}</p>
  </div>
);

// --- Icons ---
const ProductionIcon = () => (
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
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const PurchaseIcon = () => (
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
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"
    />
  </svg>
);
const FlagProducerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-2"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
      clipRule="evenodd"
    />
  </svg>
);
const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);
const FlagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4 text-red-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
      clipRule="evenodd"
    />
  </svg>
);
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// --- Sub-components ---
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

const CompanyList = ({
  companies,
  onSelect,
  selectedCompany,
  filter,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies
    .filter((c) => {
      if (filter === "All") return true;
      if (filter === "Producers") return c.role === "producer";
      if (filter === "Buyers") return c.role === "buyer";
      return true;
    })
    .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const FilterButton = ({ value }) => (
    <button
      onClick={() => onFilterChange(value)}
      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
        filter === value
          ? "bg-green-600 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {value}
    </button>
  );

  return (
    <aside className="flex flex-col w-full h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-green-800">
          Registered Companies
        </h2>
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <FilterButton value="All" />
          <FilterButton value="Producers" />
          <FilterButton value="Buyers" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredCompanies.map((company) => (
          <div
            key={company._id}
            onClick={() => onSelect(company)}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 border-b border-gray-200/50 ${
              selectedCompany?._id === company._id
                ? "bg-green-50 border-l-4 border-l-green-500"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {company.name}
              </p>
              <p
                className={`text-xs capitalize ${
                  company.role === "producer"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {company.role}
              </p>
            </div>
            {company.flagged && (
              <div className="ml-2 flex-shrink-0">
                <FlagIcon />
              </div>
            )}
          </div>
        ))}
        {filteredCompanies.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No companies found
          </div>
        )}
      </div>
    </aside>
  );
};

const CompanyDetails = ({ company, onFlag, onBack, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }
  if (!company) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a company to view details</p>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full h-full p-4 overflow-y-auto bg-gray-50 md:p-6 lg:p-8">
      <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center md:mb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={onBack}
            className="flex items-center justify-center p-2 text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg md:hidden hover:bg-gray-100 flex-shrink-0"
            aria-label="Back to company list"
          >
            <BackIcon />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 truncate">
              {company.name}
            </h1>
            <p className="text-sm md:text-base text-gray-500 truncate">
              Registered on{" "}
              {company.registered
                ? new Date(company.registered).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        {company.role === "producer" && (
          <button
            onClick={() => onFlag(company._id)}
            disabled={company.flagged}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 active:scale-95 disabled:bg-red-800/50 disabled:cursor-not-allowed disabled:scale-100 w-full md:w-auto"
          >
            <FlagProducerIcon />
            {company.flagged ? "Flagged" : "Flag Producer"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 md:gap-6 md:mb-8">
        <StatCard
          title="Total Production"
          value={company.totalProduction || 0}
          unit="kg"
          icon={<ProductionIcon />}
        />
        <StatCard
          title="Total Purchases"
          value={company.totalPurchases || 0}
          unit="kg"
          icon={<PurchaseIcon />}
        />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-green-800 mb-4">
          Recent Transactions
        </h3>
        {/* Transaction Table/Cards Here */}
      </div>
    </main>
  );
};

// --- Main Dashboard Component ---
const AuditorDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/users`, {
          // Assumes GET /api/users endpoint
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch company list.");

        let data = await res.json();
        data = data.sort((a, b) => a.name.localeCompare(b.name));
        setCompanies(data);

        if (window.innerWidth >= 768 && data.length > 0) {
          handleSelectCompany(data[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [API_BASE_URL]);

  const handleSelectCompany = async (company) => {
    setSelectedCompany({
      ...company,
      transactions: [],
      totalProduction: 0,
      totalPurchases: 0,
    });
    setDetailsLoading(true);

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const entityName = company.name; // Your API uses the name as the parameter

    try {
      const rolePath = company.role.toLowerCase();

      const [summaryRes, transactionsRes] = await Promise.all([
        fetch(
          `${API_BASE_URL}/api/transactions/buyer${rolePath}/${entityName}/summary`,
          { headers }
        ),
        fetch(
          `${API_BASE_URL}/api/transactions/buyer${rolePath}/${entityName}`,
          {
            headers,
          }
        ),
      ]);

      if (!summaryRes.ok || !transactionsRes.ok) {
        throw new Error(`Failed to fetch details for ${entityName}`);
      }

      const summaryData = await summaryRes.json();
      const transactionsData = await transactionsRes.json();

      setSelectedCompany({
        ...company,
        totalProduction:
          summaryData.totalHydrogenSold ||
          summaryData.totalHydrogenPurchased ||
          0,
        totalPurchases: summaryData.totalHydrogenPurchased || 0,
        transactions: transactionsData,
      });
    } catch (err) {
      console.error(err);
      setSelectedCompany(company); // Revert to basic info on error
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleFlagCompany = async (companyId) => {
    // This needs a backend endpoint, e.g., PUT /api/users/:id/flag
    const token = localStorage.getItem("token");
    // Example: await fetch(`${API_BASE_URL}/api/users/${companyId}/flag`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });

    setCompanies((prev) =>
      prev.map((c) => (c._id === companyId ? { ...c, flagged: true } : c))
    );
    if (selectedCompany?._id === companyId) {
      setSelectedCompany((prev) => ({ ...prev, flagged: true }));
    }
  };

  const handleBackToList = () => setSelectedCompany(null);
  const handleFilterChange = (newFilter) => setFilter(newFilter);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex w-full h-screen text-gray-800 bg-white">
      <div
        className={`w-full md:w-1/3 lg:w-1/4 h-full ${
          selectedCompany ? "hidden md:flex" : "flex"
        } flex-col`}
      >
        <CompanyList
          companies={companies}
          onSelect={handleSelectCompany}
          selectedCompany={selectedCompany}
          filter={filter}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div
        className={`w-full h-full md:w-2/3 lg:w-3/4 ${
          selectedCompany ? "block" : "hidden md:block"
        }`}
      >
        <CompanyDetails
          company={selectedCompany}
          onFlag={handleFlagCompany}
          onBack={handleBackToList}
          isLoading={detailsLoading}
        />
      </div>
    </div>
  );
};

export default AuditorDashboard;
