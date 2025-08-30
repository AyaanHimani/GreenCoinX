import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// Icons can be simple SVGs
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

const CompanyList = ({ companies, onSelect, selectedCompany }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    // Animate list items on initial load
    gsap.from(listRef.current.children, {
      duration: 0.5,
      opacity: 0,
      x: -30,
      stagger: 0.05,
      ease: "power3.out",
    });
  }, []);

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="flex flex-col w-full h-screen bg-gray-800 border-r border-gray-700 md:w-1/3 lg:w-1/4">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Registered Companies</h2>
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Search companies..."
            className="w-full py-2 pl-10 pr-4 text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
        </div>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            onClick={() => onSelect(company)}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 ${
              selectedCompany?.id === company.id
                ? "bg-brand-green/20"
                : "hover:bg-gray-700/50"
            }`}
          >
            <div>
              <p className="font-semibold text-white">{company.name}</p>
              <p
                className={`text-xs ${
                  company.role === "Producer"
                    ? "text-green-400"
                    : "text-blue-400"
                }`}
              >
                {company.role}
              </p>
            </div>
            {company.flagged && <FlagIcon />}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CompanyList;
