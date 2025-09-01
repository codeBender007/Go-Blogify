import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email_or_phone, setEmailOrPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const forgotPassword = async (data) => {
    try {
      setLoading(true);
      const { data: response } = await api.post("/auth/forgot-password", data);
      setToast({ show: true, type: "success", message: response.message || "OTP sent successfully!" });
      setTimeout(() => {
        navigate(`/reset-password?email_or_phone=${encodeURIComponent(email_or_phone)}`);
      }, 1500);
    } catch (error) {
      setToast({ show: true, type: "error", message: error?.response?.data?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    forgotPassword({ email_or_phone });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-8"
      >
        {/* Toast */}
        {toast.show && (
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 top-4
                        max-w-xs w-[90%] text-center px-5 py-3 rounded-xl shadow-lg
                        font-semibold text-sm text-white animate-toast z-20 ${
                          toast.type === "success" ? "bg-green-500" : "bg-red-500"
                        }`}
          >
            {toast.message}
          </div>
        )}

        {/* Heading */}
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-2">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Enter your email or phone to receive an OTP
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm font-semibold mb-1">Email or Phone</label>
            <input
              type="text"
              placeholder="Enter your email or phone"
              value={email_or_phone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(99,102,241,0.6)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-indigo-400 font-medium hover:underline transition">
            ← Back to login
          </Link>
        </div>
      </motion.div>

      {/* Toast animation */}
      <style>{`
        @keyframes toastSlide {
          0% { transform: translate(-50%, -30px); opacity: 0; }
          15% { transform: translate(-50%, 0); opacity: 1; }
          85% { transform: translate(-50%, 0); opacity: 1; }
          100% { transform: translate(-50%, -30px); opacity: 0; }
        }
        .animate-toast {
          animation: toastSlide 3s ease forwards;
        }
      `}</style>
    </div>
  );
}
