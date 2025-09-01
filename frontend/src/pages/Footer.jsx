import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white mt-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 py-8"
      >
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          {/* Developer Info */}
          <div>
            <h1 className="text-2xl font-bold">Mobiloitte</h1>
            <p className="mt-2 text-gray-200">
              Building next-gen solutions with innovation 🚀
            </p>
          </div>

          {/* Developer Details */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold">Developed By</h2>
            <p className="mt-1 text-gray-200">Dinesh Pal Singh</p>
            <p className="text-gray-300 text-sm">Frontend Developer</p>
          </div>

          {/* Manager Info */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold">Project Manager</h2>
            <p className="mt-1 text-gray-200">Raj Sir</p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <FaLinkedin size={22} />
            </motion.a>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <FaGithub size={22} />
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2 }}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <FaTwitter size={22} />
            </motion.a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 my-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-200">
          <p>
            © {new Date().getFullYear()} <span className="font-semibold">Mobiloitte</span>. All Rights Reserved.
          </p>
          <p className="mt-3 md:mt-0">
            Developed with ❤️ by{" "}
            <span className="font-semibold text-white">Dinesh Pal Singh</span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
