// src/pages/ProjectPage.jsx
// @ts-nocheck


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import SectionEditor from "../components/SectionEditor";

export default function ProjectPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [project, setProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Rename state
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  // Add Section modal state
  const [showAdd, setShowAdd] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  // -------------------------------------
  // Load Project + Sections
  // -------------------------------------
  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setSections(res.data.sections || []);
      setNewName(res.data.name || "");
    } catch (err) {
      alert("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!project)
    return (
      <div className="page text-center text-gray-300 text-xl">
        Loading...
      </div>
    );

  // -------------------------------------
  // Rename Project
  // -------------------------------------
  const renameProject = async () => {
    if (!newName.trim()) return alert("Name cannot be empty");

    try {
      await api.put(`/projects/${id}`, null, {
        params: { name: newName },
      });

      setRenaming(false);
      load();
    } catch {
      alert("Rename failed");
    }
  };

  // -------------------------------------
  // Delete Project
  // -------------------------------------
  const deleteProject = async () => {
    if (!confirm("Delete this project?")) return;

    try {
      await api.delete(`/projects/${id}`);
      nav("/dashboard");
    } catch {
      alert("Delete failed");
    }
  };

  // -------------------------------------
  // Generate All (LLM)
  // -------------------------------------
  const generateAll = async () => {
    try {
      setLoading(true);
      await api.post(`/projects/${id}/generate`);
      load();
    } catch {
      alert("Generate failed");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------
  // Export .docx or .pptx
  // -------------------------------------
  const exportFile = async (format = "docx") => {
    try {
      const res = await api.get(`/projects/${id}/export?format=${format}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Export failed");
    }
  };

  // -------------------------------------
  // Add New Section
  // -------------------------------------
  const addSection = async () => {
    if (!newSectionTitle.trim()) return alert("Enter a section title");

    try {
      await api.post(`/projects/${id}/sections`, null, {
        params: { title: newSectionTitle },
      });

      setNewSectionTitle("");
      setShowAdd(false);
      load();
    } catch {
      alert("Failed to add section");
    }
  };

  return (
    <div className="page">

      {/* ---------------------- HEADER ---------------------- */}
      <div className="card-glass p-6 rounded-2xl mb-10">
        <div className="flex justify-between items-center">

          {/* Project Title */}
          <div>
            {!renaming ? (
              <>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <button
                  onClick={() => setRenaming(true)}
                  className="text-cyan-300 text-sm hover:underline mt-1"
                >
                  Rename
                </button>
              </>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  className="bg-black/30 border border-white/20 px-3 py-2 rounded-lg text-white"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />

                <button onClick={renameProject} className="btn-neon px-3 py-2">
                  Save
                </button>

                <button
                  onClick={() => setRenaming(false)}
                  className="px-3 py-2 bg-gray-600/40 rounded text-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}

            <p className="text-gray-400 mt-1">{project.main_topic}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">

  <button
    onClick={generateAll}
    disabled={loading}
    className="btn-neon px-5 py-2"
  >
    {loading ? "Generating..." : "Generate All"}
  </button>

  <button
  onClick={() => exportFile("docx")}
  className="cyber-btn"
>
  Export .docx
</button>


 <button
  onClick={() => exportFile("pptx")}
  className="cyber-btn"
>
  Export .pptx
</button>


  {/* ⭐ NEW BUTTON ⭐ */}
 <button
  onClick={() => nav(`/project/${project.id}/history`)}
  className="cyber-btn"
>
  View History
</button>


<button
  onClick={deleteProject}
  className="
    px-5 py-2 rounded-xl font-semibold
    bg-gradient-to-r from-[#FF3D3D] via-[#FF1A1A] to-[#FF6B6B]
    text-white
    shadow-[0_0_20px_rgba(255,60,60,0.8)]
    hover:shadow-[0_0_35px_rgba(255,60,60,1)]
    hover:scale-105 active:scale-95
    transition-all duration-300
  "
>
  Delete
</button>


</div>

        </div>
      </div>

      {/* ---------------------- ADD SECTION BUTTON ---------------------- */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2 bg-cyan-600/60 hover:bg-cyan-500 rounded-xl text-white shadow"
        >
          + Add Section
        </button>
      </div>

      {/* ---------------------- SECTION LIST ---------------------- */}
      <div className="space-y-8">
        {sections.length === 0 && (
          <div className="text-gray-400 text-center">No sections found.</div>
        )}

        {sections.map((s) => (
          <SectionEditor
            key={s.id}
            section={s}
            projectId={id}
            reload={load}
          />
        ))}
      </div>

      {/* ---------------------- ADD SECTION MODAL ---------------------- */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur">
          <div className="card-glass p-6 rounded-2xl w-[350px]">
            <h3 className="text-xl font-bold mb-3">Add New Section</h3>

            <input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Section title"
              className="w-full px-4 py-2 bg-black/40 border border-white/20 text-white rounded-lg"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 bg-gray-600/40 rounded text-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={addSection}
                className="px-4 py-2 bg-cyan-500 rounded text-black font-semibold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
