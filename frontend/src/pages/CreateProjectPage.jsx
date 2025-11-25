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
        name: name,
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card-glass w-full max-w-sm p-7 rounded-2xl shadow-[0_0_35px_rgba(0,200,255,0.25)]">
        
        <h1 className="text-3xl font-bold text-center mb-2">New Project</h1>
        <p className="text-gray-400 text-center mb-6">
          Start your AI-powered document.
        </p>

        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-300">Project Name</label>
            <input
              placeholder="AI Report"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Main Topic</label>
            <input
              placeholder="Market Analysis"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-gray-200"
            >
              <option value="docx">Word (.docx)</option>
              <option value="pptx">PowerPoint (.pptx)</option>
            </select>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => nav("/dashboard")}
              className="px-4 py-2 rounded-lg bg-gray-600/40 text-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={create}
              disabled={loading}
              className="px-5 py-2 rounded-lg font-semibold btn-neon"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
