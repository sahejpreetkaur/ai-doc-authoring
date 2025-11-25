// src/pages/HistoryPage.jsx
// @ts-nocheck

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function HistoryPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}/history`);
      setHistory(res.data || []);
    } catch (err) {
      alert("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const neonBadge = (action) => {
    return action === "generate"
      ? "bg-cyan-500/30 text-cyan-300 border-cyan-400/40"
      : "bg-fuchsia-500/30 text-fuchsia-300 border-fuchsia-400/40";
  };

  return (
    <div className="page">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide 
          bg-gradient-to-r from-cyan-300 to-fuchsia-400 text-transparent bg-clip-text">
          Version History
        </h1>

        <button
          onClick={() => nav(`/project/${id}`)}
          className="px-6 py-3 rounded-xl bg-gray-700/60 text-gray-200 
            hover:bg-gray-600/60 transition active:scale-95"
        >
          Back to Project
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-400">Loading…</div>
      ) : (
        <div className="space-y-10">
          {history.length === 0 ? (
            <div className="text-gray-500">No history yet.</div>
          ) : (
            history.map((sec) => (
              <div key={sec.section_id} className="card-glass p-8 rounded-2xl">

                {/* Section Title */}
                <h2 className="text-2xl font-bold text-cyan-300 mb-6 
                  drop-shadow-[0_0_10px_#00eaff]">
                  {sec.title}
                </h2>

                {/* Timeline */}
                <div className="relative ml-6">

                  {/* Vertical line */}
                  <div className="absolute left-0 top-0 w-1 h-full 
                    bg-gradient-to-b from-cyan-400/60 to-fuchsia-500/60 
                    rounded-full shadow-[0_0_15px_rgba(0,200,255,0.4)]" />

                  {/* Timeline Items */}
                  {sec.history
                    .slice()
                    .reverse()
                    .map((h, idx) => (
                      <div
                        key={idx}
                        className="relative pl-10 mb-8"
                      >
                        {/* Glowing dot */}
                        <div
                          className="absolute left-[-6px] top-2 w-4 h-4 
                          rounded-full bg-cyan-300 
                          shadow-[0_0_15px_#00eaff]"
                        ></div>

                        <div
                          className="
                          bg-black/40 border border-white/10 rounded-xl p-5
                          shadow-[0_0_20px_rgba(0,200,255,0.15)]
                          hover:shadow-[0_0_25px_rgba(200,0,255,0.25)]
                          transition-all
                          "
                        >
                          {/* Action Badge */}
                          <span
                            className={`text-xs px-3 py-1 rounded-lg border ${neonBadge(
                              h.action
                            )}`}
                          >
                            {h.action.toUpperCase()}
                          </span>

                          {/* Timestamp */}
                          <p className="text-xs text-gray-400 mt-1 mb-3">
                            {new Date(h.timestamp * 1000).toLocaleString()}
                          </p>

                          {/* Prompt */}
                          <p className="text-sm text-purple-300 mb-2">
                            <b>Prompt:</b> {h.prompt}
                          </p>

                          {/* OLD TEXT */}
                          <p className="text-gray-400 text-sm whitespace-pre-wrap border-l-2 border-red-400/40 pl-3 mb-3">
                            <b>Old:</b> {h.old || "—"}
                          </p>

                          {/* NEW TEXT */}
                          <p className="text-gray-200 whitespace-pre-wrap border-l-2 border-green-400/40 pl-3">
                            <b>New:</b> {h.new}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
