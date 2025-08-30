import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  switch (role) {
    case "producer":
      return <Navigate to="/prod-dashboard" replace />;
    case "buyer":
      return <Navigate to="/marketplace" replace />;
    case "auditor":
      return <Navigate to="/auditor-dashboard" replace />;
    case "regulator":
      return <Navigate to="/regulator-dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RoleRedirect;
