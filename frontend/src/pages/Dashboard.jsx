// src/pages/Dashboard.jsx
// @ts-nocheck
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const nav = useNavigate();

  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState("");
  const [sortType, setSortType] = useState("latest");

  const load = async () => {
    try {
      const res = await api.get("/projects/");
      setProjects(res.data);
    } catch (err) {
      alert("Failed to load projects");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = projects
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortType === "az") return a.name.localeCompare(b.name);
      if (sortType === "za") return b.name.localeCompare(a.name);
      if (sortType === "latest") return b.id - a.id;
      if (sortType === "oldest") return a.id - b.id;
      return 0;
    });

  return (
    <div className="page">

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide bg-gradient-to-r 
            from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">
          Your Projects
        </h1>

        <button
          onClick={() => nav("/create-project")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500
                     shadow-[0_0_20px_rgba(255,0,255,0.35)]
                     hover:shadow-[0_0_30px_rgba(255,0,255,0.6)]
                     font-semibold transition active:scale-95"
        >
          + New Project
        </button>
      </div>

      {/* ---------- SEARCH + SORT ---------- */}
      <div className="flex items-center gap-4 mb-8">

        {/* Search bar */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="w-72 px-4 py-2 rounded-xl bg-black/40 border border-white/10 
                     text-gray-200 focus:outline-none focus:border-cyan-300"
        />

        {/* Sort dropdown */}
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-gray-200"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="az">Name A–Z</option>
          <option value="za">Name Z–A</option>
        </select>
      </div>

      {/* ---------- PROJECT GRID ---------- */}
      {filtered.length === 0 ? (
        <div className="text-gray-400 text-center py-20">
          No projects found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => nav(`/project/${p.id}`)}
              className="card-glass p-6 rounded-2xl cursor-pointer
                         border border-white/10
                         hover:shadow-[0_0_40px_rgba(0,200,255,0.25)]
                         transition-all duration-300"
            >
              {/* Title */}
              <h2 className="text-2xl font-bold text-cyan-300 drop-shadow-[0_0_6px_#00eaff]">
                {p.name}
              </h2>

              {/* Topic */}
              <p className="text-gray-400 mt-1 line-clamp-2">
                {p.main_topic}
              </p>

              {/* DOCX / PPTX Tag */}
              <div className="mt-4 inline-block px-3 py-1 rounded-full text-sm 
                            bg-white/10 border border-white/10 text-gray-300">
                {p.doc_type.toUpperCase()}
              </div>

              {/* Last updated */}
              <p className="text-xs text-gray-500 mt-3">
                Last updated: just now
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
