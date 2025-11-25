// src/pages/CreateProjectPage.jsx
// @ts-nocheck
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateProjectPage() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [docType, setDocType] = useState("docx");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const create = async () => {
  if (!name || !topic) return alert("Enter all fields");

  setLoading(true);
  try {
    await api.post("/projects/", {
      name,
      main_topic: topic,
      doc_type: docType
    });

    nav("/dashboard");
  } catch (err) {
    console.error("CREATE ERROR:", err.response?.data || err);
    alert("Failed to create project");
  }
  setLoading(false);
};


  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="card-glass w-full max-w-md p-8 rounded-2xl shadow-[0_0_40px_rgba(0,200,255,0.3)]">

        <h1 className="text-3xl font-bold text-center mb-4">New Project</h1>
        <p className="text-gray-400 text-center mb-6">
          Provide details to start generating your AI-powered document.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Project Name</label>
            <input
              className="w-full mt-1 p-3 rounded bg-black/40 border border-cyan-400/20 focus:outline-none focus:border-cyan-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Main Topic</label>
            <input
              className="w-full mt-1 p-3 rounded bg-black/40 border border-cyan-400/20 focus:outline-none focus:border-cyan-400"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Document Type</label>
            <select
              className="w-full mt-1 p-3 rounded bg-black/40 border border-cyan-400/20 focus:outline-none focus:border-cyan-400"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="docx">Word (.docx)</option>
              <option value="pptx">PowerPoint (.pptx)</option>
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={() => nav("/dashboard")}
              className="px-4 py-2 bg-gray-600/40 rounded hover:bg-gray-600/60"
            >
              Cancel
            </button>

            <button
              onClick={create}
              disabled={loading}
              className="px-4 py-2 btn-neon rounded font-semibold"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
