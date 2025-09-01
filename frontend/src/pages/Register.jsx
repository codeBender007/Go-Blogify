import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api'
import { motion } from 'framer-motion'

export default function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: ''
  })

  const [err, setErr] = useState('')
  const nav = useNavigate()
  const onChange = (k, v) => setForm(s => ({ ...s, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const res = await api.post('/auth/register', form)
      nav(`/verify-otp?email_or_phone=${encodeURIComponent(form.email || form.phone)}`)
    } catch (e) {
      setErr(e.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-[80vh] flex justify-center items-center bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700"
      >
        {/* Heading */}
        <h2 className="text-4xl font-extrabold text-center text-indigo-400 mb-2">
          Create Account
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Sign up to get started with your account
        </p>

        {/* Error Message */}
        {err && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 bg-red-900/20 border border-red-700 text-red-300 rounded-xl text-sm text-center shadow"
          >
            ⚠ {err}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {/* First Name */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1 font-medium">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              value={form.first_name}
              onChange={e => onChange('first_name', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1 font-medium">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              value={form.last_name}
              onChange={e => onChange('last_name', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={e => onChange('email', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={e => onChange('phone', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-gray-300 text-sm mb-1 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => onChange('password', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.6)' }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-3 rounded-2xl shadow-lg font-semibold text-lg transition"
          >
            🚀 Register
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
