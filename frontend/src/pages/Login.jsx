import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";
import { motion } from "framer-motion";
import { FiLogIn } from "react-icons/fi";

export default function Login() {
  const [email_or_phone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await api.post("/auth/login", { email_or_phone, password });
      login(res.data.token, res.data.user);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700"
      >
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-indigo-400">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mt-2 text-base font-medium">
          Login to your account to continue
        </p>

        {/* Error Message */}
        {err && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 p-3 bg-red-900/20 border border-red-700 text-red-300 rounded-xl text-sm text-center shadow"
          >
            ⚠ {err}
          </motion.div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={submit}>
          {/* Email or Phone */}
          <div>
            <input
              type="text"
              placeholder="Enter your email or phone"
              className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 outline-none border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition text-base shadow-sm"
              value={email_or_phone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 outline-none border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition text-base shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.6)" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-2xl shadow-lg transition font-semibold text-lg"
          >
            <FiLogIn size={22} />
            Login
          </motion.button>
        </form>

        {/* Bottom Links */}
        <div className="text-center mt-6 flex justify-between px-5">
          <p className="text-gray-400 text-sm">
            <span
              onClick={() => nav("/register")}
              className="text-indigo-400 cursor-pointer hover:underline font-semibold"
            >
              Register here
            </span>
          </p>
          <p className="text-gray-400 text-sm">
            <span
              onClick={() => nav("/forgot-password")}
              className="text-indigo-400 cursor-pointer hover:underline font-semibold"
            >
              Forgot Password?
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
