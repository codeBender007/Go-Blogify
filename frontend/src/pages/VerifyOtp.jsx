import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";

export default function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(location.search);
  const initial = useMemo(() => params.get("email_or_phone") || "", [location.search]);
  const [form, setForm] = useState({ email_or_phone: initial, otp: "" });

  useEffect(() => {
    document.title = "Verify OTP • OTP Auth";
  }, []);

  const verifyOtp = async (form) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/verify-otp", form);
      alert(data.message);
      navigate("/login");
      setLoading(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to verify OTP");
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    verifyOtp(form);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-8"
      >
        {/* Heading */}
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-2">
          Verify OTP
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Enter the 6-digit code sent to your email or phone
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
              placeholder="123456"
              maxLength={6}
              value={form.otp}
              onChange={(e) => setForm({ ...form, otp: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.6)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify"}
          </motion.button>
        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-indigo-400 font-medium hover:underline"
          >
            ← Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
