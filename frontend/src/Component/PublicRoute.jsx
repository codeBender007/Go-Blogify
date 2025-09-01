import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function PublicRoute({ children }) {
  const { user } = useAuth();

  // Agar user already login hai toh home page par bhej do
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
