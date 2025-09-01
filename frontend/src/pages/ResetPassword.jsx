import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function ResetPassword() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initial = useMemo(() => params.get("email_or_phone") || "", [location.search]);

  const [form, setForm] = useState({
    email_or_phone: initial,
    otp: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Reset Password • OTP Auth";
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3000);
  };

  const resetPassword = async (form) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/reset-password", form);
      showToast("success", data.message || "Password reset successfully!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      showToast("error", error?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(form);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.message && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-5 z-50 left-1/2 transform -translate-x-1/2 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white font-medium text-base ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {toast.type === "success" ? <FiCheckCircle size={22} /> : <FiXCircle size={22} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-2">
          Reset Password 🔑
        </h2>
        <p className="text-gray-300 text-center text-sm mb-6">
          Enter your details to set a new password
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Email or Phone */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm font-semibold mb-1">Email or Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone"
              value={form.email_or_phone}
              onChange={(e) => setForm({ ...form, email_or_phone: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* OTP */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm font-semibold mb-1">OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm font-semibold mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(99,102,241,0.6)" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-2xl shadow-lg font-semibold text-lg transition disabled:opacity-60"
          >
            <FiRefreshCw size={22} className={loading ? "animate-spin" : ""} />
            {loading ? "Updating..." : "Update Password"}
          </motion.button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link to="/login" className="text-indigo-400 font-medium hover:underline">
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
