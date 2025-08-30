import React, { useRef, useEffect } from "react";
// Assuming StatCard.jsx is in the same folder or path is adjusted
import StatCard from "./StatCard";
import { gsap } from "gsap";

// --- Icons remain the same ---
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
    className="w-5 h-5 mr-2"
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

// The onBack prop is new
const CompanyDetails = ({ company, onFlag, onBack }) => {
  const detailsRef = useRef(null);

  useEffect(() => {
    if (company) {
      gsap.fromTo(
        detailsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [company]);

  if (!company) {
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-500">
        Select a company to view details
      </div>
    );
  }

  return (
    <main ref={detailsRef} className="w-full h-full p-6 overflow-y-auto md:p-8">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          {/* THIS BUTTON IS NEW and only shows on mobile */}
          <button
            onClick={onBack}
            className="p-2 text-white transition-colors bg-gray-700 rounded-full md:hidden hover:bg-gray-600"
          >
            <BackIcon />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">{company.name}</h1>
            <p className="text-gray-400">
              Registered on {company.registered} • {company.contact}
            </p>
          </div>
        </div>
        {company.role === "Producer" && (
          <button
            onClick={() => onFlag(company.id)}
            disabled={company.flagged}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm transition-all duration-300 ease-in-out hover:bg-red-700 hover:scale-105 active:scale-95 disabled:bg-red-800/50 disabled:cursor-not-allowed disabled:scale-100"
          >
            <FlagProducerIcon />
            {company.flagged ? "Flagged" : "Flag Producer"}
          </button>
        )}
      </div>

      {/* Stats and Transactions sections remain the same... */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        {/* ... StatCard logic ... */}
      </div>
      <div>{/* ... Transactions table ... */}</div>
    </main>
  );
};

export default CompanyDetails;
