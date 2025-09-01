import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Agar user login nahi hai toh login page par bhej do
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
