import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [data, setData] = useState({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    likes: {},
    likedByUser: {},
  });
  const [sp, setSp] = useSearchParams();
  const page = Number(sp.get("page") || 1);
  const { user } = useAuth();

  useEffect(() => {
    api.get(`/blogs?page=${page}&limit=6`).then((res) => setData(res.data));
  }, [page]);

  const totalPages = Math.ceil(data.total / data.limit) || 1;
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-center text-white mb-12"
      >
         Increase your Knowledge From Blogs
      </motion.h2>

      {/* Blog List */}
      <motion.div
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {data.data.map((b) => {
          const isLiked =
            loggedInUser && data.likedByUser[b.id]?.includes(loggedInUser.id);

          return (
            <motion.article
              key={b.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Blog Image */}
              {b.image_url && (
                <div className="relative group rounded-2xl overflow-hidden">
                  <img
                    src={b.image_url}
                    alt={b.title}
                    className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105 rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 rounded-2xl" />
                </div>
              )}

              {/* Blog Details */}
              <div className="mt-5">
                <h3 className="text-2xl md:text-3xl font-bold text-white hover:text-indigo-400 transition-colors duration-300">
                  {b.title}
                </h3>

                <p className="text-sm text-gray-400 mt-2 mb-4">
                  By{" "}
                  <span className="font-medium text-gray-200">
                    <Link to={`/user/${b.author.id}`}>
                      {b.author?.first_name} {b.author?.last_name}
                    </Link>
                  </span>{" "}
                  •{" "}
                  <span className="text-gray-400">
                    {b.created_at &&
                      new Date(b.created_at).toLocaleDateString()}
                  </span>
                </p>

                <p className="text-gray-300 leading-relaxed text-base mb-5 line-clamp-3">
                  {b.content.slice(0, 200)}
                  {b.content.length > 200 ? "..." : ""}
                </p>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm border transition-all duration-300 ${
                      b?.liked_by?.includes(user?.id)
                        ? "bg-red-500 text-white border-red-500 shadow-red-700"
                        : "bg-gray-700 text-red-500 border-red-500"
                    }`}
                  >
                    ❤ {data.likes[b.id] || 0}
                  </span>

                  <Link
                    to={`/blogs/${b.id}`}
                    className="relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-500/30 transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/50"
                  >
                    <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"></span>
                    <span className="relative tracking-wide text-sm text-white">
                      Read More →
                    </span>
                  </Link>
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-5xl mx-auto flex justify-center items-center gap-5 mt-12">
          <motion.button
            disabled={page <= 1}
            onClick={() => setSp({ page: String(page - 1) })}
            whileHover={page > 1 ? { scale: 1.05, y: -1 } : {}}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className={`px-6 py-2 rounded-xl font-semibold text-white shadow-md transition-all ${
              page <= 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-400/40"
            }`}
          >
            ← Prev
          </motion.button>

          <span className="px-5 py-2 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 font-semibold shadow-sm">
            Page {page} / {totalPages}
          </span>

          <motion.button
            disabled={page >= totalPages}
            onClick={() => setSp({ page: String(page + 1) })}
            whileHover={page < totalPages ? { scale: 1.05, y: -1 } : {}}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className={`px-6 py-2 rounded-xl font-semibold text-white shadow-md transition-all ${
              page >= totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-400/40"
            }`}
          >
            Next →
          </motion.button>
        </div>
      )}
    </div>
  );
}
