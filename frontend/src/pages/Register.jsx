// src/pages/Register.jsx
// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    try {
      await api.post(
        `/auth/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );
      alert("Registration successful! Please log in.");
      nav("/login");
    } catch (err) {
      alert(err?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="neon-card w-[300px] max-w-[300px] mx-auto px-6 py-8 animate-float">

        {/* Title */}
        <h2 className="text-3xl font-bold text-cyan-300 text-center mb-6 drop-shadow-lg">
          Create Account
        </h2>

        {/* EMAIL */}
        <label className="text-cyan-200 text-sm mb-1 block">Email</label>
        <input
          className="neon-input mb-4"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <label className="text-cyan-200 text-sm mb-1 block">Password</label>
        <input
          type="password"
          className="neon-input mb-6"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTONS */}
        <button
          onClick={create}
          disabled={loading}
          className="neon-button w-full mb-4"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-cyan-300 text-sm">
          Already have an account?{" "}
          <span
            className="text-pink-400 cursor-pointer hover:underline"
            onClick={() => nav("/login")}
          >
            Login here
          </span>
        </p>

      </div>
    </div>
  );
}
