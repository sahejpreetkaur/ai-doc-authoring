// src/components/Sidebar.jsx
// @ts-nocheck
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  const LinkItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition
         ${isActive ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/10 ring-1 ring-neon-blue/30" : "hover:bg-white/3"}`
      }
    >
      <span className="w-6 h-6 flex items-center justify-center text-neon-blue">{icon}</span>
      <span className="text-sm text-gray-200">{label}</span>
    </NavLink>
  );

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-72 p-6 flex flex-col gap-6 bg-gradient-to-b from-[#06060a] to-[#04040a] border-r border-white/6 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => nav("/dashboard")}>
        <img src="/mnt/data/e41cb1b8-3711-428c-9faf-f538d03dcb13.png" alt="logo" className="w-12 h-12 rounded-lg object-cover border border-white/6 shadow-neon-blue" />
        <div>
          <div className="text-lg font-extrabold text-white">AI Doc Author</div>
          <div className="text-xs text-gray-400">Generate • Refine • Export</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <LinkItem to="/dashboard" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor"/></svg>
        } label="Dashboard" />

        <LinkItem to="/project/new" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        } label="Create Project" />

        <LinkItem to="/project/1" icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>
        } label="My Projects" />

        <div className="mt-6 px-2">
          <div className="text-xs text-gray-400 uppercase mb-2">Quick</div>
          <button onClick={() => nav("/dashboard")} className="w-full text-left px-3 py-2 rounded-md bg-white/2 text-white/90 mb-2">+ New Project</button>
          <button onClick={() => alert("Templates coming")} className="w-full text-left px-3 py-2 rounded-md bg-white/2 text-white/90">AI Templates</button>
        </div>
      </nav>

      {/* Footer / Auth */}
      <div className="mt-auto">
        {token ? (
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm text-gray-200">Signed in</div>
              <div className="text-xs text-gray-400">You (Owner)</div>
            </div>
            <button onClick={logout} className="px-3 py-2 rounded bg-gradient-to-r from-neon-blue to-neon-purple text-black font-semibold">Logout</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => nav("/login")} className="px-3 py-2 rounded bg-white/5 text-white">Login</button>
            <button onClick={() => nav("/register")} className="px-3 py-2 rounded bg-neon-blue text-black font-semibold">Register</button>
          </div>
        )}
      </div>
    </aside>
  );
}
