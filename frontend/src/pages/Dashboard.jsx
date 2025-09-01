import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api.get("/blogs?limit=1000").then((res) => {
      setBlogs(res.data.data.filter((b) => b.author_id === user?.id));
    });
  }, [user]);

  return (
    <div className="min-h-screen mt-16 bg-gray-900 px-4 py-10">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center text-indigo-400 mb-12"
      >
        Own Blogs
      </motion.h2>

      {/* If no blogs */}
      {blogs.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-gray-400 text-center text-lg"
        >
          You haven't written any blogs yet.
        </motion.p>
      ) : (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((b, index) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-700 transition-all duration-300"
            >
              {/* Blog Image */}
              {b.image_url && (
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={b.image_url}
                    alt={b.title}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              )}

              {/* Blog Content */}
              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-indigo-300 mb-2 hover:text-indigo-400 transition-colors duration-300">
                  {b.title}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                  {b.content.length > 200
                    ? b.content.slice(0, 200) + "..."
                    : b.content}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    to={`/blogs/${b.id}`}
                    className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-center shadow-md transition-all duration-300"
                  >
                    🔍 Open
                  </Link>

                  <Link
                    to={`/edit/${b.id}`}
                    className="flex-1 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium text-center shadow-md transition-all duration-300"
                  >
                    ✏️ Edit
                  </Link>
                </div>

                {/* Metadata */}
                <div className="mt-4 text-xs text-gray-400 flex justify-between">
                  <span>Created: {new Date(b.created_at).toLocaleDateString()}</span>
                  <span>{b.likes?.length || 0} Likes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
