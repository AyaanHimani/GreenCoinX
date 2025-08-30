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
// Example placeholders for dashboards
const BuyerDashboard = () => <h1>Buyer Dashboard</h1>;
const AuditorDashboard = () => <h1>Auditor Dashboard</h1>;
const RegulatorDashboard = () => <h1>Regulator Dashboard</h1>;

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
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auditor-dashboard"
            element={
              <ProtectedRoute>
                <AuditorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/regulator-dashboard"
            element={
              <ProtectedRoute>
                <RegulatorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard example */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transaction"
            element={
              <ProtectedRoute>
                <TransactionLog />
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

          {/* If user visits `/dashboard`, decide automatically based on role */}
          <Route path="/dashboard" element={<RoleRedirect />} />
        </Routes>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
