import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;
  if (!allowedRoles.includes(currentUser.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default PrivateRoute;