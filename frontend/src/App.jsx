import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import EditBlog from "./pages/EditBlog.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./pages/Navbar.jsx";

import { useAuth } from "./context/AuthContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import PublicRoute from "./Component/PublicRoute.jsx";
import ProtectedRoute from "./Component/ProtectedRoute.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import UserDetail from "./pages/UserDetail.jsx";

export default function App() {
  const { user } = useAuth();
  const nav = useNavigate();

  return (
    <AuthProvider>
      <div className="bg-gray-900 text-gray-200 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="verify-otp"
              element={
                <PublicRoute>
                  <VerifyOtp />
                </PublicRoute>
              }
            />
            <Route
              path="forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Protected Pages */}
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <ProtectedRoute>
                  <BlogDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/:id"
              element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <div className="footer-space"></div>
      </div>
    </AuthProvider>
  );
}
