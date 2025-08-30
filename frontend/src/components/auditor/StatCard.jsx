import React from "react";

const StatCard = ({ title, value, unit, icon }) => {
  return (
    <div className="p-4 bg-gray-700/50 rounded-lg">
      <div className="flex items-center">
        <div className="p-2 mr-4 text-brand-green bg-gray-800 rounded-full">
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-white">
            {value.toLocaleString()}{" "}
            <span className="text-base font-normal text-gray-300">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
