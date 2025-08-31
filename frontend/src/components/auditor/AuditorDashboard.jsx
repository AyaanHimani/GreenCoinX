import React, { useState, useEffect, useRef } from "react";

// Mock data (unchanged)
const mockCompanies = [
  {
    id: 1,
    name: "GreenTech Industries",
    role: "Producer",
    registered: "2023-01-15",
    contact: "contact@greentech.com",
    flagged: false,
    totalProduction: 15420,
    totalPurchases: 8930,
    transactions: [
      {
        id: 1,
        date: "2024-08-28",
        type: "Production",
        amount: 500,
        unit: "kg",
      },
      { id: 2, date: "2024-08-27", type: "Sale", amount: 300, unit: "kg" },
      {
        id: 3,
        date: "2024-08-26",
        type: "Production",
        amount: 750,
        unit: "kg",
      },
    ],
  },
  {
    id: 2,
    name: "EcoRetail Corp",
    role: "Buyer",
    registered: "2023-03-22",
    contact: "orders@ecoretail.com",
    flagged: false,
    totalProduction: 0,
    totalPurchases: 12450,
    transactions: [
      { id: 4, date: "2024-08-28", type: "Purchase", amount: 300, unit: "kg" },
      { id: 5, date: "2024-08-26", type: "Purchase", amount: 450, unit: "kg" },
    ],
  },
  {
    id: 3,
    name: "Sustainable Solutions",
    role: "Producer",
    registered: "2022-11-08",
    contact: "info@sustainable.com",
    flagged: true,
    totalProduction: 22100,
    totalPurchases: 5600,
    transactions: [
      {
        id: 6,
        date: "2024-08-29",
        type: "Production",
        amount: 1200,
        unit: "kg",
      },
      { id: 7, date: "2024-08-28", type: "Sale", amount: 800, unit: "kg" },
    ],
  },
  {
    id: 4,
    name: "Clean Energy Co",
    role: "Producer",
    registered: "2023-07-10",
    contact: "hello@cleanenergy.com",
    flagged: false,
    totalProduction: 18750,
    totalPurchases: 3200,
    transactions: [
      {
        id: 8,
        date: "2024-08-29",
        type: "Production",
        amount: 600,
        unit: "kg",
      },
      {
        id: 9,
        date: "2024-08-27",
        type: "Production",
        amount: 900,
        unit: "kg",
      },
    ],
  },
].sort((a, b) => a.name.localeCompare(b.name)); // Pre-sorted A-Z

// Icons (LogoutIcon added)
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

// New Logout Icon
const LogoutIcon = () => (
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
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

// StatCard Component (unchanged)
const StatCard = ({ title, value, unit, icon }) => {
  return (
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
};

// CompanyList Component (Updated with Logout Button)
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
      if (filter === "Producers") return c.role === "Producer";
      if (filter === "Buyers") return c.role === "Buyer";
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

  const handleLogout = () => {
    // Clear stored auth details
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");

    // Reload the page
    window.location.reload();
  };

  return (
    <aside className="flex flex-col w-full h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-green-800">
            Registered Companies
          </h2>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
        <div className="relative">
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
            key={company.id}
            onClick={() => onSelect(company)}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 border-b border-gray-200/50 ${
              selectedCompany?.id === company.id
                ? "bg-green-50 border-l-4 border-l-green-500"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">
                {company.name}
              </p>
              <p
                className={`text-xs ${
                  company.role === "Producer"
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

// CompanyDetails Component (unchanged)
const CompanyDetails = ({ company, onFlag, onBack }) => {
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
              Registered on {company.registered} • {company.contact}
            </p>
          </div>
        </div>
        {company.role === "Producer" && (
          <button
            onClick={() => onFlag(company.id)}
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
          value={company.totalProduction}
          unit="kg"
          icon={<ProductionIcon />}
        />
        <StatCard
          title="Total Purchases"
          value={company.totalPurchases}
          unit="kg"
          icon={<PurchaseIcon />}
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-green-800 mb-4">
          Recent Transactions
        </h3>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                  Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {company.transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-200/50 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 text-gray-700">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === "Production"
                          ? "bg-green-100 text-green-700"
                          : transaction.type === "Purchase"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {transaction.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {transaction.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3">
          {company.transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === "Production"
                      ? "bg-green-100 text-green-700"
                      : transaction.type === "Purchase"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {transaction.type}
                </span>
                <span className="text-sm text-gray-500">
                  {transaction.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {transaction.amount.toLocaleString()}
                </span>
                <span className="text-gray-600">{transaction.unit}</span>
              </div>
            </div>
          ))}
        </div>
        {company.transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </main>
  );
};

// Main Dashboard Component (unchanged)
const AuditorDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const sortedCompanies = mockCompanies.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setCompanies(sortedCompanies);
    if (window.innerWidth >= 768 && sortedCompanies.length > 0) {
      setSelectedCompany(sortedCompanies[0]);
    }
  }, []);

  const handleSelectCompany = (company) => setSelectedCompany(company);

  const handleFlagCompany = (companyId) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, flagged: true } : c))
    );
    if (selectedCompany?.id === companyId) {
      setSelectedCompany((prev) => ({ ...prev, flagged: true }));
    }
  };

  const handleBackToList = () => setSelectedCompany(null);
  const handleFilterChange = (newFilter) => setFilter(newFilter);

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
        />
      </div>
    </div>
  );
};

export default AuditorDashboard;
