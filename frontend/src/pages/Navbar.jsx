import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, ChevronDown } from "lucide-react"; // Icons

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <nav className="bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold text-indigo-400 hover:text-indigo-500 transition duration-300"
          >
            Blogify
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-indigo-400 transition duration-300 font-medium"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/create"
                className="text-gray-300 hover:text-indigo-400 transition duration-300 font-medium"
              >
                Create Blog
              </Link>
            )}
            {user && (
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-indigo-400 transition duration-300 font-medium"
              >
                My Blogs
              </Link>
            )}

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenu(!profileMenu)}
                  className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition duration-200 shadow-sm"
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=0D8ABC&color=fff`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-200 font-medium">{user.first_name}</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {profileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl animate-fade-in">
                    <Link
                      to="/profile"
                      onClick={() => setProfileMenu(false)}
                      className="block px-4 py-2 text-gray-200 hover:bg-gray-700 transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg shadow transition duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-indigo-400 focus:outline-none transition duration-300"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 shadow-xl border-t border-gray-700 animate-slide-down">
          <div className="flex flex-col px-4 pt-3 pb-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-gray-200 hover:text-indigo-400 transition font-medium"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/create"
                onClick={() => setIsOpen(false)}
                className="text-gray-200 hover:text-indigo-400 transition font-medium"
              >
                Create
              </Link>
            )}
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-200 hover:text-indigo-400 transition font-medium"
              >
                My Blogs
              </Link>
            )}
            {user && (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="text-gray-200 hover:text-indigo-400 transition font-medium"
              >
                Profile
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition duration-300 text-center"
              >
                Login
              </Link>
            )}
            {!user && (
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg shadow transition duration-300 text-center"
              >
                Register
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow transition duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
