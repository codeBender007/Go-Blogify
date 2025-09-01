import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get(`/auth/user/${id}`);
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh] bg-gray-900">
        <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] bg-gray-900 text-white">
        <p className="text-xl mb-4">User not found 😕</p>
        <Link
          to="/"
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-all"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden"
      >
        {/* Header / Avatar */}
        <div className="bg-indigo-600 h-32 flex items-center justify-center relative">
          <div className="absolute -bottom-16 w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden shadow-lg">
            <img
              src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=0D8ABC&color=fff&size=128`}
              alt={user.first_name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="pt-20 pb-8 px-6 text-center text-white">
          <h2 className="text-2xl font-bold">{user.first_name} {user.last_name}</h2>
          <p className="text-gray-300 italic mt-2">{user.bio || "No bio available"}</p>

          <div className="mt-6 text-left space-y-3">
            <p><span className="font-semibold">📧 Email:</span> {user.email}</p>
            <p><span className="font-semibold">📱 Phone:</span> {user.phone || "N/A"}</p>
            <p><span className="font-semibold">🆔 ID:</span> {user.id}</p>
            <p><span className="font-semibold">✅ Verified:</span> {user.is_otp_verified ? "Yes" : "No"}</p>
            <p><span className="font-semibold">📅 Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>

          {/* Back Button */}
          <Link
            to="/"
            className="mt-6 inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow transition-all"
          >
            🔙 Back
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetail;
