// src/pages/Profile.jsx
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

function Initials({ first = "", last = "" }) {
  const ini =
    (first?.[0] || "").toUpperCase() + (last?.[0] || "").toUpperCase();
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-semibold shadow-md">
      {ini || "U"}
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="pt-24 px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 text-center shadow-sm">
          <p className="text-gray-400">
            Please login first to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-3xl"
      >
        {/* Top banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-700 p-1 shadow-lg">
          <div className="rounded-[22px] bg-gray-800/90 backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col gap-5 border-b border-gray-700 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="avatar"
                    className="h-20 w-20 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <Initials first={user.first_name} last={user.last_name} />
                )}

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="rounded-xl border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                  onClick={() => (window.location.href = "/")}
                >
                  Go Home
                </button>
                {/* <button
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
                  onClick={() => (window.location.href = "/settings")}
                >
                  Edit Profile
                </button> */}
              </div>
            </div>

            {/* Body */}
            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-700 bg-gray-800 p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Account
                </h3>
                <dl className="space-y-2 text-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-gray-400">Name</dt>
                    <dd className="font-medium">
                      {user.first_name} {user.last_name}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-gray-400">Email</dt>
                    <dd className="font-medium break-all">{user.email}</dd>
                  </div>
                  {user.phone && (
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-gray-400">Phone</dt>
                      <dd className="font-medium">{user.phone}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Footer badges */}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-700 p-4">
              <span className="rounded-full bg-indigo-600/30 px-3 py-1 text-xs font-medium text-indigo-200">
                Member
              </span>
              <span className="rounded-full bg-gray-700/30 px-3 py-1 text-xs font-medium text-gray-200">
                Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
