import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Leaderboard from "./components/Leaderboard";
import Producer from "./components/producer/Producer";
import ProtectedRoute from "./components/ProctedRoutes";
import PublicRoute from "./components/PublicRoutes";
import RoleRedirect from "./components/RoleRedirect";
import TransactionLog from "./components/producer/TransactionLog";
import { Toaster } from "react-hot-toast";
import ConfirmBuys from "./components/producer/ConfirmBuys";
import CreateSellRequest from "./components/producer/CreateSellRequest";
import SellRequestDetailPage from "./components/buyer/SellRequestDetailPage";
import Marketplace from "./components/buyer/MarketPlace";
import AuditorDashboard from "./components/auditor/AuditorDashboard";
import BuyerTransaction from "./components/buyer/BuyerTransaction";
import BuyersLeaderboard from "./components/buyer/BuyersLeaderboard";
// Example placeholders for dashboards

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected role-based dashboards */}
          <Route
            path="/prod-dashboard"
            element={
              <ProtectedRoute>
                <Producer />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/auditor-dashboard"
            element={
              <ProtectedRoute>
                <AuditorDashboard />
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/regulator-dashboard"
            element={
              <ProtectedRoute>
                <RegulatorDashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* Leaderboard example */}
          <Route path="/leaderboard" element={<Leaderboard />} />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <BuyerTransaction />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirm-buys"
            element={
              <ProtectedRoute>
                <ConfirmBuys />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-sell"
            element={
              <ProtectedRoute>
                <CreateSellRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer-leaderboard"
            element={
              <ProtectedRoute>
                <BuyersLeaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace/:id"
            element={
              <ProtectedRoute>
                <SellRequestDetailPage />
              </ProtectedRoute>
            }
          />

          {/* If user visits `/dashboard`, decide automatically based on role */}
          <Route path="/dashboard" element={<RoleRedirect />} />
        </Routes>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
