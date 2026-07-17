import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, roles = [] }) {
  const user = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.accessToken);

  if (!token) return <Navigate to="/login" replace />;
  if (roles.length && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
