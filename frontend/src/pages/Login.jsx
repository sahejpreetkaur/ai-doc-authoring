// src/pages/Login.jsx
// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);

      nav("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0018] relative overflow-hidden text-white">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('https://i.ibb.co/7kG7jv0/grid.png')] opacity-20"></div>

      {/* Neon circles */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-fuchsia-600/20 blur-[180px]"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[160px] right-0 bottom-0"></div>

      {/* CARD */}
      <div className="relative w-[400px] overflow-hidden p-12 rounded-3xl bg-black/40 backdrop-blur-2xl border border-purple-500/40 shadow-[0_0_45px_rgba(200,0,255,0.5)]">
        <h2 className="text-center text-3xl mb-8 font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400 drop-shadow-[0_0_12px_#00eaff]">
          Welcome Back
        </h2>

        {/* Email */}
        <label className="text-sm text-cyan-300 tracking-wide">Email</label>
        <input
          className="w-full mt-2 mb-6 px-4 py-3 text-lg rounded-xl bg-black/50 border border-cyan-400/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40 outline-none text-cyan-100 placeholder-cyan-300/30 shadow-[0_0_15px_rgba(0,255,255,0.25)] text-base"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {/* Password */}
        <label className="text-sm text-cyan-300 tracking-wide">Password</label>
        <input
          type="password"
          className="w-full mt-2 px-6 py-4 text-lg rounded-xl bg-black/50 border border-cyan-400/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40 outline-none text-cyan-100 placeholder-cyan-300/30 shadow-[0_0_15px_rgba(0,255,255,0.25)] text-base"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
        />

        {/* Button */}
        <button
          onClick={loginUser}
          className="w-full mt-8 py-3.5 rounded-xl font-semibold tracking-wider bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 shadow-[0_0_25px_rgba(255,0,255,0.6)] hover:shadow-[0_0_40px_rgba(255,0,255,0.9)] transition active:scale-95 text-lg"
        >
          Login
        </button>

        {/* Link */}
        <p className="text-center mt-8 text-sm text-cyan-200/80">
          New here? {" "}
          <span
            className="text-fuchsia-400 cursor-pointer hover:underline drop-shadow-[0_0_6px_#ff00ea]"
            onClick={() => nav("/register")}
          >
            Create account
          </span>
        </p>
      </div>
    </div>
  );
}
