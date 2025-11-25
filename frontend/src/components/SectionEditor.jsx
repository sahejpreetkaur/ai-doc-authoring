// src/components/SectionEditor.jsx
// @ts-nocheck
import { useState } from "react";
import api from "../api/axios";

export default function SectionEditor({ section, projectId, reload }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(section.content || "");
  const [prompt, setPrompt] = useState("");
  const [loadingRefine, setLoadingRefine] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // ---------------- SAVE ----------------
  const save = async () => {
    try {
      await api.put(
        `/projects/${projectId}/sections/${section.id}`,
        null,
        { params: { content: value } }
      );
      setEditing(false);
      reload();
    } catch {
      alert("Save failed");
    }
  };

  // ---------------- REFINE ----------------
  const refine = async (instr = null) => {
    const instruction = instr || prompt;
    if (!instruction.trim()) return alert("Enter refine prompt");

    try {
      setLoadingRefine(true);
      await api.post(
        `/projects/${projectId}/sections/${section.id}/refine`,
        null,
        { params: { instruction } }
      );
      setPrompt("");
      reload();
    } finally {
      setLoadingRefine(false);
    }
  };

  // ---------------- FEEDBACK ----------------
  const feedback = async (like) => {
    try {
      await api.post(
        `/projects/${projectId}/sections/${section.id}/feedback`,
        null,
        { params: { like } }
      );
      reload();
    } catch {
      alert("Feedback failed");
    }
  };

  // ---------------- MOVE UP/DOWN ----------------
  const move = async (direction) => {
    try {
      await api.post(
        `/projects/${projectId}/sections/${section.id}/move`,
        null,
        { params: { direction } }
      );
      reload();
    } catch {
      alert("Move failed");
    }
  };

  // ---------------- COMMENT SUBMIT ----------------
  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      await api.post(
        `/projects/${projectId}/sections/${section.id}/feedback`,
        null,
        { params: { comment: newComment } }
      );
      setNewComment("");
      reload();
    } catch {
      alert("Comment failed");
    }
  };

  return (
    <div
      className="
      card-glass p-7 rounded-2xl border border-white/10
      shadow-[0_0_22px_rgba(0,200,255,0.15)]
      hover:shadow-[0_0_30px_rgba(0,200,255,0.25)]
      transition-all duration-300
      "
    >
      {/* ---------- Header ---------- */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-cyan-300 tracking-wide drop-shadow-[0_0_6px_#00eaff]">
          {section.title}
        </h3>

        <div className="flex items-center gap-3">
          <button
            onClick={() => move("up")}
            className="px-2 py-1 rounded bg-gray-700/60 hover:bg-gray-600 text-xs"
          >
            ↑
          </button>
          <button
            onClick={() => move("down")}
            className="px-2 py-1 rounded bg-gray-700/60 hover:bg-gray-600 text-xs"
          >
            ↓
          </button>

          <div
            className="
            text-xs px-3 py-1 rounded-lg bg-white/10 border border-white/10
            text-gray-300
            "
          >
            👍 {section.likes || 0}
          </div>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="mt-2">
        {!editing ? (
          <div className="text-gray-200 whitespace-pre-wrap leading-relaxed">
            {section.content || (
              <span className="text-gray-500 italic">No content yet.</span>
            )}
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="
            w-full h-48 p-4 mt-2 rounded-xl
            bg-black/40 border border-white/10 text-gray-100
            focus:border-cyan-300 focus:shadow-[0_0_10px_rgba(0,200,255,0.4)]
            transition-all resize-y
            "
          ></textarea>
        )}
      </div>

      {/* ---------- Action Bar ---------- */}
      <div className="mt-6 flex items-center gap-4">

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-5 py-2 rounded-lg font-semibold bg-cyan-500 text-black"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={save}
              className="px-5 py-2 rounded-lg bg-green-500 text-black"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setValue(section.content || "");
              }}
              className="px-5 py-2 rounded-lg bg-gray-700/60 text-gray-200"
            >
              Cancel
            </button>
          </>
        )}

        {/* input */}
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Refine prompt…"
          className="ml-auto px-4 py-2 rounded-lg bg-black/40 border border-white/10"
        />

        <button
          onClick={() => refine()}
          className="px-5 py-2 rounded-lg bg-purple-600 text-white font-semibold"
        >
          {loadingRefine ? "Refining…" : "Refine"}
        </button>

        {/* Convert to Poem Button */}
        <button
          onClick={() => refine("Convert this content into a structured poem or verse with a creative tone, but meaning same.")}
          className="px-5 py-2 rounded-lg bg-pink-600 text-white"
        >
          Convert to Poem
        </button>

        <button
          onClick={() => feedback(true)}
          className="px-3 py-2 rounded-lg bg-green-600 text-white"
        >
          👍
        </button>

        <button
          onClick={() => feedback(false)}
          className="px-3 py-2 rounded-lg bg-red-600 text-white"
        >
          👎
        </button>

        {/* Show Comments */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="px-3 py-2 rounded-lg bg-blue-600 text-white"
        >
          💬
        </button>
      </div>

      {/* ---------- COMMENTS SECTION ---------- */}
      {showComments && (
        <div className="mt-6 bg-black/30 p-4 rounded-xl border border-white/10">
          <h4 className="text-lg font-semibold text-cyan-300 mb-3">
            Comments
          </h4>

          {/* comment list */}
          {(section.comments || []).length === 0 ? (
            <p className="text-gray-400">No comments yet.</p>
          ) : (
            section.comments.map((c) => (
              <div
                key={c.id}
                className="mb-3 p-3 bg-black/40 rounded border border-white/10"
              >
                <p className="text-gray-300">{c.text}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {new Date(c.created_at).toLocaleString()}
                </p>
              </div>
            ))
          )}

          {/* add comment */}
          <div className="flex mt-4 gap-3">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-gray-200"
            />

            <button
              onClick={addComment}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
