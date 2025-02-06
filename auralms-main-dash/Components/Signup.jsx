"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear previous errors when typing
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state

    try {
      const response = await fetch("http://localhost:5000/users"); // Fetch users from db.json
      const users = await response.json();

      const foundUser = users.find(
        (u) => u.username === formData.username && u.password === formData.password
      );

      if (foundUser) {
        router.push("/dashboard"); // Redirect to dashboard if credentials are correct
      } else {
        setError("Invalid username or password"); // Show error message
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error connecting to server");
    }

    setLoading(false); // Hide loading state after request
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Welcome Back</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full text-white px-4 py-3 rounded-lg font-semibold text-lg transition duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>
        <p className="mt-4 text-gray-500 text-sm">
          Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </motion.div>
    </div>
  );
}
