// src/components/Navbar.jsx
// @ts-nocheck
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div className="w-full px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold cursor-pointer" onClick={() => nav("/dashboard")}>
        AI Doc Author
      </div>

      <div className="flex gap-3">
        {token ? (
          <>
            <button onClick={() => nav("/dashboard")} className="text-gray-300 hover:text-white">
              Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                nav("/login");
              }}
              className="btn-neon"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => nav("/login")} className="text-gray-300 hover:text-white">
              Login
            </button>
            <button onClick={() => nav("/register")} className="btn-neon">
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
