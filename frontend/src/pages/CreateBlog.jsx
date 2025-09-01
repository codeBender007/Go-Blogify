import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import api from "../services/api";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [err, setErr] = useState("");
  const { token } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      await api.post("/blogs", formData, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data",
        },
      });

      nav("/dashboard");
    } catch (e) {
      setErr(e.response?.data?.error || "Error creating");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-3xl bg-gray-800 rounded-3xl p-10 shadow-2xl border border-gray-700"
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-extrabold text-center text-indigo-400 mb-8"
        >
          ✨ Create Your Blog
        </motion.h2>

        {/* Error Box */}
        {err && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-xl shadow-sm text-center font-medium"
          >
            ⚠ {err}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">
              Blog Title
            </label>
            <input
              type="text"
              placeholder="Enter your blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md transition-all duration-300"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">
              Blog Content
            </label>
            <textarea
              rows="6"
              placeholder="Write your blog content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-md transition-all duration-300 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-300 font-semibold mb-2">
              Upload Blog Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full text-gray-200 px-4 py-2 rounded-2xl bg-gray-700 border border-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
            />
          </div>

          {/* Publish Button */}
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(99,102,241,0.6)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
          >
            🚀 Publish Blog
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
