import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function RoleRoute({ role, children }) {
  return (
    <ProtectedRoute>
      <RoleCheck role={role}>{children}</RoleCheck>
    </ProtectedRoute>
  );
}

function RoleCheck({ role, children }) {
  const { role: currentRole } = useAuth();
  if (currentRole !== role) {
    return <Navigate to={currentRole === "admin" ? "/admin/dashboard" : "/merchant/dashboard"} replace />;
  }
  return children;
}
