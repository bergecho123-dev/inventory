import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await register(name, email, password);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-800 to-green-700 flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl w-full max-w-5xl">
        {/* Left side (Logo and description) */}
        <div className="bg-[#1E40AF] flex flex-col justify-center items-center text-white p-10 md:w-1/2">
          <img src="/amesob-logo.png" alt="A MESOB" className="h-32 w-32 mb-6" />
          <h1 className="text-3xl font-bold mb-2">A-MESOB</h1>
          <p className="text-center text-sm md:text-base">
            Modern Ethiopia Service for Organized Benefit
          </p>
        </div>

        {/* Right side (Register form) */}
        <div className="bg-[#0F172A] text-white flex flex-col justify-center p-10 md:w-1/2">
          <h2 className="text-center text-xl font-semibold mb-1">Create Account</h2>
          <h3 className="text-center text-lg text-gray-300 mb-6">Inventory Management System</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">{success}</div>}

            {/* Name */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Full Name *</label>
              <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Email *</label>
              <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Password *</label>
              <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-2 text-gray-300">Confirm Password *</label>
              <div className="flex items-center border border-gray-600 rounded-lg px-3 py-2 focus-within:border-blue-500">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full bg-transparent outline-none text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-center text-gray-400 text-sm mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-blue-400 hover:underline">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
