import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trophy,
  LayoutDashboard,
  LogOut,
  Leaf,
} from "lucide-react";

const BuyerSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navLinks = [
    { name: "Marketplace", icon: ShoppingCart, path: "/marketplace" },
    { name: "My Transactions", icon: LayoutDashboard, path: "/transactions" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200 flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">GreenCoinX</h1>
          <p className="text-xs text-gray-500">Buyer Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default BuyerSidebar;
