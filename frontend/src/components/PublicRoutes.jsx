import RoleRedirect from "./RoleRedirect";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    return <RoleRedirect />;
  }
  return children;
};

export default PublicRoute;
